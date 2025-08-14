// src/lib/tarot-interpretation.ts

import { DrawnCard } from "@/types/tarot";

// 질문 유형 분류
export const classifyQuestion = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('사랑') || lowerQuestion.includes('연애') || lowerQuestion.includes('결혼') || lowerQuestion.includes('이성')) {
    return 'love';
  }
  if (lowerQuestion.includes('직장') || lowerQuestion.includes('일') || lowerQuestion.includes('승진') || lowerQuestion.includes('회사')) {
    return 'career';
  }
  if (lowerQuestion.includes('돈') || lowerQuestion.includes('재물') || lowerQuestion.includes('투자') || lowerQuestion.includes('사업')) {
    return 'money';
  }
  if (lowerQuestion.includes('건강') || lowerQuestion.includes('몸') || lowerQuestion.includes('병')) {
    return 'health';
  }
  return 'general';
};

// 카드 조합 분석
export const analyzeCardCombination = (cards: DrawnCard[]): string => {
  const majorCount = cards.filter(card => card.suit === 'major').length;
  const reversedCount = cards.filter(card => card.is_reversed).length;
  
  let combinationMessage = '';
  
  if (majorCount === 3) {
    combinationMessage = '세 장 모두 메이저 아르카나로, 운명적이고 중요한 전환점을 의미합니다. 우주가 당신에게 특별한 메시지를 전하고 있습니다.';
  } else if (majorCount === 2) {
    combinationMessage = '두 장의 메이저 아르카나가 강력한 변화의 에너지를 나타냅니다. 중요한 결정의 시기입니다.';
  } else if (majorCount === 1) {
    combinationMessage = '하나의 메이저 아르카나가 핵심 메시지를 전달하며, 마이너 카드들이 구체적인 상황을 보여줍니다.';
  } else {
    combinationMessage = '마이너 아르카나들이 일상적이지만 중요한 변화들을 암시합니다. 작은 것부터 차근차근 해결해나가세요.';
  }
  
  if (reversedCount === 3) {
    combinationMessage += ' 모든 카드가 역방향으로, 내면의 성찰과 기다림이 필요한 시기입니다.';
  } else if (reversedCount === 2) {
    combinationMessage += ' 두 카드의 역방향은 장애물이 있지만 극복 가능함을 의미합니다.';
  }
  
  return combinationMessage;
};

// 위치별 해석 생성
export const generatePositionInterpretation = (
  card: DrawnCard, 
  position: 'past' | 'present' | 'future',
  questionType: string
): string => {
  const positionContext = {
    past: '과거의 영향',
    present: '현재 상황',
    future: '미래 전망'
  };
  
  const questionContext = {
    love: '연애운에서',
    career: '직장/일에서',
    money: '재물운에서',
    health: '건강운에서',
    general: '전반적으로'
  };
  
  let interpretation = `${positionContext[position]}: `;
  
  const contextKey = questionType as keyof typeof questionContext;
  
  if (position === 'past') {
    interpretation += `${card.name}은 당신의 ${questionContext[contextKey]} 지나온 경험을 나타냅니다. `;
    interpretation += card.current_interpretation;
    interpretation += ' 이러한 과거의 에너지가 현재 상황에 영향을 미치고 있습니다.';
  } else if (position === 'present') {
    interpretation += `${card.name}이 보여주는 ${questionContext[contextKey]} 현재의 핵심입니다. `;
    interpretation += card.current_interpretation;
    interpretation += ' 지금 이 순간에 집중하여 현명한 선택을 하세요.';
  } else {
    interpretation += `${card.name}이 ${questionContext[contextKey]} 다가올 가능성을 암시합니다. `;
    interpretation += card.current_interpretation;
    interpretation += ' 현재의 노력이 이러한 미래로 이어질 것입니다.';
  }
  
  return interpretation;
};

