// src/models/Reading.ts

import mongoose, { Schema, Document } from 'mongoose';
import { DrawnCard } from '@/types/tarot';

export interface IReading extends Document {
  question: string;
  spreadType: 'three-card' | 'one-card';
  cards: DrawnCard[];
  interpretation: string;
  questionType: 'love' | 'career' | 'money' | 'health' | 'general';
  userSession?: string; // 세션 기반 구분
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  suit: { 
    type: String, 
    required: true,
    enum: ['major', 'cups', 'pentacles', 'swords', 'wands']
  },
  number: { type: Schema.Types.Mixed },
  upright_meaning: { type: String, required: true },
  upright_interpretation: { type: String, required: true },
  upright_keywords: [{ type: String }],
  reversed_meaning: { type: String },
  reversed_interpretation: { type: String },
  reversed_keywords: [{ type: String }],
  has_reversal: { type: Boolean, required: true },
  image_url: { type: String, required: true },
  description: { type: String },
  // DrawnCard specific fields
  position: { 
    type: String, 
    required: true,
    enum: ['upright', 'reversed']
  },
  is_reversed: { type: Boolean, required: true },
  current_meaning: { type: String, required: true },
  current_interpretation: { type: String, required: true },
  current_keywords: [{ type: String }]
}, { _id: false });

const ReadingSchema = new Schema<IReading>({
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  spreadType: {
    type: String,
    required: true,
    enum: ['three-card', 'one-card']
  },
  cards: {
    type: [CardSchema],
    required: true,
    validate: {
      validator: function(cards: DrawnCard[]) {
        return cards.length >= 1 && cards.length <= 3;
      },
      message: 'Cards array must contain 1-3 cards'
    }
  },
  interpretation: {
    type: String,
    required: true,
    maxlength: 5000
  },
  questionType: {
    type: String,
    required: true,
    enum: ['love', 'career', 'money', 'health', 'general']
  },
  userSession: {
    type: String,
    index: true // 세션별 조회 최적화
  }
}, {
  timestamps: true, // createdAt, updatedAt 자동 생성
  collection: 'readings'
});

// 인덱스 설정
ReadingSchema.index({ userSession: 1, createdAt: -1 });
ReadingSchema.index({ questionType: 1 });
ReadingSchema.index({ spreadType: 1 });

// 가상 필드 - 상대적 시간
ReadingSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInMs = now.getTime() - this.createdAt.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return `${minutes}분 전`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}시간 전`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days}일 전`;
  } else {
    return this.createdAt.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
});

// 정적 메소드들
ReadingSchema.statics.getRecentReadings = function(userSession: string, limit: number = 10) {
  return this.find({ userSession })
    .sort({ createdAt: -1 })
    .limit(limit);
};

ReadingSchema.statics.getReadingsByType = function(userSession: string, questionType: string) {
  return this.find({ userSession, questionType })
    .sort({ createdAt: -1 });
};

ReadingSchema.statics.getReadingStats = function(userSession: string) {
  return this.aggregate([
    { $match: { userSession } },
    {
      $group: {
        _id: null,
        totalReadings: { $sum: 1 },
        questionTypes: { 
          $push: '$questionType' 
        },
        spreadTypes: { 
          $push: '$spreadType' 
        },
        allCards: { 
          $push: '$cards' 
        },
        lastReading: { $max: '$createdAt' }
      }
    }
  ]);
};

// 모델 export (이미 존재하면 기존 모델 사용)
export default mongoose.models.Reading || mongoose.model<IReading>('Reading', ReadingSchema);