import { DrawnCard } from '@/types/tarot';
import { SpreadType, INTERPRETATION_GUIDES } from '@/types/spreads';

// 스프레드별 종합 해석 생성
export function generateSpreadInterpretation(
  spreadType: SpreadType,
  cards: DrawnCard[],
  question: string,
  questionType: string
): string {
  const guide = INTERPRETATION_GUIDES[spreadType];
  
  switch (spreadType) {
    case 'celtic-cross':
      return generateCelticCrossInterpretation(cards, question, questionType);
    case 'relationship':
      return generateRelationshipInterpretation(cards, question);
    case 'love-spread':
      return generateLoveSpreadInterpretation(cards, question);
    case 'career-path':
      return generateCareerPathInterpretation(cards, question);
    case 'yes-no':
      return generateYesNoInterpretation(cards, question);
    case 'three-card':
      return generateThreeCardInterpretation(cards, question, questionType);
    case 'one-card':
      return generateOneCardInterpretation(cards[0], question, questionType);
    default:
      return generateBasicInterpretation(cards, question);
  }
}

// 켈틱 크로스 해석
function generateCelticCrossInterpretation(
  cards: DrawnCard[],
  question: string,
  questionType: string
): string {
  // 안전한 카드 추출 (undefined 방지)
  const present = cards[0];
  const challenge = cards[1];
  const distantPast = cards[2];
  const recentPast = cards[3];
  const possibleFuture = cards[4];
  const immediateFuture = cards[5];
  const approach = cards[6];
  const external = cards[7];
  const hopes = cards[8];
  const outcome = cards[9];

  // 필수 카드들이 없으면 기본 해석 반환
  if (!present || !challenge || !outcome) {
    return generateBasicInterpretation(cards.filter(card => card), question);
  }

  let interpretation = `🔮 켈틱 크로스 리딩 - "${question}"\n\n`;
  
  interpretation += `📍 핵심 상황\n`;
  interpretation += `현재 당신은 ${present.name}가 나타내는 상황에 있습니다. `;
  interpretation += `${present.current_meaning}\n`;
  interpretation += `이를 가로막거나 영향을 주는 것은 ${challenge.name}입니다. `;
  interpretation += `${challenge.is_reversed ? '역방향으로 나타나' : '정방향으로 나타나'} `;
  interpretation += `${challenge.current_keywords?.join(', ') || '복합적'}의 에너지가 작용하고 있습니다.\n\n`;

  interpretation += `⏳ 시간의 흐름\n`;
  if (distantPast) {
    interpretation += `과거: ${distantPast.name}가 보여주듯, ${distantPast.current_keywords?.[0] || '과거의 경험'}의 영향이 현재까지 이어지고 있습니다.\n`;
  }
  if (recentPast) {
    interpretation += `최근: ${recentPast.name}는 최근의 ${recentPast.current_keywords?.[0] || '변화'} 상황을 나타냅니다.\n`;
  }
  if (immediateFuture) {
    interpretation += `가까운 미래: ${immediateFuture.name}가 암시하는 ${immediateFuture.current_keywords?.[0] || '변화'}가 곧 다가올 것입니다.\n`;
  }
  if (possibleFuture) {
    interpretation += `가능한 결과: ${possibleFuture.name}는 ${possibleFuture.current_keywords?.join(', ') || '다양한 가능성'}의 가능성을 보여줍니다.\n`;
  }
  interpretation += `\n`;

  interpretation += `🎭 내면과 외면\n`;
  if (approach) {
    interpretation += `당신의 접근: ${approach.name}는 당신이 ${approach.current_keywords?.[0] || '신중한'}의 태도를 가지고 있음을 보여줍니다.\n`;
  }
  if (external) {
    interpretation += `외부 영향: ${external.name}가 나타내는 ${external.current_keywords?.[0] || '외부 환경'}의 외부 에너지가 작용합니다.\n`;
  }
  if (hopes) {
    interpretation += `희망과 두려움: ${hopes.name}는 당신의 ${hopes.current_keywords?.join(', ') || '내면의 감정'}을 반영합니다.\n`;
  }
  interpretation += `\n`;

  interpretation += `✨ 최종 메시지\n`;
  interpretation += `${outcome.name}가 최종 결과로 나타났습니다. `;
  interpretation += `${outcome.current_meaning}\n`;
  interpretation += `모든 카드를 종합해보면, ${getOverallTheme(cards.filter(card => card))}의 메시지가 강하게 나타납니다.`;

  return interpretation;
}

