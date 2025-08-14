// src/lib/reading-history.ts

import { DrawnCard } from "@/types/tarot";

export interface ReadingRecord {
  id: string;
  question: string;
  spreadType: "three-card" | "one-card";
  cards: DrawnCard[];
  interpretation: string;
  timestamp: number;
  questionType: string; // love, career, money, health, general
}

export interface ReadingStats {
  totalReadings: number;
  favoriteCards: { [cardId: number]: number };
  questionTypes: { [type: string]: number };
  spreadTypes: { [type: string]: number;
  lastReading: number;
}

const STORAGE_KEY = 'tarot-reading-history';
const STATS_KEY = 'tarot-reading-stats';

// 히스토리 저장
export const saveReading = (reading: Omit<ReadingRecord, 'id' | 'timestamp'>): ReadingRecord => {
  const newReading: ReadingRecord = {
    ...reading,
    id: generateId(),
    timestamp: Date.now()
  };

  const history = getReadingHistory();
  history.unshift(newReading); // 최신순으로 추가
  
  // 최대 100개까지만 저장
  if (history.length > 100) {
    history.splice(100);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  updateStats(newReading);
  
  return newReading;
};

// 히스토리 조회
export const getReadingHistory = (): ReadingRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load reading history:', error);
    return [];
  }
};

// 특정 리딩 조회
export const getReadingById = (id: string): ReadingRecord | null => {
  const history = getReadingHistory();
  return history.find(reading => reading.id === id) || null;
};

// 히스토리 삭제
export const deleteReading = (id: string): boolean => {
  try {
    const history = getReadingHistory();
    const filteredHistory = history.filter(reading => reading.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
    return true;
  } catch (error) {
    console.error('Failed to delete reading:', error);
    return false;
  }
};

// 전체 히스토리 삭제
export const clearHistory = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear history:', error);
    return false;
  }
};

// 통계 업데이트
const updateStats = (reading: ReadingRecord): void => {
  try {
    const stats = getReadingStats();
    
    stats.totalReadings++;
    stats.lastReading = reading.timestamp;
    stats.questionTypes[reading.questionType] = (stats.questionTypes[reading.questionType] || 0) + 1;
    stats.spreadTypes[reading.spreadType] = (stats.spreadTypes[reading.spreadType] || 0) + 1;
    
    // 카드 사용 빈도 업데이트
    reading.cards.forEach(card => {
      stats.favoriteCards[card.id] = (stats.favoriteCards[card.id] || 0) + 1;
    });
    
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to update stats:', error);
  }
};

// 통계 조회
export const getReadingStats = (): ReadingStats => {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    return stored ? JSON.parse(stored) : {
      totalReadings: 0,
      favoriteCards: {},
      questionTypes: {},
      spreadTypes: {},
      lastReading: 0
    };
  } catch (error) {
    console.error('Failed to load stats:', error);
    return {
      totalReadings: 0,
      favoriteCards: {},
      questionTypes: {},
      spreadTypes: {},
      lastReading: 0
    };
  }
};

// 가장 자주 나온 카드 Top 5
export const getFavoriteCards = (): Array<{ cardId: number; count: number }> => {
  const stats = getReadingStats();
  return Object.entries(stats.favoriteCards)
    .map(([cardId, count]) => ({ cardId: parseInt(cardId), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

// 최근 질문 패턴 분석
export const getRecentQuestionPatterns = (): string[] => {
  const history = getReadingHistory();
  const recent = history.slice(0, 10);
  
  const patterns: { [key: string]: number } = {};
  recent.forEach(reading => {
    patterns[reading.questionType] = (patterns[reading.questionType] || 0) + 1;
  });
  
  return Object.entries(patterns)
    .sort(([,a], [,b]) => b - a)
    .map(([type]) => type);
};

// ID 생성
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 날짜 포맷팅
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60);
    return `${minutes}분 전`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}시간 전`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

// 질문 요약 (긴 질문을 짧게)
export const summarizeQuestion = (question: string, maxLength: number = 30): string => {
  if (question.length <= maxLength) return question;
  return question.substring(0, maxLength) + '...';
};