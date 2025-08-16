// src/app/api/readings/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reading from '@/models/Reading';
import { cookies } from 'next/headers';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET - 특정 리딩 조회
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    await dbConnect();
    
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const isShared = searchParams.get('shared') === 'true';
    
    // 공유 링크가 아닌 경우에만 세션 체크
    if (!isShared) {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('tarot-session')?.value;
      
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: 'Session not found' },
          { status: 401 }
        );
      }
      
      const reading = await Reading.findOne({
        _id: resolvedParams.id,
        userSession: sessionId
      }).lean();
      
      if (!reading) {
        return NextResponse.json(
          { success: false, error: 'Reading not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: reading
      });
    } else {
      // 공유 링크인 경우 세션 체크 없이 읽기 전용으로 접근
      const reading = await Reading.findById(resolvedParams.id).lean();
      
      if (!reading) {
        return NextResponse.json(
          { success: false, error: 'Reading not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: reading
      });
    }
    
  } catch (error) {
    console.error('Failed to fetch reading:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reading' },
      { status: 500 }
    );
  }
}

// DELETE - 리딩 삭제
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('tarot-session')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 401 }
      );
    }
    
    const resolvedParams = await params;
    const reading = await Reading.findOneAndDelete({
      _id: resolvedParams.id,
      userSession: sessionId
    });
    
    if (!reading) {
      return NextResponse.json(
        { success: false, error: 'Reading not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Reading deleted successfully'
    });
    
  } catch (error) {
    console.error('Failed to delete reading:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete reading' },
      { status: 500 }
    );
  }
}