// 관계 스프레드 해석
function generateRelationshipInterpretation(
  cards: DrawnCard[],
  question: string
): string {
  const you = cards[0];
  const partner = cards[1];
  const yourFeelings = cards[2];
  const partnerFeelings = cards[3];
  const currentRelation = cards[4];
  const futureRelation = cards[5];

  if (!you || !partner || !currentRelation) {
    return generateBasicInterpretation(cards.filter(card => card), question);
  }

  let interpretation = `💑 관계 스프레드 리딩 - "${question}"\n\n`;

  interpretation += `👤 두 사람의 입장\n`;
  interpretation += `당신: ${you.name}는 당신이 관계에서 ${you.current_keywords?.join(', ') || '중요한'}의 역할을 하고 있음을 보여줍니다.\n`;
  interpretation += `상대방: ${partner.name}는 상대방이 ${partner.current_keywords?.join(', ') || '대등한'}의 입장임을 나타냅니다.\n\n`;

  interpretation += `💝 서로의 감정\n`;
  if (yourFeelings) {
    interpretation += `당신의 감정: ${yourFeelings.name}가 보여주는 것처럼, 당신은 ${yourFeelings.current_keywords?.[0] || '강한'}의 마음을 가지고 있습니다.\n`;
  }
  if (partnerFeelings) {
    interpretation += `상대의 감정: ${partnerFeelings.name}는 상대방이 ${partnerFeelings.current_keywords?.[0] || '복잡한 감정'}을 느끼고 있음을 암시합니다.\n`;
  }
  interpretation += `\n`;

  interpretation += `🔄 관계의 흐름\n`;
  interpretation += `현재: ${currentRelation.name}는 두 사람 사이가 ${currentRelation.current_keywords?.join(', ') || '기복적인'}의 상태임을 보여줍니다.\n`;
  interpretation += `${currentRelation.current_meaning}\n\n`;

  interpretation += `🌟 미래 전망\n`;
  if (futureRelation) {
    interpretation += `${futureRelation.name}가 관계의 미래로 나타났습니다. `;
    interpretation += `${futureRelation.current_meaning}\n`;
  } else {
    interpretation += `미래는 아직 결정되지 않았으며, 당신들의 노력에 달려 있습니다.\n`;
  }
  
  // 관계 조언
  const advice = generateRelationshipAdvice(cards);
  interpretation += `\n💡 조언: ${advice}`;

  return interpretation;
}

// 연애 스프레드 해석
function generateLoveSpreadInterpretation(
  cards: DrawnCard[],
  question: string
): string {
  const currentFeelings = cards[0];
  const partnerHeart = cards[1];
  const obstacles = cards[2];
  const needs = cards[3];
  const loveDestiny = cards[4];

  if (!currentFeelings || !loveDestiny) {
    return generateBasicInterpretation(cards.filter(card => card), question);
  }

  let interpretation = `💕 연애 스프레드 리딩 - "${question}"\n\n`;

  interpretation += `💗 현재의 마음\n`;
  interpretation += `${currentFeelings.name}는 당신이 지금 ${currentFeelings.current_keywords?.join(', ') || '긍정적인'}의 감정 상태임을 보여줍니다.\n`;
  interpretation += `${currentFeelings.current_meaning}\n\n`;

  interpretation += `💭 상대방의 진심\n`;
  if (partnerHeart) {
    interpretation += `${partnerHeart.name}가 상대방의 마음으로 나타났습니다. `;
    interpretation += `이는 ${partnerHeart.current_keywords?.[0] || '진심'}을 의미하며, `;
    interpretation += `${partnerHeart.is_reversed ? '다소 복잡한 감정' : '진실된 마음'}을 나타냅니다.\n`;
  }
  interpretation += `\n`;

  interpretation += `🚧 극복해야 할 것\n`;
  if (obstacles) {
    interpretation += `${obstacles.name}는 ${obstacles.current_keywords?.join(', ') || '다양한 어려움'}이 관계의 장애물임을 보여줍니다.\n`;
    interpretation += `이를 극복하기 위해서는 ${generateObstacleAdvice(obstacles)}이 필요합니다.\n`;
  }
  interpretation += `\n`;

  interpretation += `🔑 필요한 것\n`;
  if (needs) {
    interpretation += `${needs.name}는 관계 발전을 위해 ${needs.current_keywords?.[0] || '소통'}이 필요함을 알려줍니다.\n`;
    interpretation += `${needs.current_meaning}\n`;
  }
  interpretation += `\n`;

  interpretation += `✨ 연애운 전망\n`;
  interpretation += `${loveDestiny.name}가 당신의 연애운으로 나타났습니다!\n`;
  interpretation += `${loveDestiny.current_meaning}\n`;
  interpretation += `전체적으로 ${getLoveAdvice(cards.filter(card => card))}`;

  return interpretation;
}

