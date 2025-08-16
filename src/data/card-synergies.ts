import { CardSynergy } from '@/lib/contextual-interpretation';

// 카드 조합 시너지 데이터
export const cardSynergies: CardSynergy[] = [
  // 강력한 시너지 - 메이저 아르카나 조합
  {
    cards: ['Death', 'The Fool'],
    interpretation: '완전한 새출발. 과거와의 단절 후 새로운 인생이 시작됨. 재탄생의 강력한 에너지.',
    strength: 'strong'
  },
  {
    cards: ['The Lovers', 'Two of Cups'],
    interpretation: '강력한 사랑의 에너지. 소울메이트를 만날 가능성. 운명적인 만남.',
    strength: 'strong'
  },
  {
    cards: ['The Tower', 'Death'],
    interpretation: '급격한 변화와 파괴. 하지만 이는 필요한 정화 과정. 완전한 재구축.',
    strength: 'strong'
  },
  {
    cards: ['The Sun', 'The Star'],
    interpretation: '희망과 성공이 함께하는 시기. 모든 일이 순조롭게 진행. 우주의 축복.',
    strength: 'strong'
  },
  {
    cards: ['The World', 'The Fool'],
    interpretation: '한 사이클의 완성과 새로운 시작. 완벽한 타이밍의 전환.',
    strength: 'strong'
  },
  {
    cards: ['The Magician', 'The High Priestess'],
    interpretation: '의식과 무의식의 완벽한 조화. 직관과 행동력의 균형. 창조의 힘.',
    strength: 'strong'
  },
  {
    cards: ['The Emperor', 'The Empress'],
    interpretation: '남성성과 여성성의 조화. 권력과 자비의 균형. 완벽한 파트너십.',
    strength: 'strong'
  },
  {
    cards: ['Wheel of Fortune', 'The Sun'],
    interpretation: '행운이 최고조에 달함. 모든 것이 당신 편. 황금기의 도래.',
    strength: 'strong'
  },
  {
    cards: ['Justice', 'Judgement'],
    interpretation: '카르마의 완성. 과거의 모든 것이 정리됨. 공정한 심판과 새출발.',
    strength: 'strong'
  },
  
  // 중간 강도 시너지
  {
    cards: ['The Hierophant', 'Justice'],
    interpretation: '전통과 공정함의 조화. 올바른 길을 걷고 있음. 도덕적 승리.',
    strength: 'moderate'
  },
  {
    cards: ['Strength', 'The Chariot'],
    interpretation: '내적 힘과 외적 추진력의 결합. 어떤 장애물도 극복 가능.',
    strength: 'moderate'
  },
  {
    cards: ['The Hermit', 'The High Priestess'],
    interpretation: '깊은 내면의 지혜. 영적 깨달음의 시기. 직관력 최고조.',
    strength: 'moderate'
  },
  {
    cards: ['Temperance', 'The Star'],
    interpretation: '치유와 균형의 에너지. 평화로운 미래. 조화로운 발전.',
    strength: 'moderate'
  },
  {
    cards: ['The Moon', 'The High Priestess'],
    interpretation: '강력한 직관과 예지력. 숨겨진 진실 발견. 무의식의 메시지.',
    strength: 'moderate'
  },
  {
    cards: ['The Devil', 'The Tower'],
    interpretation: '속박에서의 극적인 해방. 고통스럽지만 필요한 변화.',
    strength: 'moderate'
  },
  {
    cards: ['The Hanged Man', 'The Hermit'],
    interpretation: '깊은 성찰과 깨달음. 기다림 속에서 찾는 지혜.',
    strength: 'moderate'
  },
  
  // 마이너 아르카나 포함 시너지
  {
    cards: ['Ace of Cups', 'The Lovers'],
    interpretation: '새로운 사랑의 시작. 감정적 충만함. 로맨스의 절정.',
    strength: 'moderate'
  },
  {
    cards: ['Ten of Pentacles', 'The World'],
    interpretation: '물질적 성공과 완성. 재정적 안정. 세대를 이어가는 부.',
    strength: 'moderate'
  },
  {
    cards: ['Ace of Wands', 'The Magician'],
    interpretation: '창조적 에너지의 폭발. 새로운 프로젝트 대성공.',
    strength: 'moderate'
  },
  {
    cards: ['Three of Swords', 'The Tower'],
    interpretation: '고통스러운 진실의 발견. 관계의 급작스런 종료.',
    strength: 'moderate'
  },
  
  // 부드러운 시너지
  {
    cards: ['Six of Cups', 'The Fool'],
    interpretation: '순수한 기쁨과 동심. 과거의 행복한 기억이 새로운 시작을 돕는다.',
    strength: 'subtle'
  },
  {
    cards: ['Four of Wands', 'The Sun'],
    interpretation: '축하와 기쁨의 시간. 성공적인 완성과 행복.',
    strength: 'subtle'
  },
  {
    cards: ['Queen of Cups', 'The Empress'],
    interpretation: '모성애와 직관력. 감정적 풍요로움.',
    strength: 'subtle'
  },
  {
    cards: ['King of Pentacles', 'The Emperor'],
    interpretation: '물질적 권력과 안정. 사업적 성공.',
    strength: 'subtle'
  },
  {
    cards: ['Page of Swords', 'The Fool'],
    interpretation: '호기심과 새로운 아이디어. 젊은 에너지.',
    strength: 'subtle'
  },
  {
    cards: ['Knight of Wands', 'The Chariot'],
    interpretation: '열정적인 추진력. 모험과 도전 정신.',
    strength: 'subtle'
  },
  
  // 도전적 시너지 (주의가 필요한 조합)
  {
    cards: ['The Devil', 'Seven of Swords'],
    interpretation: '속임수와 유혹의 위험. 조심스러운 접근 필요.',
    strength: 'moderate'
  },
  
  // 추가 강력한 시너지 조합
  {
    cards: ['The High Priestess', 'The Moon'],
    interpretation: '강력한 직감과 영적 통찰력. 숨겨진 진실을 발견하는 시기.',
    strength: 'strong'
  },
  {
    cards: ['The Empress', 'Ace of Pentacles'],
    interpretation: '물질적 풍요와 새로운 기회. 비옥한 토양에서 자라나는 성공.',
    strength: 'strong'
  },
  {
    cards: ['The Hermit', 'Two of Swords'],
    interpretation: '내면의 성찰을 통한 올바른 선택. 고독한 사색이 답을 제시.',
    strength: 'moderate'
  },
  {
    cards: ['Temperance', 'Six of Pentacles'],
    interpretation: '균형잡힌 나눔과 조화. 베푸는 마음이 더 큰 풍요를 가져다줌.',
    strength: 'moderate'
  },
  {
    cards: ['The Hanged Man', 'Eight of Cups'],
    interpretation: '현재 상황에서 벗어나려는 의지. 기다림 후의 새로운 여정.',
    strength: 'moderate'
  },
  {
    cards: ['Justice', 'Three of Swords'],
    interpretation: '아픈 진실과 공정한 판단. 필요한 분리와 치유.',
    strength: 'moderate'
  },
  {
    cards: ['The Hierophant', 'Six of Cups'],
    interpretation: '전통적 가치와 순수함. 과거의 교훈이 현재를 인도.',
    strength: 'subtle'
  },
  {
    cards: ['Strength', 'Queen of Wands'],
    interpretation: '내면의 힘과 자신감. 여성적 리더십과 용기.',
    strength: 'strong'
  },
  {
    cards: ['Ace of Cups', 'Ten of Pentacles'],
    interpretation: '새로운 사랑이 가족의 행복으로 확장. 감정적 물질적 풍요.',
    strength: 'strong'
  },
  {
    cards: ['Five of Pentacles', 'The Star'],
    interpretation: '어려운 시기 후 찾아오는 희망. 절망에서 구원으로.',
    strength: 'strong'
  },
  {
    cards: ['Nine of Swords', 'The Sun'],
    interpretation: '불안과 걱정이 기쁨으로 전환. 어둠 후의 밝은 미래.',
    strength: 'strong'
  },
  {
    cards: ['Four of Cups', 'Wheel of Fortune'],
    interpretation: '정체된 상황에 급작스런 변화. 놓친 기회의 재등장.',
    strength: 'moderate'
  },
  {
    cards: ['Seven of Wands', 'The Emperor'],
    interpretation: '권위와 도전 정신. 강한 의지력으로 위치 수호.',
    strength: 'moderate'
  },
  {
    cards: ['Two of Pentacles', 'Judgement'],
    interpretation: '균형을 맞추려는 노력이 새로운 각성으로. 복잡함에서 명확함으로.',
    strength: 'moderate'
  },
  {
    cards: ['Eight of Wands', 'The Fool'],
    interpretation: '빠른 진전과 새로운 시작. 성급하지만 긍정적인 변화.',
    strength: 'subtle'
  },
  {
    cards: ['Ten of Cups', 'Four of Wands'],
    interpretation: '완벽한 가정의 행복과 축복. 사랑하는 이들과의 기쁨.',
    strength: 'strong'
  },
  {
    cards: ['King of Swords', 'The High Priestess'],
    interpretation: '논리와 직감의 완벽한 조화. 지혜로운 판단력.',
    strength: 'strong'
  },
  {
    cards: ['Three of Pentacles', 'The World'],
    interpretation: '협력을 통한 완벽한 성취. 팀워크의 최종 완성.',
    strength: 'strong'
  },
  {
    cards: ['Five of Swords', 'The Tower'],
    interpretation: '갈등과 패배가 가져오는 급격한 변화. 필요한 파괴.',
    strength: 'moderate'
  },
  {
    cards: ['Five of Pentacles', 'The Tower'],
    interpretation: '재정적 위기. 물질적 손실. 재건이 필요한 시기.',
    strength: 'moderate'
  },
  {
    cards: ['The Moon', 'Seven of Cups'],
    interpretation: '환상과 착각의 위험. 현실을 직시해야 할 때.',
    strength: 'moderate'
  },
  {
    cards: ['Three of Swords', 'Five of Cups'],
    interpretation: '깊은 슬픔과 상실감. 치유가 필요한 시기.',
    strength: 'moderate'
  },
  
  // 긍정적 전환 시너지
  {
    cards: ['Death', 'The Sun'],
    interpretation: '어둠 뒤의 빛. 고통 끝의 기쁨. 완전한 재탄생.',
    strength: 'strong'
  },
  {
    cards: ['The Tower', 'The Star'],
    interpretation: '파괴 후의 희망. 재건의 가능성. 더 나은 미래.',
    strength: 'strong'
  },
  {
    cards: ['The Hanged Man', 'The World'],
    interpretation: '인내의 결실. 기다림 끝의 완성.',
    strength: 'moderate'
  },
  {
    cards: ['Five of Cups', 'The Star'],
    interpretation: '슬픔 후의 희망. 치유의 시작.',
    strength: 'moderate'
  }
];