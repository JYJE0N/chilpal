// src/app/api/readings/stats/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reading from '@/models/Reading';
import { cookies } from 'next/headers';

// GET - 리딩 통계 조회
export async function GET(_request: NextRequest) {
  try {
    await connectDB();
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('tarot-session')?.value;
    
    if (!sessionId) {
      return NextResponse.json({
        success: true,
        data: {
          totalReadings: 0,
          questionTypes: {},
          spreadTypes: {},
          favoriteCards: [],
          recentActivity: []
        }
      });
    }
    
    // 기본 통계
    const totalReadings = await Reading.countDocuments({ userSession: sessionId });
    
    // 질문 유형별 통계
    const questionTypeStats = await Reading.aggregate([
      { $match: { userSession: sessionId } },
      { $group: { _id: '$questionType', count: { $sum: 1 } } }
    ]);
    
    // 스프레드 유형별 통계
    const spreadTypeStats = await Reading.aggregate([
      { $match: { userSession: sessionId } },
      { $group: { _id: '$spreadType', count: { $sum: 1 } } }
    ]);
    
    // 가장 자주 나온 카드들
    const cardStats = await Reading.aggregate([
      { $match: { userSession: sessionId } },
      { $unwind: '$cards' },
      { 
        $group: { 
          _id: {
            id: '$cards.id',
            name: '$cards.name',
            suit: '$cards.suit'
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // 최근 활동 (최근 7일)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActivity = await Reading.find({
      userSession: sessionId,
      createdAt: { $gte: sevenDaysAgo }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('question questionType spreadType createdAt')
    .lean();
    
    // 데이터 포맷팅
    const questionTypes = questionTypeStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    const spreadTypes = spreadTypeStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    
    const favoriteCards = cardStats.map(item => ({
      cardId: item._id.id,
      name: item._id.name,
      suit: item._id.suit,
      count: item.count
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        totalReadings,
        questionTypes,
        spreadTypes,
        favoriteCards,
        recentActivity
      }
    });
    
  } catch (error) {
    console.error('Failed to fetch reading stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}