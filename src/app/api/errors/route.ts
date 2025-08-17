// src/app/api/errors/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { ErrorReport } from '@/lib/error-monitoring';
import mongoose from 'mongoose';

// 에러 스키마 정의
const ErrorSchema = new mongoose.Schema({
  errorId: { type: String, required: true, unique: true },
  message: { type: String, required: true },
  stack: { type: String },
  fingerprint: { type: String, required: true, index: true },
  level: { 
    type: String, 
    required: true, 
    enum: ['error', 'warning', 'info'],
    index: true 
  },
  component: { type: String, index: true },
  action: { type: String, index: true },
  url: { type: String },
  userAgent: { type: String },
  userSession: { type: String, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  count: { type: Number, default: 1 }, // 같은 에러 발생 횟수
  firstOccurred: { type: Date, default: Date.now },
  lastOccurred: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false, index: true }
}, {
  timestamps: true,
  collection: 'errors'
});

// 복합 인덱스
ErrorSchema.index({ fingerprint: 1, createdAt: -1 });
ErrorSchema.index({ level: 1, createdAt: -1 });
ErrorSchema.index({ resolved: 1, createdAt: -1 });

const ErrorModel = mongoose.models.Error || mongoose.model('Error', ErrorSchema);

// POST - 에러 보고
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const errorData: ErrorReport = await request.json();
    
    // 기본 검증
    if (!errorData.message || !errorData.fingerprint) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 같은 핑거프린트의 에러가 이미 존재하는지 확인
    const existingError = await ErrorModel.findOne({ 
      fingerprint: errorData.fingerprint 
    });

    if (existingError) {
      // 기존 에러 업데이트 (발생 횟수 증가)
      existingError.count += 1;
      existingError.lastOccurred = new Date();
      existingError.metadata = {
        ...existingError.metadata,
        ...errorData.context.metadata
      };
      await existingError.save();
      
      return NextResponse.json({ 
        success: true, 
        errorId: existingError.errorId,
        isNew: false,
        count: existingError.count
      });
    }

    // 새 에러 생성
    const newError = new ErrorModel({
      errorId: errorData.id,
      message: errorData.message,
      stack: errorData.stack,
      fingerprint: errorData.fingerprint,
      level: errorData.context.level,
      component: errorData.context.component,
      action: errorData.context.action,
      url: errorData.context.url,
      userAgent: errorData.context.userAgent,
      userSession: errorData.context.userSession,
      metadata: errorData.context.metadata,
      firstOccurred: errorData.context.timestamp,
      lastOccurred: errorData.context.timestamp
    });

    const savedError = await newError.save();
    
    return NextResponse.json({ 
      success: true, 
      errorId: savedError.errorId,
      isNew: true,
      count: 1
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to save error report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save error report' },
      { status: 500 }
    );
  }
}

// GET - 에러 조회 (관리자용)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const level = searchParams.get('level');
    const component = searchParams.get('component');
    const resolved = searchParams.get('resolved');
    const fingerprint = searchParams.get('fingerprint');

    // 쿼리 구성
    const query: any = {};
    if (level) query.level = level;
    if (component) query.component = component;
    if (resolved !== null) query.resolved = resolved === 'true';
    if (fingerprint) query.fingerprint = fingerprint;

    // 에러 조회
    const errors = await ErrorModel
      .find(query)
      .sort({ lastOccurred: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // 총 개수
    const total = await ErrorModel.countDocuments(query);

    // 통계 정보
    const stats = await ErrorModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalErrors: { $sum: 1 },
          totalOccurrences: { $sum: '$count' },
          unresolvedCount: {
            $sum: { $cond: [{ $eq: ['$resolved', false] }, 1, 0] }
          },
          levelBreakdown: {
            $push: '$level'
          },
          componentBreakdown: {
            $push: '$component'
          }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      errors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        totalErrors: 0,
        totalOccurrences: 0,
        unresolvedCount: 0,
        levelBreakdown: [],
        componentBreakdown: []
      }
    });

  } catch (error) {
    console.error('Failed to fetch errors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch errors' },
      { status: 500 }
    );
  }
}

// PATCH - 에러 상태 업데이트 (해결됨 표시)
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    
    const { errorIds, resolved } = await request.json();
    
    if (!Array.isArray(errorIds) || typeof resolved !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const result = await ErrorModel.updateMany(
      { errorId: { $in: errorIds } },
      { resolved }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Failed to update errors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update errors' },
      { status: 500 }
    );
  }
}