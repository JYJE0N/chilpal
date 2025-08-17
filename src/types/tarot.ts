// src/types/tarot.ts

export type Suit = "major" | "cups" | "pentacles" | "swords" | "wands";

export type CardPosition = "upright" | "reversed";

export interface TarotCard {
  id: number;
  name: string;
  suit: Suit;
  number?: number | "page" | "knight" | "queen" | "king"; // 메이저는 undefined, 마이너는 1-14 또는 court cards

  // 기본 정보
  upright_meaning: string;
  upright_interpretation: string;
  upright_keywords: string[];

  // 메이저 아르카나만 역방향 보유
  reversed_meaning?: string;
  reversed_interpretation?: string;
  reversed_keywords?: string[];

  // 메타데이터
  has_reversal: boolean; // 메이저=true, 마이너=false
  image_url: string;
  description?: string;
}

export interface DrawnCard extends TarotCard {
  position: CardPosition;
  is_reversed: boolean;
  current_meaning: string;
  current_interpretation: string;
  current_keywords: string[];
}

export type SpreadType = "one-card" | "three-card" | "celtic-cross" | "relationship" | "love-spread" | "career-path" | "yes-no";

export interface Reading {
  id: string;
  question: string;
  spreadType: SpreadType;
  cards: DrawnCard[];
  interpretation: string;
  questionType: 'love' | 'career' | 'money' | 'health' | 'general';
  userSession?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardSpread {
  id: string;
  name: string;
  description: string;
  positions: {
    name: string;
    meaning: string;
    x: number; // CSS position
    y: number;
  }[];
}

// 유틸리티 타입들
export type MajorArcana = TarotCard & {
  suit: "major";
  number: undefined;
  has_reversal: true;
};

export type MinorArcana = TarotCard & {
  suit: "cups" | "pentacles" | "swords" | "wands";
  number: number | string;
  has_reversal: false;
  reversed_meaning: undefined;
  reversed_interpretation: undefined;
  reversed_keywords: undefined;
};

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CardDrawResponse {
  cards: DrawnCard[];
  remaining_cards: number;
}

export interface ReadingResponse {
  reading: Reading;
  cards: DrawnCard[];
}
