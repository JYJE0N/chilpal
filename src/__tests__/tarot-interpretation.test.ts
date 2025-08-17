// src/__tests__/tarot-interpretation.test.ts

import { classifyQuestion, analyzeCardCombination } from '../lib/tarot-interpretation';
import { DrawnCard } from '../types/tarot';

describe('타로 해석 로직', () => {
  describe('질문 분류 (classifyQuestion)', () => {
    test('연애 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('오늘 사랑운은 어떨까요?')).toBe('love');
      expect(classifyQuestion('연애가 잘 될까요?')).toBe('love');
      expect(classifyQuestion('결혼할 수 있을까요?')).toBe('love');
      expect(classifyQuestion('이성과의 만남은?')).toBe('love');
    });

    test('직업 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('직장에서 승진할 수 있을까요?')).toBe('career');
      expect(classifyQuestion('일이 잘 풀릴까요?')).toBe('career');
      expect(classifyQuestion('회사 분위기는?')).toBe('career');
    });

    test('재정 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('돈을 벌 수 있을까요?')).toBe('money');
      expect(classifyQuestion('재물운은 어떨까요?')).toBe('money');
      expect(classifyQuestion('투자해도 될까요?')).toBe('money');
      expect(classifyQuestion('사업이 잘 될까요?')).toBe('money');
    });

    test('건강 관련 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('건강은 어떨까요?')).toBe('health');
      expect(classifyQuestion('몸 상태는?')).toBe('health');
      expect(classifyQuestion('병이 나을까요?')).toBe('health');
    });

    test('일반적인 질문을 올바르게 분류해야 함', () => {
      expect(classifyQuestion('오늘 하루는 어떨까요?')).toBe('general');
      expect(classifyQuestion('운세를 봐주세요')).toBe('general');
      expect(classifyQuestion('앞으로는?')).toBe('general');
    });

    test('대소문자를 구분하지 않아야 함', () => {
      expect(classifyQuestion('사랑')).toBe('love');
      expect(classifyQuestion('LOVE는 어떨까요?')).toBe('general'); // 한국어 키워드만 인식
      expect(classifyQuestion('직장 LIFE')).toBe('career');
    });
  });

  describe('카드 조합 분석 (analyzeCardCombination)', () => {
    // 테스트용 카드 생성 헬퍼
    const createMockCard = (suit: string, isReversed: boolean = false): DrawnCard => ({
      id: Math.random(),
      name: 'Test Card',
      suit: suit as any,
      upright_meaning: 'Test meaning',
      upright_interpretation: 'Test interpretation',
      upright_keywords: ['test'],
      has_reversal: suit === 'major',
      image_url: '/test.jpg',
      position: isReversed ? 'reversed' : 'upright',
      is_reversed: isReversed,
      current_meaning: 'Current meaning',
      current_interpretation: 'Current interpretation',
      current_keywords: ['current']
    });

    test('3장 메이저 아르카나 조합을 올바르게 분석해야 함', () => {
      const cards = [
        createMockCard('major'),
        createMockCard('major'),
        createMockCard('major')
      ];

      const result = analyzeCardCombination(cards);
      expect(result).toContain('세 장 모두 메이저 아르카나');
      expect(result).toContain('운명적이고 중요한 전환점');
    });

    test('2장 메이저 아르카나 조합을 올바르게 분석해야 함', () => {
      const cards = [
        createMockCard('major'),
        createMockCard('major'),
        createMockCard('cups')
      ];

      const result = analyzeCardCombination(cards);
      expect(result).toContain('두 장의 메이저 아르카나');
      expect(result).toContain('강력한 변화의 에너지');
    });

    test('1장 메이저 아르카나 조합을 올바르게 분석해야 함', () => {
      const cards = [
        createMockCard('major'),
        createMockCard('cups'),
        createMockCard('swords')
      ];

      const result = analyzeCardCombination(cards);
      expect(result).toContain('하나의 메이저 아르카나');
      expect(result).toContain('핵심 메시지');
    });

    test('마이너 아르카나만 있는 조합을 올바르게 분석해야 함', () => {
      const cards = [
        createMockCard('cups'),
        createMockCard('swords'),
        createMockCard('wands')
      ];

      const result = analyzeCardCombination(cards);
      expect(result).toContain('마이너 아르카나들');
      expect(result).toContain('일상적이지만 중요한 변화');
    });

    test('역방향 카드가 모두 3장인 경우를 올바르게 분석해야 함', () => {
      const cards = [
        createMockCard('major', true),
        createMockCard('major', true),
        createMockCard('major', true)
      ];

      const result = analyzeCardCombination(cards);
      expect(result).toContain('모든 카드가 역방향');
      expect(result).toContain('내면의 성찰과 기다림');
    });

    test('역방향 카드가 2장인 경우를 올바르게 분석해야 함', () => {
      const cards = [
        createMockCard('major', true),
        createMockCard('major', true),
        createMockCard('cups', false)
      ];

      const result = analyzeCardCombination(cards);
      expect(result).toContain('두 카드의 역방향');
      expect(result).toContain('장애물이 있지만 극복 가능');
    });

    test('빈 배열에 대해 올바르게 처리해야 함', () => {
      const cards: DrawnCard[] = [];
      const result = analyzeCardCombination(cards);
      expect(result).toContain('마이너 아르카나들');
    });

    test('1장 카드에 대해 올바르게 처리해야 함', () => {
      const cards = [createMockCard('major')];
      const result = analyzeCardCombination(cards);
      expect(result).toContain('하나의 메이저 아르카나');
    });
  });

  describe('통합 테스트', () => {
    test('연애 질문과 메이저 아르카나 조합이 적절히 매칭되어야 함', () => {
      const question = '사랑이 이루어질까요?';
      const questionType = classifyQuestion(question);
      
      const cards = [
        createMockCard('major'),
        createMockCard('major'),
        createMockCard('cups')
      ];
      
      const cardAnalysis = analyzeCardCombination(cards);
      
      expect(questionType).toBe('love');
      expect(cardAnalysis).toContain('두 장의 메이저 아르카나');
    });

    test('직업 질문과 마이너 아르카나 조합이 적절히 매칭되어야 함', () => {
      const question = '직장에서의 성과는?';
      const questionType = classifyQuestion(question);
      
      const cards = [
        createMockCard('pentacles'),
        createMockCard('wands'),
        createMockCard('swords')
      ];
      
      const cardAnalysis = analyzeCardCombination(cards);
      
      expect(questionType).toBe('career');
      expect(cardAnalysis).toContain('마이너 아르카나들');
    });
  });

  // 테스트용 카드 생성 헬퍼를 외부에서 사용할 수 있도록
  const createMockCard = (suit: string, isReversed: boolean = false): DrawnCard => ({
    id: Math.random(),
    name: 'Test Card',
    suit: suit as any,
    upright_meaning: 'Test meaning',
    upright_interpretation: 'Test interpretation',
    upright_keywords: ['test'],
    has_reversal: suit === 'major',
    image_url: '/test.jpg',
    position: isReversed ? 'reversed' : 'upright',
    is_reversed: isReversed,
    current_meaning: 'Current meaning',
    current_interpretation: 'Current interpretation',
    current_keywords: ['current']
  });
});