import { 
  classifyQuestion, 
  generateOverallInterpretation,
  generateKeywordInsights 
} from '../tarot-interpretation';
import { DrawnCard } from '@/types/tarot';

describe('Tarot Interpretation', () => {
  describe('classifyQuestion', () => {
    it('연애 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('그 사람이 나를 좋아할까요?')).toBe('love');
      expect(classifyQuestion('우리 사이는 어떻게 될까요?')).toBe('love');
      expect(classifyQuestion('결혼할 수 있을까요?')).toBe('love');
    });

    it('직업 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('이직하는 게 좋을까요?')).toBe('career');
      expect(classifyQuestion('승진할 수 있을까요?')).toBe('career');
      expect(classifyQuestion('새로운 직장은 어떨까요?')).toBe('career');
    });

    it('재정 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('돈을 벌 수 있을까요?')).toBe('money');
      expect(classifyQuestion('투자해도 될까요?')).toBe('money');
      expect(classifyQuestion('재정 상황이 나아질까요?')).toBe('money');
    });

    it('건강 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('건강이 회복될까요?')).toBe('health');
      expect(classifyQuestion('수술을 해야 할까요?')).toBe('health');
      expect(classifyQuestion('병원에 가봐야 할까요?')).toBe('health');
    });

    it('분류할 수 없는 질문은 general로 분류해야 함', () => {
      expect(classifyQuestion('오늘 날씨는 어떨까요?')).toBe('general');
      expect(classifyQuestion('무엇을 해야 할까요?')).toBe('general');
    });
  });

  describe('generateKeywordInsights', () => {
    it('카드가 없을 때 빈 배열을 반환해야 함', () => {
      expect(generateKeywordInsights([])).toEqual([]);
    });

    it('단일 카드의 키워드로 인사이트를 생성해야 함', () => {
      const cards: DrawnCard[] = [{
        id: 0,
        name: 'The Fool',
        suit: 'major',
        number: 0,
        upright_meaning: '새로운 시작',
        reversed_meaning: '무모함',
        keywords: ['시작', '모험', '순수'],
        current_meaning: '새로운 시작',
        current_keywords: ['시작', '모험', '순수'],
        current_interpretation: '새로운 여정이 시작됩니다',
        is_reversed: false,
        image_url: '/images/cards/major/00-fool.png',
      }];

      const insights = generateKeywordInsights(cards);
      expect(insights).toContain('시작의 에너지가 강하게 나타나고 있습니다');
    });

    it('여러 카드의 공통 키워드를 감지해야 함', () => {
      const cards: DrawnCard[] = [
        {
          id: 0,
          name: 'The Fool',
          suit: 'major',
          number: 0,
          upright_meaning: '새로운 시작',
          reversed_meaning: '무모함',
          keywords: ['시작', '모험', '순수'],
          current_meaning: '새로운 시작',
          current_keywords: ['시작', '모험'],
          current_interpretation: '새로운 여정',
          is_reversed: false,
          image_url: '/images/cards/major/00-fool.png',
        },
        {
          id: 1,
          name: 'The Magician',
          suit: 'major',
          number: 1,
          upright_meaning: '의지력',
          reversed_meaning: '조작',
          keywords: ['창조', '의지', '시작'],
          current_meaning: '의지력',
          current_keywords: ['창조', '시작'],
          current_interpretation: '창조의 힘',
          is_reversed: false,
          image_url: '/images/cards/major/01-magician.png',
        }
      ];

      const insights = generateKeywordInsights(cards);
      expect(insights.some(i => i.includes('시작'))).toBe(true);
    });
  });

  describe('generateOverallInterpretation', () => {
    const mockCard: DrawnCard = {
      id: 0,
      name: 'The Fool',
      suit: 'major',
      number: 0,
      upright_meaning: '새로운 시작, 순수함, 모험',
      reversed_meaning: '무모함, 위험, 어리석음',
      keywords: ['시작', '모험', '순수'],
      current_meaning: '새로운 시작',
      current_keywords: ['시작', '모험', '순수'],
      current_interpretation: '새로운 여정이 시작됩니다',
      is_reversed: false,
      image_url: '/images/cards/major/00-fool.png',
    };

    it('연애 질문에 대한 해석을 생성해야 함', () => {
      const interpretation = generateOverallInterpretation(
        '그 사람과 잘 될까요?',
        [mockCard],
        'love'
      );

      expect(interpretation).toContain('사랑');
      expect(interpretation.length).toBeGreaterThan(50);
    });

    it('직업 질문에 대한 해석을 생성해야 함', () => {
      const interpretation = generateOverallInterpretation(
        '이직해도 될까요?',
        [mockCard],
        'career'
      );

      expect(interpretation).toContain('직업');
      expect(interpretation.length).toBeGreaterThan(50);
    });

    it('역방향 카드를 올바르게 해석해야 함', () => {
      const reversedCard = { ...mockCard, is_reversed: true };
      const interpretation = generateOverallInterpretation(
        '조심해야 할 것이 있을까요?',
        [reversedCard],
        'general'
      );

      expect(interpretation).toBeTruthy();
      expect(interpretation.length).toBeGreaterThan(50);
    });
  });
});