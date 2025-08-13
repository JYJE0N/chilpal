// src/data/cups-minor-arcana.ts

// import { MinorArcana } from '@/types/tarot'

// 임시로 타입 정의
interface MinorArcana {
  id: number;
  name: string;
  suit: "cups" | "pentacles" | "swords" | "wands";
  number: number | string;
  has_reversal: false;
  image_url: string;
  upright_meaning: string;
  upright_interpretation: string;
  upright_keywords: string[];
  description?: string;
}

export const cupsCards: MinorArcana[] = [
  {
    id: 22, // 메이저 아르카나 22장 이후부터
    name: "Ace of Cups",
    suit: "cups",
    number: 1,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/ace-cups.jpg",

    upright_meaning: "새로운 사랑, 감정의 시작, 영적 깨달음, 기쁨",
    upright_interpretation:
      "새로운 감정적 경험이나 사랑이 시작됩니다. 마음을 열고 받아들이면 큰 기쁨과 만족을 얻을 수 있어요.",
    upright_keywords: [
      "새로운 사랑",
      "감정의 시작",
      "영적 깨달음",
      "기쁨",
      "풍요로운 감정",
      "마음의 평화",
    ],

    description:
      "하늘에서 내려오는 성배. 새로운 감정과 사랑의 시작을 상징합니다.",
  },
  {
    id: 23,
    name: "Two of Cups",
    suit: "cups",
    number: 2,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/02-cups.jpg",

    upright_meaning: "파트너십, 상호 사랑, 화합, 균형",
    upright_interpretation:
      "이상적인 파트너십이나 깊은 유대감을 나누는 관계가 형성됩니다. 서로를 이해하고 존중하는 아름다운 연결이에요.",
    upright_keywords: [
      "파트너십",
      "상호 사랑",
      "화합",
      "균형",
      "이해",
      "유대감",
    ],

    description:
      "두 잔을 들고 맹세하는 연인들. 상호적인 사랑과 파트너십을 상징합니다.",
  },
  {
    id: 24,
    name: "Three of Cups",
    suit: "cups",
    number: 3,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/03-cups.jpg",

    upright_meaning: "축하, 우정, 공동체, 기쁨 공유",
    upright_interpretation:
      "친구들과 함께 기쁨을 나누고 축하할 일이 생깁니다. 사회적 연결과 소속감을 통해 행복을 느낄 수 있어요.",
    upright_keywords: [
      "축하",
      "우정",
      "공동체",
      "기쁨 공유",
      "사회적 연결",
      "소속감",
    ],

    description:
      "잔을 들고 축하하는 세 여성. 우정과 공동체의 기쁨을 상징합니다.",
  },
  {
    id: 25,
    name: "Four of Cups",
    suit: "cups",
    number: 4,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/04-cups.jpg",

    upright_meaning: "무관심, 지루함, 기회 놓침, 명상",
    upright_interpretation:
      "현재 상황에 만족하지 못하거나 새로운 기회를 놓치고 있을 수 있어요. 내면을 돌아보며 진정 원하는 것을 찾아보세요.",
    upright_keywords: [
      "무관심",
      "지루함",
      "기회 놓침",
      "명상",
      "내적 탐구",
      "재평가",
    ],

    description:
      "나무 아래 앉아 생각에 잠긴 인물. 무관심과 내적 성찰을 상징합니다.",
  },
  {
    id: 26,
    name: "Five of Cups",
    suit: "cups",
    number: 5,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/05-cups.jpg",

    upright_meaning: "상실, 슬픔, 후회, 실망",
    upright_interpretation:
      "상실이나 실망감을 경험하고 있지만, 아직 남아있는 것들에도 눈을 돌려보세요. 모든 것을 잃은 것은 아니에요.",
    upright_keywords: ["상실", "슬픔", "후회", "실망", "아직 남은 것", "희망"],

    description: "엎어진 잔들을 바라보는 슬픈 인물. 상실과 슬픔을 상징합니다.",
  },
  {
    id: 27,
    name: "Six of Cups",
    suit: "cups",
    number: 6,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/06-cups.jpg",

    upright_meaning: "향수, 어린 시절, 순수함, 옛 친구",
    upright_interpretation:
      "과거의 아름다운 기억이나 오랜 친구와의 재회가 있을 수 있어요. 순수했던 마음을 되찾는 시간이에요.",
    upright_keywords: [
      "향수",
      "어린 시절",
      "순수함",
      "옛 친구",
      "아름다운 기억",
      "재회",
    ],

    description: "꽃을 주고받는 아이들. 향수와 순수한 마음을 상징합니다.",
  },
  {
    id: 28,
    name: "Seven of Cups",
    suit: "cups",
    number: 7,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/07-cups.jpg",

    upright_meaning: "환상, 선택의 혼란, 꿈, 비현실적 기대",
    upright_interpretation:
      "너무 많은 선택지 앞에서 혼란스러워하고 있어요. 현실적인 목표를 설정하고 집중할 하나를 선택하세요.",
    upright_keywords: [
      "환상",
      "선택의 혼란",
      "꿈",
      "비현실적 기대",
      "집중",
      "현실적 목표",
    ],

    description:
      "구름 속에서 나타나는 여러 잔들. 환상과 선택의 혼란을 상징합니다.",
  },
  {
    id: 29,
    name: "Eight of Cups",
    suit: "cups",
    number: 8,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/08-cups.jpg",

    upright_meaning: "포기, 떠남, 새로운 추구, 실망",
    upright_interpretation:
      "현재 상황을 떠나 새로운 것을 추구할 때입니다. 어려운 결정이지만 더 나은 미래를 위해 필요한 선택이에요.",
    upright_keywords: [
      "포기",
      "떠남",
      "새로운 추구",
      "실망",
      "더 나은 미래",
      "용기있는 선택",
    ],

    description:
      "잔들을 뒤로하고 떠나는 인물. 포기와 새로운 추구를 상징합니다.",
  },
  {
    id: 30,
    name: "Nine of Cups",
    suit: "cups",
    number: 9,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/09-cups.jpg",

    upright_meaning: "만족, 소원 성취, 행복, 감정적 충족",
    upright_interpretation:
      "소원이 이루어지고 깊은 만족감을 느끼는 시기입니다. 감정적으로 충족되고 행복한 상태를 경험하게 될 거예요.",
    upright_keywords: [
      "만족",
      "소원 성취",
      "행복",
      "감정적 충족",
      "깊은 만족",
      "성취감",
    ],

    description:
      "잔들 앞에서 만족스러워하는 인물. 소원 성취와 만족을 상징합니다.",
  },
  {
    id: 31,
    name: "Ten of Cups",
    suit: "cups",
    number: 10,
    has_reversal: false,
    image_url: "/images/cards/minor/cups/10-cups.jpg",

    upright_meaning: "완전한 행복, 가족, 조화, 감정적 완성",
    upright_interpretation:
      "가족이나 사랑하는 사람들과 함께하는 완전한 행복을 경험합니다. 감정적으로 완성된 상태의 조화로운 삶이에요.",
    upright_keywords: [
      "완전한 행복",
      "가족",
      "조화",
      "감정적 완성",
      "사랑하는 사람들",
      "완성된 삶",
    ],

    description: "무지개 아래 행복한 가족. 완전한 행복과 조화를 상징합니다.",
  },
  {
    id: 32,
    name: "Page of Cups",
    suit: "cups",
    number: "page",
    has_reversal: false,
    image_url: "/images/cards/minor/cups/page-cups.jpg",

    upright_meaning: "감정적 메시지, 직감, 창의성, 순수함",
    upright_interpretation:
      "새로운 감정적 경험이나 직감적 통찰이 찾아옵니다. 순수한 마음으로 창의적 영감을 받아들이세요.",
    upright_keywords: [
      "감정적 메시지",
      "직감",
      "창의성",
      "순수함",
      "영감",
      "새로운 경험",
    ],

    description:
      "잔을 들고 있는 젊은 페이지. 감정적 메시지와 직감을 상징합니다.",
  },
  {
    id: 33,
    name: "Knight of Cups",
    suit: "cups",
    number: "knight",
    has_reversal: false,
    image_url: "/images/cards/minor/cups/knight-cups.jpg",

    upright_meaning: "로맨틱, 이상주의, 감정적 추구, 예술적 영감",
    upright_interpretation:
      "감정에 충실하며 이상을 추구하는 시기입니다. 로맨틱한 상황이나 예술적 영감을 통해 감동을 받을 수 있어요.",
    upright_keywords: [
      "로맨틱",
      "이상주의",
      "감정적 추구",
      "예술적 영감",
      "감동",
      "이상 추구",
    ],

    description: "잔을 든 채 말을 타고 가는 기사. 로맨틱한 추구를 상징합니다.",
  },
  {
    id: 34,
    name: "Queen of Cups",
    suit: "cups",
    number: "queen",
    has_reversal: false,
    image_url: "/images/cards/minor/cups/queen-cups.jpg",

    upright_meaning: "직감적 지혜, 감정적 성숙, 공감, 돌봄",
    upright_interpretation:
      "깊은 직감과 감정적 지혜를 가지고 다른 사람들을 돌보고 이해하는 역할을 하게 됩니다. 공감 능력이 특별히 발휘되는 시기예요.",
    upright_keywords: [
      "직감적 지혜",
      "감정적 성숙",
      "공감",
      "돌봄",
      "이해",
      "감정적 리더십",
    ],

    description:
      "바다를 바라보며 잔을 든 여왕. 직감적 지혜와 공감을 상징합니다.",
  },
  {
    id: 35,
    name: "King of Cups",
    suit: "cups",
    number: "king",
    has_reversal: false,
    image_url: "/images/cards/minor/cups/king-cups.jpg",

    upright_meaning: "감정적 균형, 지혜로운 조언, 자비, 평정심",
    upright_interpretation:
      "감정을 잘 조절하며 지혜로운 조언을 할 수 있는 상태입니다. 자비롭고 균형잡힌 리더십을 발휘하게 될 거예요.",
    upright_keywords: [
      "감정적 균형",
      "지혜로운 조언",
      "자비",
      "평정심",
      "균형잡힌 리더십",
      "감정 조절",
    ],

    description: "바다 위 보좌에 앉은 왕. 감정적 균형과 지혜를 상징합니다.",
  },
];

// 유틸리티 함수들
export const getCupsCardById = (id: number): MinorArcana | undefined => {
  return cupsCards.find((card) => card.id === id);
};

export const getCupsCardByNumber = (
  number: number | "page" | "knight" | "queen" | "king"
): MinorArcana | undefined => {
  return cupsCards.find((card) => card.number === number);
};

export const shuffleCupsCards = (): MinorArcana[] => {
  return [...cupsCards].sort(() => Math.random() - 0.5);
};
