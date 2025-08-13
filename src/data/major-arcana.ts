// src/data/major-arcana.ts

import { TarotCard } from "@/types/tarot";

export const majorArcanaCards: TarotCard[] = [
  {
    id: 0,
    name: "The Fool",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/00-fool.jpg",

    // 정방향
    upright_meaning: "새로운 시작, 순수함, 모험, 신뢰",
    upright_interpretation:
      "새로운 여정이 당신을 기다리고 있습니다. 두려움을 내려놓고 순수한 마음으로 첫 발을 내딛으세요. 미지의 길이지만 우주가 당신을 보호하고 있습니다.",
    upright_keywords: [
      "새로운 시작",
      "모험",
      "순수함",
      "신뢰",
      "자유",
      "가능성",
    ],

    // 역방향
    reversed_meaning: "무모함, 경솔함, 준비 부족, 위험한 선택",
    reversed_interpretation:
      "성급한 결정을 피하세요. 충분한 준비 없이 시작하면 위험할 수 있습니다. 신중함과 계획이 필요한 때입니다.",
    reversed_keywords: ["무모함", "경솔함", "준비부족", "위험", "충동", "실수"],

    description:
      "절벽 끝에 서 있는 젊은이. 새로운 모험을 향한 순수한 마음을 상징합니다.",
  },
  {
    id: 1,
    name: "The Magician",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/01-magician.jpg",

    upright_meaning: "의지력, 창조, 실현, 능력",
    upright_interpretation:
      "당신에게는 목표를 이룰 수 있는 모든 도구와 능력이 있습니다. 강한 의지와 행동으로 원하는 현실을 창조해나가세요.",
    upright_keywords: ["의지력", "창조", "실현", "능력", "자신감", "리더십"],

    reversed_meaning: "자기기만, 조작, 능력 오용, 허세",
    reversed_interpretation:
      "자신의 능력을 과신하거나 잘못된 방향으로 사용하고 있지 않은지 돌아보세요. 진정한 실력을 기르는 것이 중요합니다.",
    reversed_keywords: ["자기기만", "조작", "허세", "오용", "미숙함", "속임수"],

    description: "네 원소의 도구를 가진 마법사. 창조와 실현의 힘을 상징합니다.",
  },
  {
    id: 2,
    name: "The High Priestess",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/02-high-priestess.jpg",

    upright_meaning: "직감, 내적 지혜, 신비, 잠재의식",
    upright_interpretation:
      "논리보다는 직감에 귀 기울이세요. 당신 내면의 지혜가 올바른 답을 알고 있습니다. 명상과 성찰의 시간이 필요합니다.",
    upright_keywords: [
      "직감",
      "내적지혜",
      "신비",
      "잠재의식",
      "명상",
      "여성성",
    ],

    reversed_meaning: "직감 무시, 내면의 목소리 차단, 비밀, 혼란",
    reversed_interpretation:
      "내면의 목소리를 무시하고 있습니다. 숨겨진 진실이 있거나 직감적 판단을 피하고 있는 상황입니다.",
    reversed_keywords: [
      "직감무시",
      "혼란",
      "비밀",
      "차단",
      "불신",
      "표면적사고",
    ],

    description: "신성한 기둥 사이에 앉은 여성. 내적 지혜와 직감을 상징합니다.",
  },
  {
    id: 3,
    name: "The Empress",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/03-empress.jpg",

    upright_meaning: "풍요, 창조력, 모성, 자연",
    upright_interpretation:
      "창조적 에너지가 당신 주변에 흐르고 있습니다. 인내심을 갖고 돌보면 풍요로운 결실을 맺을 것입니다. 사랑과 보살핌의 시기입니다.",
    upright_keywords: ["풍요", "창조력", "모성", "자연", "성장", "돌봄"],

    reversed_meaning: "창조력 막힘, 과보호, 의존, 불임",
    reversed_interpretation:
      "창조적 에너지가 막혀있거나 과도한 의존 관계에 있을 수 있습니다. 독립성과 균형을 찾아야 할 때입니다.",
    reversed_keywords: [
      "창조력막힘",
      "과보호",
      "의존",
      "불균형",
      "독립필요",
      "성장저해",
    ],

    description:
      "자연 속에서 휴식하는 임신한 여성. 풍요와 창조력을 상징합니다.",
  },
  {
    id: 4,
    name: "The Emperor",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/04-emperor.jpg",

    upright_meaning: "권위, 안정, 질서, 리더십",
    upright_interpretation:
      "확고한 의지와 계획으로 상황을 통제할 때입니다. 리더십을 발휘하고 책임감을 가지며 체계적으로 접근하세요.",
    upright_keywords: ["권위", "안정", "질서", "리더십", "통제", "책임감"],

    reversed_meaning: "독재, 경직성, 통제 상실, 권위주의",
    reversed_interpretation:
      "너무 경직되거나 독단적이 되고 있지 않은지 점검하세요. 유연성과 소통이 필요한 상황입니다.",
    reversed_keywords: [
      "독재",
      "경직성",
      "통제상실",
      "독단적",
      "유연성부족",
      "소통부족",
    ],

    description: "왕좌에 앉은 황제. 권위와 안정된 질서를 상징합니다.",
  },
  {
    id: 5,
    name: "The Hierophant",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/05-hierophant.jpg",

    upright_meaning: "전통, 교육, 영성, 조언",
    upright_interpretation:
      "전통적인 지혜나 멘토의 조언을 구하세요. 기존의 가르침과 체계적인 학습이 도움이 될 것입니다.",
    upright_keywords: ["전통", "교육", "영성", "조언", "멘토", "체계"],

    reversed_meaning: "반항, 독단, 교조주의, 제한",
    reversed_interpretation:
      "기존의 틀에서 벗어나야 할 때입니다. 맹목적인 따름보다는 자신만의 길을 찾아야 합니다.",
    reversed_keywords: [
      "반항",
      "독단",
      "교조주의",
      "제한",
      "자유로움",
      "새로운길",
    ],

    description: "종교적 권위자. 전통과 영적 가르침을 상징합니다.",
  },
  {
    id: 6,
    name: "The Lovers",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/06-lovers.jpg",

    upright_meaning: "사랑, 선택, 조화, 관계",
    upright_interpretation:
      "중요한 선택의 순간이 다가왔습니다. 마음의 소리에 귀 기울이고 진정한 사랑과 조화를 선택하세요.",
    upright_keywords: ["사랑", "선택", "조화", "관계", "결합", "균형"],

    reversed_meaning: "불화, 잘못된 선택, 관계 문제, 갈등",
    reversed_interpretation:
      "관계에서 갈등이나 불균형이 있습니다. 진정한 마음을 확인하고 올바른 선택을 위해 시간을 가지세요.",
    reversed_keywords: [
      "불화",
      "잘못된선택",
      "관계문제",
      "갈등",
      "불균형",
      "혼란",
    ],

    description: "천사의 축복을 받는 연인들. 사랑과 중요한 선택을 상징합니다.",
  },
  {
    id: 7,
    name: "The Chariot",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/07-chariot.jpg",

    upright_meaning: "승리, 의지력, 통제, 전진",
    upright_interpretation:
      "강한 의지와 집중력으로 목표를 향해 전진하세요. 상반된 힘들을 통제하여 승리를 이끌어낼 수 있습니다.",
    upright_keywords: ["승리", "의지력", "통제", "전진", "집중", "성취"],

    reversed_meaning: "통제 상실, 방향성 부족, 좌절, 산만함",
    reversed_interpretation:
      "방향성을 잃고 있거나 너무 많은 것을 동시에 추진하고 있습니다. 집중력을 회복하고 우선순위를 정하세요.",
    reversed_keywords: [
      "통제상실",
      "방향성부족",
      "좌절",
      "산만함",
      "혼란",
      "우선순위부족",
    ],

    description: "전차를 모는 전사. 의지력과 승리를 상징합니다.",
  },
  {
    id: 8,
    name: "Strength",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/08-strength.jpg",

    upright_meaning: "용기, 내적 힘, 인내, 자제력",
    upright_interpretation:
      "물리적 힘이 아닌 내적 용기와 인내로 어려움을 극복하세요. 부드러움과 강함을 동시에 가진 진정한 힘을 발휘할 때입니다.",
    upright_keywords: ["용기", "내적힘", "인내", "자제력", "부드러움", "극복"],

    reversed_meaning: "약함, 자제력 상실, 두려움, 포기",
    reversed_interpretation:
      "내적 힘이 약해져 있거나 자제력을 잃고 있습니다. 용기를 회복하고 인내심을 기르는 것이 필요합니다.",
    reversed_keywords: [
      "약함",
      "자제력상실",
      "두려움",
      "포기",
      "인내부족",
      "용기부족",
    ],

    description: "사자와 함께하는 여성. 부드러운 힘과 용기를 상징합니다.",
  },
  {
    id: 9,
    name: "The Hermit",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/09-hermit.jpg",

    upright_meaning: "내적 탐구, 지혜, 고독, 성찰",
    upright_interpretation:
      "혼자만의 시간이 필요합니다. 내면의 목소리에 집중하며 진정한 지혜와 깨달음을 얻을 수 있는 시기입니다.",
    upright_keywords: ["내적탐구", "지혜", "고독", "성찰", "깨달음", "명상"],

    reversed_meaning: "고립, 외로움, 내적 혼란, 조언 거부",
    reversed_interpretation:
      "과도한 고립이나 다른 사람의 조언을 거부하고 있습니다. 균형잡힌 소통과 교류가 필요한 때입니다.",
    reversed_keywords: [
      "고립",
      "외로움",
      "내적혼란",
      "조언거부",
      "소통부족",
      "균형필요",
    ],

    description: "등불을 든 은둔자. 내적 탐구와 지혜를 상징합니다.",
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/10-wheel-of-fortune.jpg",

    upright_meaning: "변화, 운명, 기회, 순환",
    upright_interpretation:
      "인생의 큰 변화가 다가오고 있습니다. 운명의 바퀴가 돌고 있으니 변화를 받아들이고 새로운 기회를 잡으세요.",
    upright_keywords: ["변화", "운명", "기회", "순환", "행운", "전환점"],

    reversed_meaning: "불운, 정체, 나쁜 순환, 저항",
    reversed_interpretation:
      "변화에 저항하거나 부정적인 패턴에 갇혀있습니다. 관점을 바꾸고 능동적으로 상황을 개선해야 합니다.",
    reversed_keywords: [
      "불운",
      "정체",
      "나쁜순환",
      "저항",
      "부정적패턴",
      "개선필요",
    ],

    description: "운명의 수레바퀴. 변화와 순환의 법칙을 상징합니다.",
  },
  {
    id: 11,
    name: "Justice",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/11-justice.jpg",

    upright_meaning: "정의, 균형, 진실, 공정",
    upright_interpretation:
      "진실이 밝혀질 때입니다. 공정함을 유지하고 균형잡힌 판단을 내리세요. 모든 행동에는 그에 따른 결과가 있습니다.",
    upright_keywords: ["정의", "균형", "진실", "공정", "판단", "책임"],

    reversed_meaning: "불공정, 편견, 거짓, 불균형",
    reversed_interpretation:
      "편견이나 불공정한 판단에 휘둘리고 있습니다. 객관적 시각을 회복하고 진실을 직시해야 합니다.",
    reversed_keywords: [
      "불공정",
      "편견",
      "거짓",
      "불균형",
      "주관적판단",
      "진실회피",
    ],

    description: "저울과 검을 든 정의의 여신. 공정함과 균형을 상징합니다.",
  },
  {
    id: 12,
    name: "The Hanged Man",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/12-hanged-man.jpg",

    upright_meaning: "희생, 관점 전환, 대기, 깨달음",
    upright_interpretation:
      "잠시 멈추고 다른 관점에서 상황을 바라보세요. 희생과 인내를 통해 더 큰 깨달음을 얻을 수 있습니다.",
    upright_keywords: ["희생", "관점전환", "대기", "깨달음", "인내", "성찰"],

    reversed_meaning: "헛된 희생, 지연, 저항, 실망",
    reversed_interpretation:
      "의미없는 희생을 하고 있거나 필요한 변화를 받아들이지 못하고 있습니다. 능동적인 행동이 필요합니다.",
    reversed_keywords: [
      "헛된희생",
      "지연",
      "저항",
      "실망",
      "변화거부",
      "능동적행동필요",
    ],

    description: "거꾸로 매달린 남성. 희생과 새로운 관점을 상징합니다.",
  },
  {
    id: 13,
    name: "Death",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/13-death.jpg",

    upright_meaning: "변화, 종료, 재생, 전환",
    upright_interpretation:
      "한 단계가 끝나고 새로운 시작이 다가옵니다. 끝은 곧 새로운 시작을 의미하니 변화를 두려워하지 마세요.",
    upright_keywords: ["변화", "종료", "재생", "전환", "새로운시작", "해방"],

    reversed_meaning: "변화 저항, 정체, 끝나지 않는 상황",
    reversed_interpretation:
      "필요한 변화를 피하고 있거나 끝내야 할 것을 붙잡고 있습니다. 과감한 결단이 필요한 때입니다.",
    reversed_keywords: [
      "변화저항",
      "정체",
      "끝나지않는상황",
      "결단부족",
      "집착",
      "과감함필요",
    ],

    description: "죽음의 기사. 변화와 재생의 과정을 상징합니다.",
  },
  {
    id: 14,
    name: "Temperance",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/14-temperance.jpg",

    upright_meaning: "절제, 조화, 균형, 인내",
    upright_interpretation:
      "극단을 피하고 중도를 선택하세요. 인내심을 갖고 조화로운 해결책을 찾다보면 균형잡힌 결과를 얻을 수 있습니다.",
    upright_keywords: ["절제", "조화", "균형", "인내", "중도", "화합"],

    reversed_meaning: "불균형, 극단, 과도함, 조급함",
    reversed_interpretation:
      "균형을 잃고 극단적인 방향으로 치우치고 있습니다. 절제와 인내심을 회복해야 할 때입니다.",
    reversed_keywords: [
      "불균형",
      "극단",
      "과도함",
      "조급함",
      "절제부족",
      "인내부족",
    ],

    description: "물을 섞는 천사. 절제와 조화의 덕목을 상징합니다.",
  },
  {
    id: 15,
    name: "The Devil",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/15-devil.jpg",

    upright_meaning: "유혹, 속박, 중독, 물질주의",
    upright_interpretation:
      "유혹이나 나쁜 습관에 속박되어 있는 상황입니다. 자신을 제한하는 것들을 인식하고 벗어날 용기를 가지세요.",
    upright_keywords: ["유혹", "속박", "중독", "물질주의", "제한", "탐욕"],

    reversed_meaning: "해방, 각성, 자유, 속박에서 벗어남",
    reversed_interpretation:
      "자신을 제한하던 것들에서 벗어나고 있습니다. 진정한 자유와 각성을 통해 새로운 삶을 시작할 수 있습니다.",
    reversed_keywords: [
      "해방",
      "각성",
      "자유",
      "속박에서벗어남",
      "깨달음",
      "새로운삶",
    ],

    description: "사슬에 묶인 인간들과 악마. 유혹과 속박을 상징합니다.",
  },
  {
    id: 16,
    name: "The Tower",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/16-tower.jpg",

    upright_meaning: "파괴, 급변, 각성, 해방",
    upright_interpretation:
      "기존의 틀이 무너지고 있습니다. 충격적이지만 이는 새로운 깨달음과 진정한 자유를 위한 필연적 과정입니다.",
    upright_keywords: ["파괴", "급변", "각성", "해방", "충격", "진실"],

    reversed_meaning: "점진적 변화, 내적 변화, 파괴 회피",
    reversed_interpretation:
      "갑작스러운 변화를 피하고 있거나 내적으로 변화가 일어나고 있습니다. 천천히 하지만 확실한 변화가 필요합니다.",
    reversed_keywords: [
      "점진적변화",
      "내적변화",
      "파괴회피",
      "서서히",
      "내면의변화",
      "안정적변화",
    ],

    description: "번개에 맞은 탑. 급격한 변화와 깨달음을 상징합니다.",
  },
  {
    id: 17,
    name: "The Star",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/17-star.jpg",

    upright_meaning: "희망, 영감, 치유, 평화",
    upright_interpretation:
      "어둠 속에서도 희망의 빛이 보입니다. 꿈을 포기하지 말고 영감을 따라가면 치유와 평화를 찾을 수 있습니다.",
    upright_keywords: ["희망", "영감", "치유", "평화", "꿈", "인도"],

    reversed_meaning: "절망, 희망 상실, 방향성 부족, 좌절",
    reversed_interpretation:
      "희망을 잃고 방향성을 찾지 못하고 있습니다. 내면의 빛을 다시 찾고 긍정적인 에너지를 회복해야 합니다.",
    reversed_keywords: [
      "절망",
      "희망상실",
      "방향성부족",
      "좌절",
      "긍정에너지부족",
      "내면의빛",
    ],

    description: "별빛 아래 물을 붓는 여성. 희망과 영감을 상징합니다.",
  },
  {
    id: 18,
    name: "The Moon",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/18-moon.jpg",

    upright_meaning: "환상, 직감, 무의식, 혼란",
    upright_interpretation:
      "현실과 환상이 뒤섞여 있습니다. 직감을 믿되 신중하게 판단하고, 숨겨진 진실을 찾기 위해 노력하세요.",
    upright_keywords: ["환상", "직감", "무의식", "혼란", "신비", "숨겨진진실"],

    reversed_meaning: "명확성, 환상에서 깨어남, 진실 발견",
    reversed_interpretation:
      "혼란스러웠던 상황이 명확해지고 있습니다. 환상에서 벗어나 진실을 마주할 준비가 되었습니다.",
    reversed_keywords: [
      "명확성",
      "환상에서깨어남",
      "진실발견",
      "혼란해소",
      "깨달음",
      "현실직시",
    ],

    description: "달빛 아래의 신비로운 풍경. 환상과 무의식을 상징합니다.",
  },
  {
    id: 19,
    name: "The Sun",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/19-sun.jpg",

    upright_meaning: "성공, 기쁨, 활력, 성취",
    upright_interpretation:
      "모든 것이 밝은 방향으로 흘러가고 있습니다. 자신감을 갖고 기쁨을 만끽하며 성공을 축하하세요.",
    upright_keywords: ["성공", "기쁨", "활력", "성취", "자신감", "밝은미래"],

    reversed_meaning: "일시적 실패, 기쁨 부족, 과신, 지연",
    reversed_interpretation:
      "일시적인 어려움이나 과신으로 인한 문제가 있을 수 있습니다. 겸손함을 유지하며 인내심을 가지세요.",
    reversed_keywords: [
      "일시적실패",
      "기쁨부족",
      "과신",
      "지연",
      "겸손함",
      "인내심",
    ],

    description: "밝은 태양 아래 기뻐하는 아이. 성공과 기쁨을 상징합니다.",
  },
  {
    id: 20,
    name: "Judgement",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/20-judgement.jpg",

    upright_meaning: "재생, 각성, 용서, 새로운 시작",
    upright_interpretation:
      "과거를 정리하고 새롭게 태어날 시간입니다. 용서하고 새로운 출발을 하며 더 높은 차원의 삶을 시작하세요.",
    upright_keywords: ["재생", "각성", "용서", "새로운시작", "정리", "승화"],

    reversed_meaning: "자기 비판, 과거에 얽매임, 용서 거부",
    reversed_interpretation:
      "과거의 실수나 후회에 얽매여 있습니다. 자신을 용서하고 앞으로 나아갈 용기가 필요합니다.",
    reversed_keywords: [
      "자기비판",
      "과거에얽매임",
      "용서거부",
      "후회",
      "앞으로나아가기",
      "용기필요",
    ],

    description: "천사의 나팔소리에 부활하는 사람들. 재생과 각성을 상징합니다.",
  },
  {
    id: 21,
    name: "The World",
    suit: "major",
    number: undefined,
    has_reversal: true,
    image_url: "/images/cards/major/21-world.jpg",

    upright_meaning: "완성, 성취, 완전함, 여행",
    upright_interpretation:
      "긴 여정이 성공적으로 마무리됩니다. 완전한 성취감을 느끼며 다음 단계의 새로운 여정을 준비하세요.",
    upright_keywords: ["완성", "성취", "완전함", "여행", "성공", "다음단계"],

    reversed_meaning: "미완성, 목표 달성 지연, 만족 부족",
    reversed_interpretation:
      "목표에 거의 도달했지만 아직 완성되지 않았습니다. 마지막 노력을 기울여 진정한 완성을 이루어내세요.",
    reversed_keywords: [
      "미완성",
      "목표달성지연",
      "만족부족",
      "마지막노력",
      "완성을향해",
      "진정한성취",
    ],

    description: "세계를 둘러싼 화환 속 춤추는 인물. 완성과 성취를 상징합니다.",
  },
];

// 유틸리티 함수들
export const getMajorArcanaById = (id: number): TarotCard | undefined => {
  return majorArcanaCards.find((card) => card.id === id);
};

export const getMajorArcanaByName = (name: string): TarotCard | undefined => {
  return majorArcanaCards.find(
    (card) => card.name.toLowerCase() === name.toLowerCase()
  );
};

export const shuffleMajorArcana = (): TarotCard[] => {
  return [...majorArcanaCards].sort(() => Math.random() - 0.5);
};
