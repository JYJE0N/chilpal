// 키워드 기반 다정한 개인 메시지 생성

import { DrawnCard } from '@/types/tarot';
import { 이가, 을를, 으로 } from './korean-utils';

// 키워드별 자연스러운 메시지 (카드가 전하는 실제 의미)
const keywordMessages: Record<string, string> = {
  // 가족 및 관계
  '가족': '가족이라고 카드는 말하고 있어요',
  '가족의 유대': '가족의 도움을 받을 수 있다고 카드는 말하고 있어요',
  '가족의 도움': '가족이 당신의 든든한 지원군이 될 거예요',
  '유산': '물려받은 것들이 당신의 힘이 될 거예요',
  '전통': '전통의 지혜가 당신을 인도할 거예요',
  
  // 물질적 안정
  '부의 축적': '물질적 안정이 다가오고 있어요',
  '번영': '풍요로운 시기가 찾아올 거예요',
  '안정': '안정된 기반이 마련될 거예요',
  '성취': '목표 달성이 가까워지고 있어요',
  '완성': '완성의 순간이 다가오고 있어요',
  
  // 새로운 시작
  '새로운 시작': '새로운 기회가 당신을 기다리고 있어요',
  '모험': '모험이 당신을 성장시킬 거예요',
  '용기': '용기를 내야 할 때라고 카드는 말해요',
  '순수함': '순수한 마음이 길을 열어줄 거예요',
  
  // 내면의 힘
  '직관': '당신의 직감이 옳다고 카드는 말해요',
  '지혜': '이미 답을 알고 있다고 카드는 말해요',
  '내면의 목소리': '마음의 소리에 귀 기울이라고 해요',
  '영감': '떠오른 아이디어를 믿어보라고 해요',
  
  // 사랑과 감정
  '사랑': '사랑이 당신 곁에 있다고 카드는 말해요',
  '감정': '감정에 솔직해져도 괜찮다고 해요',
  '로맨스': '로맨틱한 만남이 기다리고 있어요',
  '결합': '중요한 만남이 다가오고 있어요',
  
  // 행동과 의지
  '의지력': '의지를 굽히지 말라고 카드는 말해요',
  '추진력': '지금이 행동할 때라고 해요',
  '결정': '결정을 내려야 할 순간이에요',
  '실행': '계획을 실행에 옮길 때라고 해요',
  
  // 변화와 성장
  '변화': '변화가 필요하다고 카드는 말해요',
  '전환': '인생의 전환점에 서 있어요',
  '성장': '성장의 기회가 왔다고 해요',
  '발전': '한 단계 발전할 시기예요',
  
  // 도전적 상황
  '갈등': '갈등 해결의 실마리가 보일 거예요',
  '시련': '시련을 극복할 힘이 있다고 카드는 말해요',
  '혼란': '혼란이 곧 정리될 거라고 해요',
  '불안': '불안감이 사라질 때가 올 거예요',
  '상실': '잃은 것 대신 새로운 것이 올 거예요',
  
  // 휴식과 회복
  '휴식': '잠시 쉬어가도 괜찮다고 카드는 말해요',
  '회복': '회복의 시간이 필요하다고 해요',
  '치유': '치유의 과정이 시작됐어요',
  '평화': '마음의 평화를 찾을 거예요'
};

// 기본 메시지들
const defaultMessages = [
  '당신의 마음에 귀 기울여보세요',
  '지금 이 순간의 당신도 충분히 소중해요',
  '당신의 여정을 응원하고 있어요',
  '완벽하지 않아도 괜찮아요',
  '당신만의 속도로 가면 돼요'
];

// 키워드 기반 다정한 개인 메시지 생성 (고정된 메시지)
export function generatePersonalMessage(card: DrawnCard): string {
  // 카드의 첫 번째 키워드를 기준으로 메시지 생성 (고정)
  const firstKeyword = card.current_keywords[0];
  
  if (firstKeyword && keywordMessages[firstKeyword]) {
    return keywordMessages[firstKeyword];
  }
  
  // 키워드가 매칭되지 않으면 카드 이름의 해시값으로 고정된 기본 메시지 선택
  const cardNameHash = card.name.split('').reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
  }, 0);
  const index = Math.abs(cardNameHash) % defaultMessages.length;
  
  return defaultMessages[index];
}