// 경력 경로 해석
function generateCareerPathInterpretation(
  cards: DrawnCard[],
  question: string
): string {
  const [currentPosition, strengths, weaknesses, opportunities, advice] = cards;

  let interpretation = `💼 경력 경로 리딩 - "${question}"\n\n`;

  interpretation += `📍 현재 위치\n`;
  interpretation += `${currentPosition.name}는 당신이 직업적으로 ${currentPosition.current_keywords.join(', ')}의 상황에 있음을 보여줍니다.\n`;
  interpretation += `${currentPosition.current_meaning}\n\n`;

  interpretation += `💪 강점과 약점\n`;
  interpretation += `강점: ${strengths.name}가 보여주듯, 당신은 ${strengths.current_keywords[0]}의 재능을 가지고 있습니다.\n`;
  interpretation += `약점: ${weaknesses.name}는 ${weaknesses.current_keywords[0]} 부분의 개선이 필요함을 알려줍니다.\n\n`;

  interpretation += `🎯 기회\n`;
  interpretation += `${opportunities.name}가 나타내는 ${opportunities.current_keywords.join(', ')}의 기회가 다가오고 있습니다.\n`;
  interpretation += `${opportunities.current_meaning}\n\n`;

  interpretation += `🌟 성공을 위한 조언\n`;
  interpretation += `${advice.name}가 최종 조언으로 나타났습니다.\n`;
  interpretation += `${advice.current_meaning}\n`;
  interpretation += `성공을 위해서는 ${getCareerAdvice(cards)}을 명심하세요.`;

  return interpretation;
}

// 예/아니오 해석
function generateYesNoInterpretation(
  cards: DrawnCard[],
  question: string
): string {
  const [positiveReason, answer, negativeReason] = cards;
  
  // 답변 결정 로직
  const isYes = determineYesNo(answer);
  const strength = calculateAnswerStrength(cards);

  let interpretation = `🎯 예/아니오 리딩 - "${question}"\n\n`;

  interpretation += `📊 답변: ${isYes ? '✅ 예 (YES)' : '❌ 아니오 (NO)'}\n`;
  interpretation += `강도: ${strength}\n\n`;

  interpretation += `💚 긍정적 측면\n`;
  interpretation += `${positiveReason.name}는 ${positiveReason.current_keywords.join(', ')}의 긍정적 요소를 보여줍니다.\n`;
  interpretation += `${positiveReason.current_meaning}\n\n`;

  interpretation += `🎯 핵심 답변\n`;
  interpretation += `${answer.name}가 중심 카드로 나타났습니다.\n`;
  interpretation += `${answer.current_meaning}\n\n`;

  interpretation += `💔 부정적 측면\n`;
  interpretation += `${negativeReason.name}는 ${negativeReason.current_keywords.join(', ')}의 주의할 점을 알려줍니다.\n`;
  interpretation += `${negativeReason.current_meaning}\n\n`;

  interpretation += `💡 종합 조언\n`;
  interpretation += isYes 
    ? `답은 "예"입니다. 하지만 ${negativeReason.current_keywords[0]}에 주의하면서 진행하세요.`
    : `답은 "아니오"입니다. ${positiveReason.current_keywords[0]}의 장점이 있지만, 지금은 때가 아닙니다.`;

  return interpretation;
}

