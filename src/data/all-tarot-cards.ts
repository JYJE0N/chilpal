// src/data/all-tarot-cards.ts

import { TarotCard, DrawnCard, Suit } from "@/types/tarot";

// 동적 import를 위한 캐시
let cardsCache: TarotCard[] | null = null;

// 동적으로 모든 카드 데이터를 로드
export async function getAllTarotCards(): Promise<TarotCard[]> {
  if (cardsCache) {
    return cardsCache;
  }

  // 병렬로 모든 카드 데이터 로드
  const [
    { majorArcanaCards },
    { cupsCards },
    { pentaclesCards },
    { swordsCards },
    { wandsCards }
  ] = await Promise.all([
    import("./major-arcana"),
    import("./cups-minor-arcana"),
    import("./pentacles-minor-arcana"),
    import("./swords-minor-arcana"),
    import("./wands-minor-arcana")
  ]);

  // 캐시에 저장
  cardsCache = [
    ...(majorArcanaCards as TarotCard[]),
    ...(cupsCards as TarotCard[]),
    ...(pentaclesCards as TarotCard[]),
    ...(swordsCards as TarotCard[]),
    ...(wandsCards as TarotCard[]),
  ];

  return cardsCache;
}

// 동기식 접근을 위한 백업 (기존 코드 호환성)
export const allTarotCards: TarotCard[] = [];

// 수트별 카드 가져오기 (동적)
export async function getCardsBySuit(suit: Suit): Promise<TarotCard[]> {
  const cards = await getAllTarotCards();
  return cards.filter((card) => card.suit === suit);
}

// ID로 카드 찾기 (동적)
export async function getCardById(id: number): Promise<TarotCard | undefined> {
  const cards = await getAllTarotCards();
  return cards.find((card) => card.id === id);
}

// Fisher-Yates 셔플 알고리즘
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 랜덤 카드 뽑기 (중복 방지) - 동적 로딩
export async function drawRandomCards(count: number): Promise<TarotCard[]> {
  const cards = await getAllTarotCards();
  
  if (count > cards.length) {
    console.warn(`요청된 카드 수 ${count}이 전체 카드 수 ${cards.length}보다 많습니다.`);
    count = cards.length;
  }
  
  const shuffled = shuffleArray(cards);
  return shuffled.slice(0, count);
};

// 카드 뒤집기 (메이저 아르카나만)
export const drawCardWithPosition = (card: TarotCard): DrawnCard => {
  const isReversed = card.has_reversal ? Math.random() < 0.5 : false;

  return {
    ...card,
    position: isReversed ? "reversed" : "upright",
    is_reversed: isReversed,
    current_meaning: isReversed
      ? card.reversed_meaning || card.upright_meaning
      : card.upright_meaning,
    current_interpretation: isReversed
      ? card.reversed_interpretation || card.upright_interpretation || ''
      : card.upright_interpretation || '',
    current_keywords: isReversed
      ? card.reversed_keywords || card.upright_keywords || []
      : card.upright_keywords || [],
  };
};

// 3장 뽑기 (과거-현재-미래) - 동적 로딩
export async function drawThreeCardSpread(): Promise<DrawnCard[]> {
  const cards = await drawRandomCards(3);
  return cards.map(drawCardWithPosition);
}

// 통계 정보 가져오기 (동적)
export async function getDeckStats() {
  const allCards = await getAllTarotCards();
  const majorCards = await getCardsBySuit("major");
  const cupsCards = await getCardsBySuit("cups");
  const pentaclesCards = await getCardsBySuit("pentacles");
  const swordsCards = await getCardsBySuit("swords");
  const wandsCards = await getCardsBySuit("wands");
  
  return {
    total: allCards.length,
    major: majorCards.length,
    minor: allCards.length - majorCards.length,
    cups: cupsCards.length,
    pentacles: pentaclesCards.length,
    swords: swordsCards.length,
    wands: wandsCards.length,
  };
};

// 카드 ID 중복 검사 (비동기)
export async function checkDuplicateIds() {
  const allCards = await getAllTarotCards();
  const ids = allCards.map(card => card.id);
  const uniqueIds = new Set(ids);
  
  if (ids.length !== uniqueIds.size) {
    console.error('🚨 카드 ID 중복 발견!');
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    console.error('중복된 ID들:', [...new Set(duplicates)]);
    return false;
  } else {
    console.log('✅ 카드 ID 중복 검사 통과');
    return true;
  }
}
