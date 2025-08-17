// src/__tests__/spread-interpretation.test.ts

import { generateSpreadInterpretation } from '../lib/spread-interpretation';
import { DrawnCard, SpreadType } from '../types/tarot';

describe('스프레드 해석 로직', () => {
  // 테스트용 카드 생성 헬퍼
  const createMockCard = (
    name: string = 'Test Card',
    suit: string = 'major',
    isReversed: boolean = false
  ): DrawnCard => ({
    id: Math.random(),
    name,
    suit: suit as any,
    upright_meaning: 'Test upright meaning',
    upright_interpretation: 'Test upright interpretation',
    upright_keywords: ['test', 'keyword'],
    reversed_meaning: suit === 'major' ? 'Test reversed meaning' : undefined,
    reversed_interpretation: suit === 'major' ? 'Test reversed interpretation' : undefined,
    reversed_keywords: suit === 'major' ? ['reversed', 'test'] : undefined,
    has_reversal: suit === 'major',
    image_url: '/test.jpg',
    position: isReversed ? 'reversed' : 'upright',
    is_reversed: isReversed,
    current_meaning: isReversed && suit === 'major' ? 'Test reversed meaning' : 'Test upright meaning',
    current_interpretation: isReversed && suit === 'major' ? 'Test reversed interpretation' : 'Test upright interpretation',
    current_keywords: isReversed && suit === 'major' ? ['reversed', 'test'] : ['test', 'keyword']
  });

  describe('빈 카드 배열 처리', () => {
    test('빈 카드 배열에 대해 적절한 메시지를 반환해야 함', () => {
      const result = generateSpreadInterpretation(
        'three-card',
        [],
        '오늘 하루는 어떨까요?',
        'general'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('오늘 하루는 어떨까요?');
      expect(result).toContain('카드를 선택해주세요');
    });

    test('undefined 카드 배열에 대해 적절히 처리해야 함', () => {
      const result = generateSpreadInterpretation(
        'one-card',
        null as any,
        '테스트 질문',
        'general'
      );

      expect(result).toContain('카드를 선택해주세요');
    });
  });

  describe('원카드 해석', () => {
    test('정방향 메이저 아르카나 원카드 해석이 올바르게 생성되어야 함', () => {
      const cards = [createMockCard('The Fool', 'major', false)];
      
      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        '오늘의 운세는?',
        'general'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('오늘의 운세는?');
      expect(result).toContain('The Fool');
      expect(result).toContain('정방향');
    });

    test('역방향 메이저 아르카나 원카드 해석이 올바르게 생성되어야 함', () => {
      const cards = [createMockCard('The Tower', 'major', true)];
      
      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        '변화의 시기일까요?',
        'general'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('변화의 시기일까요?');
      expect(result).toContain('The Tower');
      expect(result).toContain('역방향');
    });

    test('마이너 아르카나 원카드 해석이 올바르게 생성되어야 함', () => {
      const cards = [createMockCard('Ace of Cups', 'cups', false)];
      
      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        '사랑운은?',
        'love'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('사랑운은?');
      expect(result).toContain('Ace of Cups');
    });
  });

  describe('3카드 스프레드 해석', () => {
    test('과거-현재-미래 스프레드 해석이 올바르게 생성되어야 함', () => {
      const cards = [
        createMockCard('과거 카드', 'swords'),
        createMockCard('현재 카드', 'major'),
        createMockCard('미래 카드', 'cups')
      ];

      const result = generateSpreadInterpretation(
        'three-card',
        cards,
        '앞으로의 연애운은?',
        'love'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('앞으로의 연애운은?');
      expect(result).toContain('📍 과거');
      expect(result).toContain('📍 현재');
      expect(result).toContain('📍 미래');
      expect(result).toContain('과거 카드');
      expect(result).toContain('현재 카드');
      expect(result).toContain('미래 카드');
    });

    test('3카드 중 역방향 카드가 포함된 경우를 올바르게 처리해야 함', () => {
      const cards = [
        createMockCard('과거', 'major', false),
        createMockCard('현재', 'major', true), // 역방향
        createMockCard('미래', 'major', false)
      ];

      const result = generateSpreadInterpretation(
        'three-card',
        cards,
        '직업 전망은?',
        'career'
      );

      expect(result).toContain('역방향');
      expect(result).toContain('현재');
    });

    test('부족한 카드 수에 대해 적절히 처리해야 함', () => {
      const cards = [createMockCard('단일 카드', 'major')];

      const result = generateSpreadInterpretation(
        'three-card',
        cards,
        '테스트 질문',
        'general'
      );

      // 에러가 발생하지 않고 적절한 해석이 생성되어야 함
      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('테스트 질문');
    });
  });

  describe('스프레드 타입별 특화 해석', () => {
    test('연애 스프레드가 올바르게 생성되어야 함', () => {
      const cards = Array(5).fill(null).map((_, i) => 
        createMockCard(`연애카드${i + 1}`, 'cups')
      );

      const result = generateSpreadInterpretation(
        'love-spread',
        cards,
        '이 사람과 사귈 수 있을까요?',
        'love'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('이 사람과 사귈 수 있을까요?');
    });

    test('관계 스프레드가 올바르게 생성되어야 함', () => {
      const cards = Array(6).fill(null).map((_, i) => 
        createMockCard(`관계카드${i + 1}`, 'major')
      );

      const result = generateSpreadInterpretation(
        'relationship',
        cards,
        '친구와의 관계는?',
        'general'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('친구와의 관계는?');
    });

    test('커리어 스프레드가 올바르게 생성되어야 함', () => {
      const cards = Array(5).fill(null).map((_, i) => 
        createMockCard(`커리어카드${i + 1}`, 'pentacles')
      );

      const result = generateSpreadInterpretation(
        'career-path',
        cards,
        '이직해도 될까요?',
        'career'
      );

      expect(result).toContain('리딩');
      expect(result).toContain('이직해도 될까요?');
    });

    test('Yes/No 스프레드가 올바르게 생성되어야 함', () => {
      const cards = Array(4).fill(null).map((_, i) => 
        createMockCard(`결정카드${i + 1}`, 'wands')
      );

      const result = generateSpreadInterpretation(
        'yes-no',
        cards,
        '이 결정을 내려도 될까요?',
        'general'
      );

      expect(result).toContain('리딩');
      expect(result).toContain('이 결정을 내려도 될까요?');
    });

    test('켈틱 크로스 스프레드가 올바르게 생성되어야 함', () => {
      const cards = Array(10).fill(null).map((_, i) => 
        createMockCard(`켈틱카드${i + 1}`, i % 2 === 0 ? 'major' : 'cups')
      );

      const result = generateSpreadInterpretation(
        'celtic-cross',
        cards,
        '인생의 방향은?',
        'general'
      );

      expect(result).toContain('리딩');
      expect(result).toContain('인생의 방향은?');
    });
  });

  describe('질문 타입별 맞춤 해석', () => {
    test('연애 질문에 대한 맞춤 해석이 포함되어야 함', () => {
      const cards = [createMockCard('연애카드', 'cups')];

      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        '사랑을 만날 수 있을까요?',
        'love'
      );

      expect(result).toContain('사랑을 만날 수 있을까요?');
    });

    test('직업 질문에 대한 맞춤 해석이 포함되어야 함', () => {
      const cards = [createMockCard('직업카드', 'pentacles')];

      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        '승진할 수 있을까요?',
        'career'
      );

      expect(result).toContain('승진할 수 있을까요?');
    });

    test('재정 질문에 대한 맞춤 해석이 포함되어야 함', () => {
      const cards = [createMockCard('재정카드', 'pentacles')];

      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        '투자해도 될까요?',
        'money'
      );

      expect(result).toContain('투자해도 될까요?');
    });
  });

  describe('에러 처리', () => {
    test('알 수 없는 스프레드 타입에 대해 기본 해석을 제공해야 함', () => {
      const cards = [createMockCard('기본카드', 'major')];

      const result = generateSpreadInterpretation(
        'unknown-spread' as SpreadType,
        cards,
        '테스트 질문',
        'general'
      );

      expect(result).toContain('🔮 타로 리딩');
      expect(result).toContain('테스트 질문');
    });

    test('매우 긴 질문도 올바르게 처리해야 함', () => {
      const longQuestion = '매우 긴 질문입니다. '.repeat(50);
      const cards = [createMockCard('테스트카드', 'major')];

      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        longQuestion,
        'general'
      );

      expect(result).toContain('리딩');
      expect(result).toContain(longQuestion);
    });

    test('특수 문자가 포함된 질문도 올바르게 처리해야 함', () => {
      const specialQuestion = '사랑💕은 어떨까요? #타로 @운세';
      const cards = [createMockCard('특수카드', 'cups')];

      const result = generateSpreadInterpretation(
        'one-card',
        cards,
        specialQuestion,
        'love'
      );

      expect(result).toContain('리딩');
      expect(result).toContain(specialQuestion);
    });
  });
});