// 3카드 해석 (기존)
function generateThreeCardInterpretation(
  cards: DrawnCard[],
  question: string,
  questionType: string
): string {
  const [past, present, future] = cards;
  
  let interpretation = `🔮 과거-현재-미래 리딩 - "${question}"\n\n`;
  
  interpretation += `⏮ 과거: ${past.name}\n`;
  interpretation += `${past.current_meaning}\n\n`;
  
  interpretation += `⏸ 현재: ${present.name}\n`;
  interpretation += `${present.current_meaning}\n\n`;
  
  interpretation += `⏭ 미래: ${future.name}\n`;
  interpretation += `${future.current_meaning}\n\n`;
  
  interpretation += `✨ 종합 메시지\n`;
  interpretation += `과거의 ${past.current_keywords[0]}이(가) 현재의 ${present.current_keywords[0]}으로 이어지고, `;
  interpretation += `미래에는 ${future.current_keywords[0]}의 결과를 맞이하게 될 것입니다.`;

  return interpretation;
}

// 1카드 해석 (기존)
function generateOneCardInterpretation(
  card: DrawnCard,
  question: string,
  questionType: string
): string {
  let interpretation = `🎴 원카드 리딩 - "${question}"\n\n`;
  
  interpretation += `${card.name}${card.is_reversed ? ' (역방향)' : ''}\n\n`;
  interpretation += `${card.current_meaning}\n\n`;
  
  interpretation += `💡 핵심 키워드: ${card.current_keywords.join(', ')}\n\n`;
  
  interpretation += `✨ 조언: `;
  interpretation += getCardAdvice(card, questionType);

  return interpretation;
}

// 기본 해석 (폴백)
function generateBasicInterpretation(
  cards: DrawnCard[],
  question: string
): string {
  let interpretation = `🔮 타로 리딩 - "${question}"\n\n`;
  
  cards.forEach((card, index) => {
    interpretation += `카드 ${index + 1}: ${card.name}${card.is_reversed ? ' (역방향)' : ''}\n`;
    interpretation += `${card.current_meaning}\n`;
    interpretation += `키워드: ${card.current_keywords.join(', ')}\n\n`;
  });

  return interpretation;
}

// 보조 함수들
function getOverallTheme(cards: DrawnCard[]): string {
  // 메이저 아르카나 카드 수 계산
  const majorCount = cards.filter(c => c.suit === 'major').length;
  
  if (majorCount >= 5) return '운명적 전환과 영적 성장';
  if (majorCount >= 3) return '중요한 변화와 깨달음';
  
  // 수트별 분포 분석
  const suitCounts: Record<string, number> = {};
  cards.forEach(card => {
    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
  });
  
  const dominantSuit = Object.entries(suitCounts)
    .sort(([,a], [,b]) => b - a)[0];
    
  switch(dominantSuit[0]) {
    case 'cups': return '감정과 관계의 변화';
    case 'pentacles': return '물질적 안정과 성취';
    case 'swords': return '명확한 사고와 결단';
    case 'wands': return '열정과 창조적 에너지';
    default: return '균형과 조화';
  }
}

function generateRelationshipAdvice(cards: DrawnCard[]): string {
  const hasConflict = cards.some(c => 
    c.current_keywords.some(k => 
      k.includes('갈등') || k.includes('도전') || k.includes('어려움')
    )
  );
  
  const hasLove = cards.some(c => 
    c.current_keywords.some(k => 
      k.includes('사랑') || k.includes('연결') || k.includes('조화')
    )
  );
  
  if (hasConflict && hasLove) {
    return '서로를 이해하려는 노력이 필요합니다. 갈등 속에서도 사랑은 존재합니다.';
  } else if (hasConflict) {
    return '소통과 인내가 필요한 시기입니다. 서로의 입장을 들어보세요.';
  } else if (hasLove) {
    return '긍정적인 에너지가 흐르고 있습니다. 이 기회를 잘 활용하세요.';
  }
  
  return '관계의 균형을 찾아가는 과정입니다. 시간을 가지세요.';
}

function generateObstacleAdvice(obstacle: DrawnCard): string {
  const keywords = obstacle.current_keywords;
  
  if (keywords.some(k => k.includes('두려움'))) {
    return '두려움을 극복할 용기';
  } else if (keywords.some(k => k.includes('소통'))) {
    return '열린 마음으로 대화';
  } else if (keywords.some(k => k.includes('과거'))) {
    return '과거를 놓아주는 용기';
  } else if (keywords.some(k => k.includes('신뢰'))) {
    return '서로에 대한 신뢰 회복';
  }
  
  return '인내와 이해';
}

