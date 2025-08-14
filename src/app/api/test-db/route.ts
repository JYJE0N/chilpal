// src/app/api/test-db/route.ts

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: '✅ MongoDB 연결 성공!',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '❌ MongoDB 연결 실패',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}