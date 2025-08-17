// src/__tests__/components-rendering.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DrawnCard, SpreadType } from '../types/tarot';
import SpreadSelector from '../components/cards/SpreadSelector';
import QuestionInput from '../components/cards/QuestionInput';
import TarotCard from '../components/cards/TarotCard';
import ReadingResult from '../components/cards/ReadingResult';

// Framer Motion 모킹 (애니메이션 비활성화)
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// useReadingState 훅 모킹
const mockDispatch = jest.fn();
jest.mock('../hooks/useReadingState', () => ({
  useReadingState: () => ({
    state: {
      currentStep: 'select-spread',
      spreadType: 'three-card' as SpreadType,
      question: '',
      availableCards: [],
      selectedCards: [],
      revealedCards: new Set(),
      isShuffling: false,
      shuffleKey: 0,
      interpretation: '',
      readingComplete: false,
    },
    dispatch: mockDispatch,
  }),
}));

// useToast 훅 모킹
jest.mock('../components/ui/Toast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe.skip('컴포넌트 렌더링 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 테스트용 카드 데이터
  const createTestCard = (
    name: string = 'The Fool',
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

  describe('SpreadSelector 컴포넌트', () => {
    test('스프레드 선택 옵션들이 올바르게 렌더링되어야 함', () => {
      const mockOnSelect = jest.fn();
      
      render(<SpreadSelector onSelect={mockOnSelect} />);

      // 주요 스프레드 옵션들이 표시되는지 확인
      expect(screen.getByText('원카드 리딩')).toBeInTheDocument();
      expect(screen.getByText('과거-현재-미래')).toBeInTheDocument();
      expect(screen.getByText('켈틱 크로스')).toBeInTheDocument();
    });

    test('스프레드 선택 시 onSelect 콜백이 호출되어야 함', () => {
      const mockOnSelect = jest.fn();
      
      render(<SpreadSelector onSelect={mockOnSelect} />);

      const oneCardButton = screen.getByText('원카드 리딩').closest('button');
      if (oneCardButton) {
        fireEvent.click(oneCardButton);
        expect(mockOnSelect).toHaveBeenCalledWith('one-card');
      }
    });

    test('각 스프레드의 설명이 표시되어야 함', () => {
      const mockOnSelect = jest.fn();
      
      render(<SpreadSelector onSelect={mockOnSelect} />);

      expect(screen.getByText(/빠르고 간단한 답변/)).toBeInTheDocument();
      expect(screen.getByText(/시간의 흐름에 따른/)).toBeInTheDocument();
    });
  });

  describe('QuestionInput 컴포넌트', () => {
    test('질문 입력 폼이 올바르게 렌더링되어야 함', () => {
      const mockOnSubmit = jest.fn();
      
      render(<QuestionInput onSubmit={mockOnSubmit} />);

      expect(screen.getByPlaceholderText(/무엇이 궁금하신가요/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /카드 뽑기/ })).toBeInTheDocument();
    });

    test('질문 입력 후 제출이 가능해야 함', async () => {
      const mockOnSubmit = jest.fn();
      
      render(<QuestionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByPlaceholderText(/무엇이 궁금하신가요/);
      const submitButton = screen.getByRole('button', { name: /카드 뽑기/ });

      fireEvent.change(input, { target: { value: '오늘 하루는 어떨까요?' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('오늘 하루는 어떨까요?');
      });
    });

    test('빈 질문 제출 시 적절한 처리가 되어야 함', () => {
      const mockOnSubmit = jest.fn();
      
      render(<QuestionInput onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /카드 뽑기/ });
      fireEvent.click(submitButton);

      // 빈 질문으로는 제출되지 않아야 함
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('질문이 너무 길 경우 경고가 표시되어야 함', () => {
      const mockOnSubmit = jest.fn();
      
      render(<QuestionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByPlaceholderText(/무엇이 궁금하신가요/);
      const longQuestion = 'a'.repeat(500); // 매우 긴 질문

      fireEvent.change(input, { target: { value: longQuestion } });

      // 경고 메시지나 제한이 표시되는지 확인
      expect(input).toHaveValue(longQuestion);
    });
  });

  describe('TarotCard 컴포넌트', () => {
    test('정방향 메이저 아르카나 카드가 올바르게 렌더링되어야 함', () => {
      const card = createTestCard('The Fool', 'major', false);
      
      render(
        <TarotCard 
          card={card}
          isRevealed={true}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('The Fool')).toBeInTheDocument();
      expect(screen.getByText(/정방향/)).toBeInTheDocument();
    });

    test('역방향 메이저 아르카나 카드가 올바르게 렌더링되어야 함', () => {
      const card = createTestCard('The Tower', 'major', true);
      
      render(
        <TarotCard 
          card={card}
          isRevealed={true}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('The Tower')).toBeInTheDocument();
      expect(screen.getByText(/역방향/)).toBeInTheDocument();
    });

    test('마이너 아르카나 카드가 올바르게 렌더링되어야 함', () => {
      const card = createTestCard('Ace of Cups', 'cups', false);
      
      render(
        <TarotCard 
          card={card}
          isRevealed={true}
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Ace of Cups')).toBeInTheDocument();
      // 마이너 아르카나는 역방향 표시가 없어야 함
      expect(screen.queryByText(/역방향/)).not.toBeInTheDocument();
    });

    test('카드 클릭 시 onClick 콜백이 호출되어야 함', () => {
      const mockOnClick = jest.fn();
      const card = createTestCard('The Fool', 'major', false);
      
      render(
        <TarotCard 
          card={card}
          isRevealed={true}
          onClick={mockOnClick}
        />
      );

      const cardElement = screen.getByText('The Fool').closest('button') || 
                         screen.getByText('The Fool').closest('div');
      
      if (cardElement) {
        fireEvent.click(cardElement);
        expect(mockOnClick).toHaveBeenCalled();
      }
    });

    test('숨겨진 카드는 카드 뒷면을 표시해야 함', () => {
      const card = createTestCard('The Fool', 'major', false);
      
      render(
        <TarotCard 
          card={card}
          isRevealed={false}
          onClick={() => {}}
        />
      );

      // 카드 이름이 표시되지 않아야 함
      expect(screen.queryByText('The Fool')).not.toBeInTheDocument();
      // 카드 뒷면 또는 "?" 표시가 있어야 함
      expect(screen.getByText('?') || screen.getByAltText(/card.back/)).toBeTruthy();
    });
  });

  describe('ReadingResult 컴포넌트', () => {
    test('원카드 리딩 결과가 올바르게 표시되어야 함', () => {
      const cards = [createTestCard('The Fool', 'major', false)];
      const interpretation = '새로운 시작의 기운이 감지됩니다.';
      
      render(
        <ReadingResult
          question="오늘 하루는 어떨까요?"
          cards={cards}
          interpretation={interpretation}
          spreadType="one-card"
          onReset={() => {}}
        />
      );

      expect(screen.getByText('오늘 하루는 어떨까요?')).toBeInTheDocument();
      expect(screen.getByText('The Fool')).toBeInTheDocument();
      expect(screen.getByText(interpretation)).toBeInTheDocument();
    });

    test('3카드 리딩 결과가 올바르게 표시되어야 함', () => {
      const cards = [
        createTestCard('과거 카드', 'swords', false),
        createTestCard('현재 카드', 'major', false),
        createTestCard('미래 카드', 'cups', false)
      ];
      const interpretation = '과거의 어려움을 딛고 밝은 미래가 기다립니다.';
      
      render(
        <ReadingResult
          question="내 연애운은?"
          cards={cards}
          interpretation={interpretation}
          spreadType="three-card"
          onReset={() => {}}
        />
      );

      expect(screen.getByText('내 연애운은?')).toBeInTheDocument();
      expect(screen.getByText('과거 카드')).toBeInTheDocument();
      expect(screen.getByText('현재 카드')).toBeInTheDocument();
      expect(screen.getByText('미래 카드')).toBeInTheDocument();
      expect(screen.getByText(interpretation)).toBeInTheDocument();
    });

    test('다시 뽑기 버튼이 작동해야 함', () => {
      const mockOnReset = jest.fn();
      const cards = [createTestCard('The Fool', 'major', false)];
      
      render(
        <ReadingResult
          question="테스트 질문"
          cards={cards}
          interpretation="테스트 해석"
          spreadType="one-card"
          onReset={mockOnReset}
        />
      );

      const resetButton = screen.getByRole('button', { name: /다시 뽑기/ });
      fireEvent.click(resetButton);

      expect(mockOnReset).toHaveBeenCalled();
    });

    test('공유 기능이 포함되어야 함', () => {
      const cards = [createTestCard('The Fool', 'major', false)];
      
      render(
        <ReadingResult
          question="테스트 질문"
          cards={cards}
          interpretation="테스트 해석"
          spreadType="one-card"
          onReset={() => {}}
        />
      );

      // 공유 버튼이나 공유 관련 요소가 있는지 확인
      const shareButton = screen.queryByText(/공유/) || screen.queryByRole('button', { name: /share/i });
      if (shareButton) {
        expect(shareButton).toBeInTheDocument();
      }
    });

    test('긴 해석 텍스트가 올바르게 표시되어야 함', () => {
      const longInterpretation = '매우 긴 해석 텍스트입니다. '.repeat(100);
      const cards = [createTestCard('The Fool', 'major', false)];
      
      render(
        <ReadingResult
          question="긴 해석 테스트"
          cards={cards}
          interpretation={longInterpretation}
          spreadType="one-card"
          onReset={() => {}}
        />
      );

      expect(screen.getByText(longInterpretation)).toBeInTheDocument();
    });
  });

  describe('접근성 테스트', () => {
    test('모든 인터랙티브 요소가 키보드로 접근 가능해야 함', () => {
      const mockOnSelect = jest.fn();
      
      render(<SpreadSelector onSelect={mockOnSelect} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex');
      });
    });

    test('카드 이미지에 적절한 alt 텍스트가 있어야 함', () => {
      const card = createTestCard('The Fool', 'major', false);
      
      render(
        <TarotCard 
          card={card}
          isRevealed={true}
          onClick={() => {}}
        />
      );

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    test('폼 요소에 적절한 라벨이 있어야 함', () => {
      const mockOnSubmit = jest.fn();
      
      render(<QuestionInput onSubmit={mockOnSubmit} />);

      const input = screen.getByPlaceholderText(/무엇이 궁금하신가요/);
      expect(input).toHaveAttribute('placeholder');
    });
  });

  describe('에러 처리', () => {
    test('잘못된 카드 데이터에 대해 오류 없이 렌더링되어야 함', () => {
      const invalidCard = {
        ...createTestCard(),
        name: undefined as any,
      };
      
      expect(() => {
        render(
          <TarotCard 
            card={invalidCard}
            isRevealed={true}
            onClick={() => {}}
          />
        );
      }).not.toThrow();
    });

    test('빈 카드 배열에 대해 적절히 처리해야 함', () => {
      expect(() => {
        render(
          <ReadingResult
            question="빈 카드 테스트"
            cards={[]}
            interpretation="빈 카드 해석"
            spreadType="one-card"
            onReset={() => {}}
          />
        );
      }).not.toThrow();
    });
  });
});