function getLoveAdvice(cards: DrawnCard[]): string {
  const positiveCards = cards.filter(c => !c.is_reversed).length;
  const ratio = positiveCards / cards.length;
  
  if (ratio >= 0.8) {
    return '매우 긍정적인 연애운이 펼쳐질 것입니다. 자신감을 가지세요!';
  } else if (ratio >= 0.6) {
    return '좋은 기회가 있지만 노력이 필요합니다. 적극적으로 행동하세요.';
  } else if (ratio >= 0.4) {
    return '도전이 있지만 극복 가능합니다. 인내심을 가지세요.';
  }
  
  return '지금은 자신을 돌보는 시간이 필요합니다. 서두르지 마세요.';
}

function getCareerAdvice(cards: DrawnCard[]): string {
  const themes = cards.flatMap(c => c.current_keywords);
  
  if (themes.some(t => t.includes('성공') || t.includes('성취'))) {
    return '목표 달성의 기회가 다가오고 있으니 집중력을 유지하는 것';
  } else if (themes.some(t => t.includes('변화') || t.includes('전환'))) {
    return '변화를 두려워하지 말고 새로운 기회를 포착하는 것';
  } else if (themes.some(t => t.includes('학습') || t.includes('성장'))) {
    return '지속적인 학습과 자기 개발에 투자하는 것';
  }
  
  return '현재 위치에서 최선을 다하며 기회를 준비하는 것';
}

function determineYesNo(card: DrawnCard): boolean {
  // 긍정적인 카드들
  const positiveCards = [
    'The Sun', 'The Star', 'The World', 'Ten of Cups', 
    'Ace of Cups', 'Six of Wands', 'Three of Cups',
    'The Empress', 'The Lovers', 'Wheel of Fortune'
  ];
  
  // 부정적인 카드들
  const negativeCards = [
    'The Tower', 'Death', 'The Devil', 'Ten of Swords',
    'Five of Cups', 'Three of Swords', 'Eight of Swords',
    'The Hanged Man', 'Five of Pentacles'
  ];
  
  if (card.is_reversed) {
    // 역방향일 때는 반대로
    if (positiveCards.includes(card.name)) return false;
    if (negativeCards.includes(card.name)) return true;
  } else {
    if (positiveCards.includes(card.name)) return true;
    if (negativeCards.includes(card.name)) return false;
  }
  
  // 중립 카드는 키워드로 판단
  const positiveKeywords = card.current_keywords.filter(k => 
    k.includes('성공') || k.includes('기회') || k.includes('성장') || 
    k.includes('사랑') || k.includes('행복')
  ).length;
  
  const negativeKeywords = card.current_keywords.filter(k => 
    k.includes('도전') || k.includes('어려움') || k.includes('종료') || 
    k.includes('갈등') || k.includes('두려움')
  ).length;
  
  return positiveKeywords > negativeKeywords;
}

function calculateAnswerStrength(cards: DrawnCard[]): string {
  const [positive, answer, negative] = cards;
  
  const positiveStrength = !positive.is_reversed ? 1 : -1;
  const answerStrength = determineYesNo(answer) ? 2 : -2;
  const negativeStrength = !negative.is_reversed ? -1 : 1;
  
  const total = positiveStrength + answerStrength + negativeStrength;
  
  if (total >= 2) return '💪💪💪 매우 강함';
  if (total >= 1) return '💪💪 강함';
  if (total >= 0) return '💪 보통';
  if (total >= -1) return '⚠️ 약함';
  return '⚠️⚠️ 매우 약함';
}

function getCardAdvice(card: DrawnCard, questionType: string): string {
  const cardName = card.name.toLowerCase();
  const isReversed = card.is_reversed;
  
  // 질문 유형별 조언
  switch(questionType) {
    case 'love':
      if (cardName.includes('lovers')) return '진정한 사랑이 다가오고 있습니다.';
      if (cardName.includes('cups')) return '감정에 충실하세요.';
      break;
    case 'career':
      if (cardName.includes('pentacles')) return '실용적인 접근이 필요합니다.';
      if (cardName.includes('wands')) return '열정을 가지고 도전하세요.';
      break;
    case 'money':
      if (cardName.includes('pentacles')) return '재정 관리에 신중하세요.';
      break;
  }
  
  // 일반적인 조언
  if (isReversed) {
    return '내면을 돌아보고 균형을 찾는 시간이 필요합니다.';
  }
  
  return '카드의 메시지를 신뢰하고 직관을 따르세요.';
}