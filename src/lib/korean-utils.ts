// @ts-ignore
import { josa } from 'josa';

/**
 * 한국어 조사 처리 유틸리티
 */

// 카드 이름에 적절한 조사 붙이기
export function withJosa(text: string, josaSuffix: string): string {
  return josa(`${text}#{${josaSuffix}}`);
}

// 자주 사용하는 조사 헬퍼 함수들
export function 은는(text: string): string {
  return josa(`${text}#{는}`); // josa는 자동으로 은/는 처리
}

export function 이가(text: string): string {
  return josa(`${text}#{가}`); // josa는 자동으로 이/가 처리
}

export function 을를(text: string): string {
  return josa(`${text}#{를}`); // josa는 자동으로 을/를 처리
}

export function 와과(text: string): string {
  return josa(`${text}#{와}`); // josa는 자동으로 와/과 처리
}

export function 으로(text: string): string {
  return josa(`${text}#{로}`); // josa는 자동으로 으로/로 처리
}

// 카드 이름 처리를 위한 특별 함수
export function formatCardName(cardName: string, josaSuffix: string): string {
  // 영어 카드명의 경우 한글 발음으로 변환하여 조사 처리
  const koreanNameMap: Record<string, string> = {
    'The Fool': '바보',
    'The Magician': '마법사',
    'The High Priestess': '여사제',
    'The Empress': '여황제',
    'The Emperor': '황제',
    'The Hierophant': '교황',
    'The Lovers': '연인들',
    'The Chariot': '전차',
    'Strength': '힘',
    'The Hermit': '은둔자',
    'Wheel of Fortune': '운명의 수레바퀴',
    'Justice': '정의',
    'The Hanged Man': '매달린 사람',
    'Death': '죽음',
    'Temperance': '절제',
    'The Devil': '악마',
    'The Tower': '탑',
    'The Star': '별',
    'The Moon': '달',
    'The Sun': '태양',
    'Judgement': '심판',
    'The World': '세계',
    // Minor Arcana
    'Ace': '에이스',
    'Two': '투',
    'Three': '쓰리',
    'Four': '포',
    'Five': '파이브',
    'Six': '식스',
    'Seven': '세븐',
    'Eight': '에잇',
    'Nine': '나인',
    'Ten': '텐',
    'Page': '시종',
    'Knight': '기사',
    'Queen': '여왕',
    'King': '왕',
    'Cups': '컵',
    'Pentacles': '펜타클',
    'Swords': '소드',
    'Wands': '완드'
  };

  // 한글명이 있으면 사용, 없으면 원본 사용
  let displayName = cardName;
  
  // 카드명을 파싱하여 한글 변환
  Object.keys(koreanNameMap).forEach(eng => {
    if (cardName.includes(eng)) {
      displayName = displayName.replace(eng, koreanNameMap[eng]);
    }
  });

  return josa(`${displayName}#{${josaSuffix}}`);
}

// 문장 내 조사 자동 처리
export function processKoreanText(text: string): string {
  // {{카드명}}조사 형태를 자동으로 처리
  return text.replace(/\{\{([^}]+)\}\}(은|는|이|가|을|를|와|과|으로|로)/g, (match, cardName, josaSuffix) => {
    return formatCardName(cardName, josaSuffix);
  });
}