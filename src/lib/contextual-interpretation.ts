import { TarotCard, DrawnCard } from '@/types/tarot';
import { formatCardName, 은는, 이가, 을를 } from './korean-utils';
import { majorArcanaContexts } from '@/data/contextual-interpretations';
import { cardSynergies as importedCardSynergies } from '@/data/card-synergies';

// 질문 유형별 해석 컨텍스트
export interface InterpretationContext {
  love: string;
  career: string;
  money: string;
  health: string;
  general: string;
}

// 카드 조합 시너지
export interface CardSynergy {
  cards: string[];  // 카드 이름 배열
  interpretation: string;
  strength: 'strong' | 'moderate' | 'subtle';
}

// 컨텍스트별 카드 해석 데이터 - 외부 파일에서 가져옴
export const contextualInterpretations = majorArcanaContexts;

// 카드 조합 시너지 데이터 - 외부 파일에서 가져옴
export const cardSynergies = importedCardSynergies;

// 컨텍스트 기반 해석 생성
export function getContextualInterpretation(
  card: TarotCard,
  questionType: string,
  isReversed: boolean = false
): string {
  const context = contextualInterpretations[card.name];
  
  if (!context) {
    // 기본 해석 반환
    return isReversed && card.reversed_interpretation
      ? card.reversed_interpretation 
      : card.upright_interpretation;
  }

  let interpretation = context[questionType as keyof InterpretationContext] || context.general;
  
  // 역방향인 경우 해석 수정 (카드명 없이, 통일된 문체)
  if (isReversed) {
    interpretation = `${interpretation} 하지만 장애물이나 지연이 있을 수 있습니다. 혹은 이 에너지가 과도하거나 부족한 상태일 수 있습니다.`;
  }

  // 카드명 없이 해석만 반환 (UI에서 별도 표시)
  return interpretation;
}

// 카드 조합 시너지 분석
export function analyzeSynergy(cards: DrawnCard[]): string[] {
  const synergies: string[] = [];
  const cardNames = cards.map(c => c.name);

  for (const synergy of cardSynergies) {
    // 모든 시너지 카드가 뽑힌 카드에 포함되는지 확인
    const hasAllCards = synergy.cards.every(synergyCard => 
      cardNames.includes(synergyCard)
    );

    if (hasAllCards) {
      const cardNamesStr = synergy.cards
        .map((name, idx) => {
          if (idx === 0) return name;
          if (idx === synergy.cards.length - 1) return 이가(name);
          return name;
        })
        .join(' ');

      synergies.push(
        `${cardNamesStr} 함께 나타남: ${synergy.interpretation}`
      );
    }
  }

  return synergies;
}

// 종합 해석 생성 (컨텍스트 + 시너지)
export function generateComprehensiveInterpretation(
  cards: DrawnCard[],
  questionType: string,
  userQuestion: string
): {
  cardInterpretations: Array<{
    position?: string;
    cardName: string;
    interpretation: string;
  }>;
  synergies: string[];
  advice: string;
} {
  const result = {
    cardInterpretations: [] as Array<{
      position?: string;
      cardName: string;
      interpretation: string;
    }>,
    synergies: [] as string[],
    advice: ''
  };
  
  // 1. 개별 카드 컨텍스트 해석
  cards.forEach((card, idx) => {
    const contextInterpretation = getContextualInterpretation(
      card,
      questionType,
      card.position === 'reversed'
    );
    
    if (cards.length === 3) {
      const positions = ['과거', '현재', '미래'];
      result.cardInterpretations.push({
        position: positions[idx],
        cardName: card.name,
        interpretation: contextInterpretation
      });
    } else {
      result.cardInterpretations.push({
        cardName: card.name,
        interpretation: contextInterpretation
      });
    }
  });

  // 2. 카드 시너지 분석
  result.synergies = analyzeSynergy(cards);

  // 3. 종합 조언
  result.advice = generateAdvice(cards, questionType, userQuestion);

  return result;
}

// 질문 유형과 카드에 따른 조언 생성
function generateAdvice(
  cards: DrawnCard[],
  questionType: string,
  userQuestion: string
): string {
  const adviceTemplates = {
    love: [
      '감정에 충실하되 이성적 판단도 잊지 마세요.',
      '상대방의 입장에서 생각해보는 시간을 가져보세요.',
      '진정한 사랑은 시간이 필요합니다. 인내심을 가지세요.'
    ],
    career: [
      '목표를 명확히 하고 단계별로 실행하세요.',
      '동료들과의 협력이 성공의 열쇠입니다.',
      '새로운 기술이나 지식을 습득할 좋은 시기입니다.'
    ],
    money: [
      '충동적인 결정보다는 신중한 계획이 필요합니다.',
      '작은 것부터 시작하여 점진적으로 확대하세요.',
      '투자는 분산하고 리스크를 관리하세요.'
    ],
    health: [
      '규칙적인 생활 습관이 건강의 기초입니다.',
      '스트레스 관리에 신경 쓰세요.',
      '예방이 치료보다 중요합니다.'
    ],
    general: [
      '현재 상황을 객관적으로 바라보세요.',
      '변화를 두려워하지 말고 받아들이세요.',
      '내면의 목소리에 귀 기울이세요.'
    ]
  };

  // 카드의 전반적인 에너지 분석
  const hasPositiveCards = cards.some(c => 
    ['The Sun', 'The Star', 'The World', 'The Empress', 'Ten of Cups'].includes(c.name)
  );
  const hasChallengeCards = cards.some(c => 
    ['The Tower', 'Death', 'The Devil', 'Five of Swords', 'Three of Swords'].includes(c.name)
  );

  let advice = adviceTemplates[questionType as keyof typeof adviceTemplates]?.[0] || 
                adviceTemplates.general[0];

  if (hasPositiveCards && !hasChallengeCards) {
    advice += ' 긍정적인 에너지가 강하니 자신감을 가지고 추진하세요.';
  } else if (hasChallengeCards && !hasPositiveCards) {
    advice += ' 어려운 시기지만 이것도 성장의 과정입니다. 포기하지 마세요.';
  } else {
    advice += ' 균형을 유지하면서 신중하게 진행하세요.';
  }

  return advice;
}