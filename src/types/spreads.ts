// 스프레드 타입 정의
export type SpreadType = 
  | 'one-card'
  | 'three-card'
  | 'celtic-cross'
  | 'relationship'
  | 'love-spread'
  | 'career-path'
  | 'yes-no';

// 카드 위치 정의
export interface CardPosition {
  id: number;
  name: string;
  description: string;
  x?: number; // 레이아웃 X 좌표 (%)
  y?: number; // 레이아웃 Y 좌표 (%)
}

// 스프레드 정의
export interface SpreadDefinition {
  id: SpreadType;
  name: string;
  description: string;
  cardCount: number;
  positions: CardPosition[];
  category: 'simple' | 'intermediate' | 'advanced';
  estimatedTime: string;
  recommendedFor: string[];
}

// 스프레드 정의 데이터
export const SPREADS: SpreadDefinition[] = [
  {
    id: 'one-card',
    name: '원카드 리딩',
    description: '빠르고 간단한 답변을 원할 때',
    cardCount: 1,
    category: 'simple',
    estimatedTime: '1분',
    recommendedFor: ['오늘의 운세', '간단한 예/아니오 질문', '즉각적인 조언'],
    positions: [
      { id: 1, name: '답변', description: '질문에 대한 직접적인 답변' }
    ]
  },
  {
    id: 'three-card',
    name: '과거-현재-미래',
    description: '시간의 흐름에 따른 상황 파악',
    cardCount: 3,
    category: 'simple',
    estimatedTime: '3-5분',
    recommendedFor: ['상황의 전개 과정', '원인과 결과', '시간적 흐름'],
    positions: [
      { id: 1, name: '과거', description: '현재 상황의 원인이나 배경', x: 20, y: 50 },
      { id: 2, name: '현재', description: '지금 당면한 상황', x: 50, y: 50 },
      { id: 3, name: '미래', description: '앞으로의 전개나 결과', x: 80, y: 50 }
    ]
  },
  {
    id: 'celtic-cross',
    name: '켈틱 크로스',
    description: '가장 전통적이고 종합적인 스프레드',
    cardCount: 10,
    category: 'advanced',
    estimatedTime: '15-20분',
    recommendedFor: ['복잡한 상황 분석', '인생의 중요한 결정', '깊이 있는 통찰'],
    positions: [
      { id: 1, name: '현재 상황', description: '당신이 처한 현재의 상황', x: 50, y: 50 },
      { id: 2, name: '도전/십자가', description: '극복해야 할 도전이나 영향', x: 50, y: 50 },
      { id: 3, name: '먼 과거', description: '현재에 영향을 미친 과거', x: 50, y: 20 },
      { id: 4, name: '가까운 과거', description: '최근의 사건이나 영향', x: 20, y: 50 },
      { id: 5, name: '가능한 미래', description: '가능성 있는 미래의 결과', x: 50, y: 80 },
      { id: 6, name: '가까운 미래', description: '곧 일어날 일', x: 80, y: 50 },
      { id: 7, name: '당신의 접근', description: '상황에 대한 당신의 태도', x: 90, y: 80 },
      { id: 8, name: '외부 영향', description: '주변 환경이나 타인의 영향', x: 90, y: 60 },
      { id: 9, name: '희망과 두려움', description: '내면의 감정과 기대', x: 90, y: 40 },
      { id: 10, name: '최종 결과', description: '모든 것을 고려한 최종 결과', x: 90, y: 20 }
    ]
  },
  {
    id: 'relationship',
    name: '관계 스프레드',
    description: '두 사람 사이의 관계와 역학을 탐구',
    cardCount: 6,
    category: 'intermediate',
    estimatedTime: '10-12분',
    recommendedFor: ['연애 관계', '우정', '가족 관계', '업무 관계'],
    positions: [
      { id: 1, name: '당신', description: '관계에서 당신의 입장', x: 25, y: 30 },
      { id: 2, name: '상대방', description: '관계에서 상대방의 입장', x: 75, y: 30 },
      { id: 3, name: '당신의 감정', description: '상대방에 대한 당신의 감정', x: 25, y: 50 },
      { id: 4, name: '상대의 감정', description: '당신에 대한 상대방의 감정', x: 75, y: 50 },
      { id: 5, name: '관계의 현재', description: '현재 관계의 상태', x: 50, y: 40 },
      { id: 6, name: '관계의 미래', description: '관계의 발전 가능성', x: 50, y: 70 }
    ]
  },
  {
    id: 'love-spread',
    name: '연애 스프레드',
    description: '사랑과 로맨스에 특화된 스프레드',
    cardCount: 5,
    category: 'intermediate',
    estimatedTime: '8-10분',
    recommendedFor: ['새로운 연애', '짝사랑', '연애 고민', '결혼 고민'],
    positions: [
      { id: 1, name: '현재 감정', description: '지금 당신의 마음', x: 50, y: 20 },
      { id: 2, name: '상대의 마음', description: '상대방의 진심', x: 30, y: 50 },
      { id: 3, name: '관계의 장애물', description: '극복해야 할 문제', x: 70, y: 50 },
      { id: 4, name: '필요한 것', description: '관계 발전을 위해 필요한 것', x: 30, y: 80 },
      { id: 5, name: '연애운', description: '전반적인 연애 운세', x: 70, y: 80 }
    ]
  },
  {
    id: 'career-path',
    name: '경력 경로',
    description: '직업과 경력 발전을 위한 스프레드',
    cardCount: 5,
    category: 'intermediate',
    estimatedTime: '8-10분',
    recommendedFor: ['이직 고민', '진로 선택', '승진 가능성', '사업 시작'],
    positions: [
      { id: 1, name: '현재 위치', description: '직업적 현재 상황', x: 50, y: 50 },
      { id: 2, name: '강점', description: '당신의 직업적 강점', x: 20, y: 30 },
      { id: 3, name: '약점', description: '개선이 필요한 부분', x: 80, y: 30 },
      { id: 4, name: '기회', description: '앞으로의 기회', x: 20, y: 70 },
      { id: 5, name: '조언', description: '성공을 위한 조언', x: 80, y: 70 }
    ]
  },
  {
    id: 'yes-no',
    name: '결정 도움',
    description: '어려운 선택을 위한 명확한 가이드',
    cardCount: 4,
    category: 'simple',
    estimatedTime: '5-7분',
    recommendedFor: ['중요한 결정', '선택의 고민', '방향성 확인'],
    positions: [
      { id: 1, name: '현재 상황', description: '지금 당신이 처한 상황', x: 25, y: 30 },
      { id: 2, name: '선택의 결과', description: '이 결정이 가져올 결과', x: 75, y: 30 },
      { id: 3, name: '고려할 점', description: '놓치지 말아야 할 중요한 요소', x: 25, y: 70 },
      { id: 4, name: '최선의 길', description: '당신에게 가장 좋은 방향', x: 75, y: 70 }
    ]
  }
];