// 원카드 해석 생성
export const generateOneCardInterpretation = (
  question: string,
  card: DrawnCard,
  questionType: string
): string => {
  let interpretation = `"${question}"에 대한 타로의 답변:\n\n`;
  
  interpretation += `${card.name}이 당신의 질문에 대한 핵심 메시지를 전달합니다.\n\n`;
  
  // 질문 유형별 맞춤 해석
  const contextMessage: Record<string, string> = {
    love: '사랑과 인간관계에서',
    career: '직업과 성장에서',
    money: '재정과 물질적 측면에서',
    health: '건강과 웰빙에서',
    general: '전반적인 삶에서'
  };
  
  interpretation += `${contextMessage[questionType]} ${card.current_interpretation}\n\n`;
  
  // 카드 위치에 따른 추가 메시지
  if (card.is_reversed) {
    interpretation += '역방향으로 나타난 이 카드는 내면의 성찰과 기다림이 필요함을 의미합니다. ';
    interpretation += '급하게 결론을 내리기보다는 충분한 시간을 갖고 상황을 바라보세요.\n\n';
  } else {
    interpretation += '정방향으로 나타난 이 카드는 긍정적인 에너지와 전진의 시기를 나타냅니다. ';
    interpretation += '자신감을 갖고 앞으로 나아가세요.\n\n';
  }
  
  // 실행 가능한 조언
  interpretation += '오늘의 조언: ';
  if (card.suit === 'major') {
    interpretation += '인생의 중요한 전환점에 서 있습니다. 이 순간을 놓치지 마세요.';
  } else {
    const suitAdvice: Record<string, string> = {
      cups: '감정과 직감을 믿고 따라가세요.',
      pentacles: '실용적이고 현실적인 접근을 취하세요.',
      swords: '명확한 사고와 소통이 열쇠입니다.',
      wands: '열정과 창의성을 발휘할 때입니다.'
    };
    interpretation += suitAdvice[card.suit] || '균형잡힌 시각으로 상황을 바라보세요.';
  }
  
  return interpretation;
};

// 전체 종합 해석 생성 (3카드용)
export const generateOverallInterpretation = (
  question: string,
  cards: DrawnCard[],
  questionType: string
): string => {
  // 원카드인 경우
  if (cards.length === 1) {
    return generateOneCardInterpretation(question, cards[0], questionType);
  }
  
  const [pastCard, presentCard, futureCard] = cards;
  
  let overall = `"${question}"에 대한 타로의 답변:\n\n`;
  
  // 카드 조합 메시지
  overall += analyzeCardCombination(cards) + '\n\n';
  
  // 핵심 메시지
  overall += '핵심 메시지: ';
  if (questionType === 'love') {
    overall += '사랑에 있어서 ';
  } else if (questionType === 'career') {
    overall += '직업적 성장에 있어서 ';
  } else if (questionType === 'money') {
    overall += '재정적 측면에서 ';
  } else if (questionType === 'health') {
    overall += '건강 관리에 있어서 ';
  }
  
  overall += `${pastCard.name}으로 시작된 에너지가 ${presentCard.name}을 통해 현재 상황을 만들어냈고, `;
  overall += `이것이 ${futureCard.name}으로 이어질 것입니다.\n\n`;
  
  // 조언
  overall += '조언: ';
  if (presentCard.suit === 'major') {
    overall += '지금은 인생의 중요한 전환점입니다. ';
  }
  
  overall += '과거의 경험을 바탕으로 현재를 현명하게 살아가면, ';
  overall += '미래는 당신이 원하는 방향으로 펼쳐질 것입니다. ';
  
  const reversedCount = cards.filter(card => card.is_reversed).length;
  if (reversedCount > 1) {
    overall += '다소 인내가 필요하지만, 내면의 성장이 동반될 것입니다.';
  } else {
    overall += '긍정적인 변화가 기다리고 있으니 자신감을 가지세요.';
  }
  
  return overall;
};

// 키워드 기반 추가 인사이트
export const generateKeywordInsights = (cards: DrawnCard[]): string[] => {
  const allKeywords = cards.flatMap(card => card.current_keywords);
  const insights: string[] = [];
  
  // 공통 테마 찾기
  const themes = {
    '새로운': ['변화', '시작', '기회'],
    '사랑': ['감정', '연결', '관계'],
    '성공': ['성취', '완성', '승리'],
    '지혜': ['학습', '통찰', '이해']
  };
  
  Object.entries(themes).forEach(([theme, keywords]) => {
    const matchCount = keywords.filter(keyword => 
      allKeywords.some(cardKeyword => cardKeyword.includes(keyword))
    ).length;
    
    if (matchCount >= 2) {
      insights.push(`${theme}의 에너지가 강하게 나타나고 있습니다.`);
    }
  });
  
  return insights;
};