// 스프레드 위치와 키워드 기반 메시지 생성
export function generateContextualKeywordMessage(
  card: DrawnCard, 
  questionType: string, 
  positionName?: string
): string {
  const mainKeyword = card.current_keywords[0]; // 첫 번째 키워드
  
  // 스프레드별 position 기반 메시지
  const positionMessages = {
    // relationship 스프레드
    '당신': `'당신'은 ${을를(mainKeyword || '특별한 에너지')} 품고 있다고 카드는 말하고 있어요`,
    '상대방': `'상대방'은 ${을를(mainKeyword || '특별한 에너지')} 지니고 있다고 카드는 말하고 있어요`,
    '당신의 감정': `'당신의 감정'은 ${mainKeyword || '복잡한 상태'}라고 카드는 말하고 있어요`,
    '상대의 감정': `'상대의 감정'은 ${mainKeyword || '복잡한 상태'}라고 카드는 말하고 있어요`,
    '관계의 현재': `'관계의 현재'는 ${mainKeyword || '중요한 상황'}이라고 카드는 말하고 있어요`,
    '관계의 미래': `'관계의 미래'는 ${mainKeyword || '새로운 방향'}으로 향한다고 카드는 말하고 있어요`,
    
    // love-spread 스프레드
    '현재 감정': `'현재 감정'은 ${mainKeyword || '특별한 상태'}라고 카드는 말하고 있어요`,
    '상대의 마음': `'상대의 마음'은 ${을를(mainKeyword || '복잡한 감정')} 품고 있다고 카드는 말하고 있어요`,
    '관계의 장애물': `'관계의 장애물'은 ${mainKeyword || '극복할 과제'}라고 카드는 말하고 있어요`,
    '필요한 것': `'필요한 것'은 ${mainKeyword || '중요한 요소'}라고 카드는 말하고 있어요`,
    '연애운': `'연애운'은 ${mainKeyword || '새로운 에너지'}라고 카드는 말하고 있어요`,
    
    // career-path 스프레드
    '현재 위치': `'현재 위치'는 ${mainKeyword || '의미있는 상황'}이라고 카드는 말하고 있어요`,
    '강점': `'강점'은 ${을를(mainKeyword || '특별한 재능')} 가지고 있다고 카드는 말하고 있어요`,
    '약점': `'약점'은 ${을를(mainKeyword || '개선할 부분')} 보완해야 한다고 카드는 말하고 있어요`,
    '기회': `'기회'는 ${을를(mainKeyword || '새로운 가능성')} 가져올 것이라고 카드는 말하고 있어요`,
    '조언': `'조언'은 ${을를(mainKeyword || '중요한 지혜')} 활용하라고 카드는 말하고 있어요`,
    
    // celtic-cross 스프레드
    '현재 상황': `'현재 상황'은 ${mainKeyword || '중요한 국면'}이라고 카드는 말하고 있어요`,
    '도전 과제': `'도전 과제'는 ${을를(mainKeyword || '극복할 과제')} 요구한다고 카드는 말하고 있어요`,
    '먼 과거': `'먼 과거'는 ${mainKeyword || '의미있는 경험'}이었다고 카드는 말하고 있어요`,
    '가까운 과거': `'가까운 과거'는 ${mainKeyword || '최근 변화'}였다고 카드는 말하고 있어요`,
    '가능한 미래': `'가능한 미래'는 ${을를(mainKeyword || '새로운 방향')} 제시한다고 카드는 말하고 있어요`,
    '가까운 미래': `'가까운 미래'는 ${을를(mainKeyword || '다가올 변화')} 가져다줄 것이라고 카드는 말하고 있어요`,
    '당신의 접근': `'당신의 접근'은 ${을를(mainKeyword || '특별한 방식')} 취하고 있다고 카드는 말하고 있어요`,
    '외부 영향': `'외부 영향'은 ${을를(mainKeyword || '주변 에너지')} 전달한다고 카드는 말하고 있어요`,
    '희망과 두려움': `'희망과 두려움'은 ${을를(mainKeyword || '내면 감정')} 품고 있다고 카드는 말하고 있어요`,
    '최종 결과': `'최종 결과'는 ${mainKeyword || '완성된 모습'}이라고 카드는 말하고 있어요`,
    
    // yes-no 스프레드
    '선택의 결과': `'선택의 결과'는 ${을를(mainKeyword || '중요한 변화')} 가져다줄 것이라고 카드는 말하고 있어요`,
    '고려할 점': `'고려할 점'은 ${을를(mainKeyword || '주의할 요소')} 살펴보라고 카드는 말하고 있어요`,
    '최선의 길': `'최선의 길'은 ${을를(mainKeyword || '현명한 선택')} 따르는 것이라고 카드는 말하고 있어요`,
  };
  
  // position name이 있으면 스프레드별 메시지 사용
  if (positionName && positionMessages[positionName as keyof typeof positionMessages]) {
    return positionMessages[positionName as keyof typeof positionMessages];
  }
  
  // 기본 패턴 (3카드 스프레드나 일반적인 경우)
  const basicTemplates = {
    love: {
      past: `과거 연애에서는 ${을를(mainKeyword || '특별한 경험')} 경험했군요`,
      present: `현재 연애는 ${mainKeyword || '중요한 상태'}라고 할 수 있어요`,
      future: `앞으로 연애는 ${mainKeyword || '새로운 방향'}으로 이어질 가능성이 높습니다`,
      single: `연애에서는 ${을를(mainKeyword || '특별한 에너지')} 키워드로 삼으라고 카드는 말해요`
    },
    career: {
      past: `과거 일에서는 ${을를(mainKeyword || '의미있는 경험')} 쌓았군요`,
      present: `현재 일은 ${mainKeyword || '중요한 국면'}이라고 할 수 있어요`,
      future: `앞으로 일은 ${mainKeyword || '새로운 방향'}으로 이어질 가능성이 높습니다`,
      single: `일에서는 ${을를(mainKeyword || '특별한 에너지')} 활용하라고 카드는 말해요`
    },
    money: {
      past: `과거 재정은 ${mainKeyword || '특별한 상황'}이었군요`,
      present: `현재 재정은 ${mainKeyword || '중요한 상태'}라고 할 수 있어요`,
      future: `앞으로 재정은 ${mainKeyword || '새로운 방향'}으로 이어질 가능성이 높습니다`,
      single: `재정에서는 ${을를(mainKeyword || '특별한 에너지')} 염두에 두라고 카드는 말해요`
    },
    health: {
      past: `과거 건강은 ${mainKeyword || '특별한 상태'}였군요`,
      present: `현재 건강은 ${mainKeyword || '중요한 상태'}라고 할 수 있어요`,
      future: `앞으로 건강은 ${mainKeyword || '새로운 방향'}으로 이어질 가능성이 높습니다`,
      single: `건강에서는 ${을를(mainKeyword || '특별한 에너지')} 중요시하라고 카드는 말해요`
    },
    general: {
      past: `과거는 ${mainKeyword || '의미있는 시간'}이었군요`,
      present: `현재는 ${mainKeyword || '중요한 시기'}라고 할 수 있어요`,
      future: `앞으로는 ${mainKeyword || '새로운 방향'}으로 이어질 가능성이 높습니다`,
      single: `지금은 ${을를(mainKeyword || '특별한 에너지')} 마음에 새기라고 카드는 말해요`
    }
  };
  
  const questionTemplates = basicTemplates[questionType as keyof typeof basicTemplates] || basicTemplates.general;
  
  if (positionName === '과거') {
    return questionTemplates.past;
  } else if (positionName === '현재') {
    return questionTemplates.present;
  } else if (positionName === '미래') {
    return questionTemplates.future;
  } else {
    return questionTemplates.single;
  }
}

// 질문 유형에 따른 자연스러운 메시지
export function generateEncouragementByQuestionType(questionType: string): string {
  const encouragements = {
    love: '사랑에 관한 질문이군요',
    career: '일과 진로에 대한 고민이시군요',
    money: '재정에 관한 궁금증이 있으시군요',
    health: '건강에 대해 관심이 많으시군요',
    general: '인생 전반에 대한 질문이군요'
  };
  
  return encouragements[questionType as keyof typeof encouragements] || encouragements.general;
}