// 스프레드별 해석 가이드
export interface InterpretationGuide {
  spreadType: SpreadType;
  positionMeanings: {
    [positionId: number]: {
      focus: string;
      questions: string[];
      relationToOthers?: number[]; // 연관된 다른 위치들
    };
  };
}

export const INTERPRETATION_GUIDES: Record<SpreadType, InterpretationGuide> = {
  'one-card': {
    spreadType: 'one-card',
    positionMeanings: {
      1: {
        focus: '핵심 메시지',
        questions: ['이 카드가 전하는 주요 메시지는?', '어떤 행동을 취해야 하는가?']
      }
    }
  },
  'three-card': {
    spreadType: 'three-card',
    positionMeanings: {
      1: { 
        focus: '과거의 영향',
        questions: ['어떤 과거 경험이 현재에 영향을 미치는가?'],
        relationToOthers: [2]
      },
      2: {
        focus: '현재 상황',
        questions: ['지금 무엇에 집중해야 하는가?'],
        relationToOthers: [1, 3]
      },
      3: {
        focus: '미래 전망',
        questions: ['어떤 결과가 예상되는가?'],
        relationToOthers: [2]
      }
    }
  },
  'celtic-cross': {
    spreadType: 'celtic-cross',
    positionMeanings: {
      1: {
        focus: '핵심 상황',
        questions: ['현재 상황의 본질은?'],
        relationToOthers: [2, 3, 4]
      },
      2: {
        focus: '도전과 기회',
        questions: ['무엇이 도움이 되거나 방해가 되는가?'],
        relationToOthers: [1]
      },
      3: {
        focus: '근본 원인',
        questions: ['이 상황의 뿌리는?'],
        relationToOthers: [1, 4]
      },
      4: {
        focus: '최근 영향',
        questions: ['최근 어떤 일이 영향을 미쳤는가?'],
        relationToOthers: [1, 5]
      },
      5: {
        focus: '가능한 결과',
        questions: ['어떤 가능성이 있는가?'],
        relationToOthers: [6, 10]
      },
      6: {
        focus: '즉각적 미래',
        questions: ['곧 무슨 일이 일어날까?'],
        relationToOthers: [5, 10]
      },
      7: {
        focus: '내적 자아',
        questions: ['나는 이 상황을 어떻게 보는가?'],
        relationToOthers: [8, 9]
      },
      8: {
        focus: '외부 환경',
        questions: ['주변이 어떤 영향을 미치는가?'],
        relationToOthers: [7, 9]
      },
      9: {
        focus: '내면의 감정',
        questions: ['나의 진짜 소망과 두려움은?'],
        relationToOthers: [7, 10]
      },
      10: {
        focus: '최종 결과',
        questions: ['모든 것을 고려한 최종 결과는?'],
        relationToOthers: [5, 6, 9]
      }
    }
  },
  'relationship': {
    spreadType: 'relationship',
    positionMeanings: {
      1: {
        focus: '당신의 역할',
        questions: ['관계에서 당신은 어떤 역할을 하는가?'],
        relationToOthers: [3, 5]
      },
      2: {
        focus: '상대방의 역할',
        questions: ['상대방은 어떤 역할을 하는가?'],
        relationToOthers: [4, 5]
      },
      3: {
        focus: '당신의 진심',
        questions: ['당신의 진짜 감정은?'],
        relationToOthers: [1, 5]
      },
      4: {
        focus: '상대의 진심',
        questions: ['상대방의 진짜 감정은?'],
        relationToOthers: [2, 5]
      },
      5: {
        focus: '관계 상태',
        questions: ['두 사람 사이의 현재는?'],
        relationToOthers: [1, 2, 3, 4, 6]
      },
      6: {
        focus: '관계 전망',
        questions: ['이 관계는 어디로 향하는가?'],
        relationToOthers: [5]
      }
    }
  },
  'love-spread': {
    spreadType: 'love-spread',
    positionMeanings: {
      1: {
        focus: '당신의 마음',
        questions: ['당신의 진짜 마음은?'],
        relationToOthers: [2, 5]
      },
      2: {
        focus: '상대의 마음',
        questions: ['상대방은 어떻게 생각하는가?'],
        relationToOthers: [1, 5]
      },
      3: {
        focus: '극복할 문제',
        questions: ['무엇이 사랑을 방해하는가?'],
        relationToOthers: [4]
      },
      4: {
        focus: '필요한 행동',
        questions: ['사랑을 위해 무엇을 해야 하는가?'],
        relationToOthers: [3, 5]
      },
      5: {
        focus: '연애 운명',
        questions: ['이 사랑의 운명은?'],
        relationToOthers: [1, 2, 4]
      }
    }
  },
  'career-path': {
    spreadType: 'career-path',
    positionMeanings: {
      1: {
        focus: '현재 상태',
        questions: ['직업적으로 어디에 있는가?'],
        relationToOthers: [2, 3, 4, 5]
      },
      2: {
        focus: '당신의 재능',
        questions: ['어떤 강점을 활용할 수 있는가?'],
        relationToOthers: [1, 4]
      },
      3: {
        focus: '개선점',
        questions: ['무엇을 개선해야 하는가?'],
        relationToOthers: [1, 5]
      },
      4: {
        focus: '다가올 기회',
        questions: ['어떤 기회가 올까?'],
        relationToOthers: [2, 5]
      },
      5: {
        focus: '성공 전략',
        questions: ['어떻게 성공할 수 있는가?'],
        relationToOthers: [2, 3, 4]
      }
    }
  },
  'yes-no': {
    spreadType: 'yes-no',
    positionMeanings: {
      1: {
        focus: '현재 상황 파악',
        questions: ['지금 내가 처한 상황은 무엇인가?', '어떤 배경에서 이 결정을 내려야 하는가?'],
        relationToOthers: [2, 3]
      },
      2: {
        focus: '결정의 결과',
        questions: ['이 선택을 하면 어떤 일이 일어날까?', '기대할 수 있는 결과는?'],
        relationToOthers: [1, 4]
      },
      3: {
        focus: '주의할 점',
        questions: ['어떤 점을 조심해야 하는가?', '놓치면 안 되는 요소는?'],
        relationToOthers: [1, 4]
      },
      4: {
        focus: '최선의 방향',
        questions: ['어떤 길이 나에게 가장 좋을까?', '현명한 선택은 무엇인가?'],
        relationToOthers: [2, 3]
      }
    }
  }
};