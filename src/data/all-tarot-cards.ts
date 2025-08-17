// src/data/all-tarot-cards.ts

import { TarotCard, DrawnCard, Suit } from "@/types/tarot";

// 임포트된 카드 데이터들
import { majorArcanaCards } from "./major-arcana";
import { cupsCards } from "./cups-minor-arcana";
import { pentaclesCards } from "./pentacles-minor-arcana";
import { swordsCards } from "./swords-minor-arcana";
import { wandsCards } from "./wands-minor-arcana";

// 전체 카드 덱 (78장 완성!) - 타입 단언으로 해결
export const allTarotCards: TarotCard[] = [
  ...(majorArcanaCards as TarotCard[]),
  ...(cupsCards as TarotCard[]),
  ...(pentaclesCards as TarotCard[]),
  ...(swordsCards as TarotCard[]),
  ...(wandsCards as TarotCard[]),
];

// 수트별 카드 가져오기
export const getCardsBySuit = (suit: Suit): TarotCard[] => {
  return allTarotCards.filter((card) => card.suit === suit);
};

// ID로 카드 찾기
export const getCardById = (id: number): TarotCard | undefined => {
  return allTarotCards.find((card) => card.id === id);
};

// Fisher-Yates 셔플 알고리즘
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 랜덤 카드 뽑기 (중복 방지)
export const drawRandomCards = (count: number): TarotCard[] => {
  if (count > allTarotCards.length) {
    console.warn(`요청된 카드 수 ${count}이 전체 카드 수 ${allTarotCards.length}보다 많습니다.`);
    count = allTarotCards.length;
  }
  
  const shuffled = shuffleArray(allTarotCards);
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

// 3장 뽑기 (과거-현재-미래)
export const drawThreeCardSpread = (): DrawnCard[] => {
  const cards = drawRandomCards(3);
  return cards.map(drawCardWithPosition);
};

// 통계 정보 (전체 78장 완성!)
export const DECK_STATS = {
  total: allTarotCards.length,
  major: getCardsBySuit("major").length,
  minor: allTarotCards.length - getCardsBySuit("major").length,
  cups: getCardsBySuit("cups").length,
  pentacles: getCardsBySuit("pentacles").length,
  swords: getCardsBySuit("swords").length,
  wands: getCardsBySuit("wands").length,
};

// 카드 ID 중복 검사
const checkDuplicateIds = () => {
  const ids = allTarotCards.map(card => card.id);
  const uniqueIds = new Set(ids);
  
  if (ids.length !== uniqueIds.size) {
    console.error('🚨 카드 ID 중복 발견!');
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    console.error('중복된 ID들:', [...new Set(duplicates)]);
  } else {
    console.log('✅ 카드 ID 중복 검사 통과');
  }
};

// 개발 환경에서만 중복 검사 실행
if (process.env.NODE_ENV === 'development') {
  checkDuplicateIds();
}

// 디버깅용 로그 (프로덕션에서는 주석 처리)
// console.log(`🎴 칠팔 타로 데이터 로드 완료!`);
// console.log(
//   `📊 총 ${DECK_STATS.total}장 | 메이저: ${DECK_STATS.major}장 | 마이너: ${DECK_STATS.minor}장`
// );
// console.log(
//   `💕 컵: ${DECK_STATS.cups}장 | 💰 펜타클: ${DECK_STATS.pentacles}장 | ⚔️ 소드: ${DECK_STATS.swords}장 | 🔥 완드: ${DECK_STATS.wands}장`
// );
