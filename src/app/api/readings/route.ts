// src/app/api/readings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reading from '@/models/Reading';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// 세션 ID 생성 또는 조회
async function getOrCreateSession(_request: NextRequest): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('tarot-session')?.value;
  
  if (!sessionId) {
    sessionId = uuidv4();
  }
  
  return sessionId;
}

// GET - 리딩 히스토리 조회
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const sessionId = await getOrCreateSession(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const questionType = searchParams.get('type');
    const spreadType = searchParams.get('spread');
    
    // 필터 조건 구성
    const filter: Record<string, unknown> = { userSession: sessionId };
    if (questionType && questionType !== 'all') {
      filter.questionType = questionType;
    }
    if (spreadType && spreadType !== 'all') {
      filter.spreadType = spreadType;
    }
    
    // 페이지네이션과 함께 조회
    const skip = (page - 1) * limit;
    const readings = await Reading.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // 전체 개수 조회
    const total = await Reading.countDocuments(filter);
    
    const response = NextResponse.json({
      success: true,
      data: {
        readings,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: readings.length,
          totalItems: total
        }
      }
    });
    
    // 세션 쿠키 설정
    response.cookies.set('tarot-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1년
    });
    
    return response;
    
  } catch (error) {
    console.error('Failed to fetch readings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch readings' },
      { status: 500 }
    );
  }
}

// POST - 새 리딩 저장
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const sessionId = await getOrCreateSession(request);
    const body = await request.json();
    
    const { question, spreadType, cards, interpretation, questionType } = body;
    
    // 유효성 검사
    if (!question || !spreadType || !cards || !interpretation || !questionType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (cards.length < 1 || cards.length > 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid number of cards' },
        { status: 400 }
      );
    }
    
    // 새 리딩 생성
    const newReading = new Reading({
      question,
      spreadType,
      cards,
      interpretation,
      questionType,
      userSession: sessionId
    });
    
    await newReading.save();
    
    const response = NextResponse.json({
      success: true,
      data: newReading
    });
    
    // 세션 쿠키 설정
    response.cookies.set('tarot-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1년
    });
    
    return response;
    
  } catch (error) {
    console.error('Failed to save reading:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save reading' },
      { status: 500 }
    );
  }
}