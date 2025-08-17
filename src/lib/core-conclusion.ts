import { DrawnCard } from '@/types/tarot';
import { SpreadType } from '@/types/spreads';
/**
 * 핵심결론 생성 함수
 * 모든 스프레드 타입에 대해 일관되고 간략한 결론을 생성
 * - 이모지 사용 안 함
 * - 자연스러운 한국어 조사 활용
 * - 켈틱 크로스처럼 간략하고 핵심적인 메시지
 */

// 간단한 조사 처리 함수
function addJosa(word: string, josa: string): string {
  if (!word) return word;
  
  const lastChar = word.charAt(word.length - 1);
  const charCode = lastChar.charCodeAt(0);
  
  // 한글인지 확인
  if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
    const hasJongseong = (charCode - 0xAC00) % 28 !== 0;
    
    switch (josa) {
      case '이/가':
        return word + (hasJongseong ? '이' : '가');
      case '을/를':
        return word + (hasJongseong ? '을' : '를');
      case '은/는':
        return word + (hasJongseong ? '은' : '는');
      case '과/와':
        return word + (hasJongseong ? '과' : '와');
      case '로/으로':
        return word + (hasJongseong ? '으로' : '로');
      case '에서/서':
        return word + (hasJongseong ? '에서' : '서');
      case '의':
        return word + '의';
      default:
        return word;
    }
  }
  
  // 한글이 아닌 경우 기본값 반환
  return word;
}
export function generateCoreConclusion(
  spreadType: SpreadType,
  cards: DrawnCard[],
  question: string,
  questionType: string
): string {
  if (!cards || cards.length === 0) {
    return '카드를 선택해주세요.';
  }

  switch (spreadType) {
    case 'one-card':
      return generateOneCardConclusion(cards[0], questionType);
    case 'three-card':
      return generateThreeCardConclusion(cards, questionType);
    case 'celtic-cross':
      return generateCelticCrossConclusion(cards, questionType);
    case 'relationship':
      return generateRelationshipConclusion(cards, questionType);
    case 'love-spread':
      return generateLoveSpreadConclusion(cards, questionType);
    case 'career-path':
      return generateCareerPathConclusion(cards, questionType);
    case 'yes-no':
      return generateYesNoConclusion(cards, questionType);
    default:
      return generateDefaultConclusion(cards, questionType);
  }
}

/**
 * 1카드 핵심결론
 */
function generateOneCardConclusion(card: DrawnCard, questionType: string): string {
  const keyword = card.current_keywords?.[0] || '변화';
  const cardName = card.name;
  
  const templates = {
    love: [
      `${addJosa(cardName, '이/가')} 말하는 바는 ${addJosa(keyword, '이/가')} 핵심입니다.`,
      `${addJosa(keyword, '을/를')} 통해 관계의 진전을 기대할 수 있습니다.`,
      `${addJosa(cardName, '은/는')} 감정의 ${keyword} 시기임을 나타냅니다.`
    ],
    career: [
      `직업적으로 ${addJosa(keyword, '이/가')} 중요한 시점입니다.`,
      `${addJosa(cardName, '이/가')} 보여주는 ${keyword}의 방향으로 나아가세요.`,
      `업무에서 ${addJosa(keyword, '을/를')} 활용하는 것이 핵심입니다.`
    ],
    money: [
      `재정적으로 ${addJosa(keyword, '이/가')} 영향을 미칠 것입니다.`,
      `${addJosa(cardName, '은/는')} 경제적 ${keyword}를 암시합니다.`,
      `금전 관리에서 ${addJosa(keyword, '이/가')} 관건입니다.`
    ],
    health: [
      `건강 측면에서 ${addJosa(keyword, '이/가')} 중요합니다.`,
      `${addJosa(cardName, '은/는')} 몸과 마음의 ${keyword}를 나타냅니다.`,
      `현재 컨디션에 ${addJosa(keyword, '이/가')} 작용하고 있습니다.`
    ],
    general: [
      `전반적으로 ${addJosa(keyword, '이/가')} 핵심 주제입니다.`,
      `${addJosa(cardName, '이/가')} 가리키는 ${keyword}에 주목하세요.`,
      `현재 상황에서 ${addJosa(keyword, '을/를')} 고려하는 것이 중요합니다.`
    ]
  };
  
  const categoryTemplates = templates[questionType as keyof typeof templates] || templates.general;
  const template = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  
  return template;
}

/**
 * 3카드 핵심결론
 */
function generateThreeCardConclusion(cards: DrawnCard[], questionType: string): string {
  const [past, present, future] = cards;
  const pastKeyword = past.current_keywords?.[0] || '과거';
  const presentKeyword = present.current_keywords?.[0] || '현재';
  const futureKeyword = future.current_keywords?.[0] || '미래';
  
  const templates = [
    `${addJosa(pastKeyword, '에서/서')} ${addJosa(presentKeyword, '로/으로')} 이어지며, ${addJosa(futureKeyword, '이/가')} 결과로 나타날 것입니다.`,
    `과거의 ${pastKeyword}가 현재의 ${presentKeyword}를 만들었고, 미래에는 ${addJosa(futureKeyword, '이/가')} 기다리고 있습니다.`,
    `${addJosa(presentKeyword, '이/가')} 현재 상황이며, ${addJosa(futureKeyword, '로/으로')} 발전해 나갈 것입니다.`,
    `${addJosa(pastKeyword, '에서/서')} 벗어나 ${addJosa(presentKeyword, '을/를')} 거쳐 ${addJosa(futureKeyword, '로/으로')} 향하는 흐름입니다.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 켈틱 크로스 핵심결론
 */
function generateCelticCrossConclusion(cards: DrawnCard[], questionType: string): string {
  const present = cards[0];
  const outcome = cards[9];
  
  if (!present || !outcome) {
    return generateDefaultConclusion(cards.filter(card => card), questionType);
  }
  
  const presentKeyword = present.current_keywords?.[0] || '현재상황';
  const outcomeKeyword = outcome.current_keywords?.[0] || '결과';
  
  const templates = [
    `현재의 ${presentKeyword}를 바탕으로 ${addJosa(outcomeKeyword, '이/가')} 최종 결과로 나타날 것입니다.`,
    `${addJosa(presentKeyword, '에서/서')} 시작하여 ${addJosa(outcomeKeyword, '로/으로')} 귀결되는 여정입니다.`,
    `핵심은 ${presentKeyword}를 이해하고 ${addJosa(outcomeKeyword, '을/를')} 준비하는 것입니다.`,
    `${addJosa(presentKeyword, '이/가')} 바탕이 되어 ${addJosa(outcomeKeyword, '의')} 성취로 이어질 것입니다.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 관계 스프레드 핵심결론
 */
function generateRelationshipConclusion(cards: DrawnCard[], questionType: string): string {
  const you = cards[0];
  const them = cards[1];
  const relationship = cards[2];
  
  if (!you || !them || !relationship) {
    return generateDefaultConclusion(cards.filter(card => card), questionType);
  }
  
  const youKeyword = you.current_keywords?.[0] || '당신의상태';
  const themKeyword = them.current_keywords?.[0] || '상대방상태';
  const relationshipKeyword = relationship.current_keywords?.[0] || '관계';
  
  const templates = [
    `당신의 ${youKeyword}와 상대방의 ${themKeyword}가 만나 ${addJosa(relationshipKeyword, '의')} 관계를 형성합니다.`,
    `${addJosa(youKeyword, '과/와')} ${themKeyword}의 조화가 ${addJosa(relationshipKeyword, '을/를')} 결정짓습니다.`,
    `관계의 핵심은 ${youKeyword}와 ${themKeyword}를 균형 있게 조율하는 것입니다.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 연애 스프레드 핵심결론
 */
function generateLoveSpreadConclusion(cards: DrawnCard[], questionType: string): string {
  const feelings = cards[0];
  const actions = cards[1];
  const outcome = cards[2];
  
  if (!feelings || !actions || !outcome) {
    return generateDefaultConclusion(cards.filter(card => card), questionType);
  }
  
  const feelingsKeyword = feelings.current_keywords?.[0] || '감정';
  const actionsKeyword = actions.current_keywords?.[0] || '행동';
  const outcomeKeyword = outcome.current_keywords?.[0] || '결과';
  
  const templates = [
    `${addJosa(feelingsKeyword, '의')} 감정을 ${addJosa(actionsKeyword, '로/으로')} 표현하면 ${addJosa(outcomeKeyword, '이/가')} 따를 것입니다.`,
    `현재의 ${feelingsKeyword}를 바탕으로 ${addJosa(actionsKeyword, '을/를')} 취하면 ${addJosa(outcomeKeyword, '의')} 결과를 얻습니다.`,
    `마음의 ${feelingsKeyword}와 ${actionsKeyword}의 조화가 ${addJosa(outcomeKeyword, '을/를')} 만들어냅니다.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 진로 스프레드 핵심결론
 */
function generateCareerPathConclusion(cards: DrawnCard[], questionType: string): string {
  const currentSituation = cards[0];
  const opportunities = cards[1];
  const guidance = cards[2];
  
  if (!currentSituation || !opportunities || !guidance) {
    return generateDefaultConclusion(cards.filter(card => card), questionType);
  }
  
  const currentKeyword = currentSituation.current_keywords?.[0] || '현재상황';
  const opportunityKeyword = opportunities.current_keywords?.[0] || '기회';
  const guidanceKeyword = guidance.current_keywords?.[0] || '방향';
  
  const templates = [
    `현재의 ${currentKeyword}에서 ${addJosa(opportunityKeyword, '의')} 기회를 잡아 ${addJosa(guidanceKeyword, '로/으로')} 나아가세요.`,
    `${addJosa(currentKeyword, '을/를')} 바탕으로 ${addJosa(opportunityKeyword, '을/를')} 활용하면 ${addJosa(guidanceKeyword, '의')} 방향을 찾을 수 있습니다.`,
    `진로의 핵심은 ${currentKeyword}를 인정하고 ${addJosa(opportunityKeyword, '과/와')} ${guidanceKeyword}를 조화시키는 것입니다.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 예스/노 핵심결론
 */
function generateYesNoConclusion(cards: DrawnCard[], questionType: string): string {
  const card = cards[0];
  if (!card) return '답을 찾기 어렵습니다.';
  
  const keyword = card.current_keywords?.[0] || '판단';
  const isPositive = !card.is_reversed && 
    (card.current_keywords?.some(k => ['성공', '희망', '기쁨', '성취', '발전', '번영'].includes(k)) || false);
  
  if (isPositive) {
    return `${addJosa(keyword, '이/가')} 긍정적인 신호를 보내고 있습니다.`;
  } else {
    return `${addJosa(keyword, '을/를')} 신중히 고려해야 할 시점입니다.`;
  }
}

/**
 * 기본 핵심결론
 */
function generateDefaultConclusion(cards: DrawnCard[], questionType: string): string {
  if (cards.length === 0) return '카드를 선택해주세요.';
  
  const mainCard = cards[0];
  const keyword = mainCard.current_keywords?.[0] || '변화';
  
  return `${addJosa(mainCard.name, '이/가')} 보여주는 ${keyword}에 주목해야 할 때입니다.`;
}