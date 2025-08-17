// src/__tests__/api-readings.test.ts

/**
 * API 라우트 테스트
 * 주의: 이 테스트들은 실제 MongoDB와 Next.js API를 모킹합니다.
 */

import { DrawnCard } from '../types/tarot';

// MongoDB 및 모델 모킹
jest.mock('../lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

const mockFindAndSort = jest.fn();
const mockLimit = jest.fn();
const mockSkip = jest.fn();
const mockSave = jest.fn();
const mockInsertOne = jest.fn();

// Reading 모델 모킹
jest.mock('../models/Reading', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave,
  })),
  find: jest.fn(() => ({
    sort: mockFindAndSort.mockReturnValue({
      limit: mockLimit.mockReturnValue({
        skip: mockSkip.mockReturnValue([])
      })
    })
  })),
  countDocuments: jest.fn().mockResolvedValue(0),
  insertOne: mockInsertOne
}));

// Next.js cookies 모킹
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue({ value: 'test-session-id' }),
    set: jest.fn(),
  }),
}));

describe.skip('API 라우트 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 테스트용 카드 데이터
  const createTestCard = (): DrawnCard => ({
    id: 1,
    name: 'The Fool',
    suit: 'major',
    upright_meaning: 'New beginnings',
    upright_interpretation: 'A fresh start awaits',
    upright_keywords: ['new', 'beginning', 'journey'],
    reversed_meaning: 'Recklessness',
    reversed_interpretation: 'Avoid hasty decisions',
    reversed_keywords: ['reckless', 'naive'],
    has_reversal: true,
    image_url: '/images/cards/major/00-fool.webp',
    position: 'upright',
    is_reversed: false,
    current_meaning: 'New beginnings',
    current_interpretation: 'A fresh start awaits',
    current_keywords: ['new', 'beginning', 'journey']
  });

  describe('GET /api/readings', () => {
    test('성공적으로 리딩 목록을 반환해야 함', async () => {
      const mockReadings = [
        {
          _id: 'reading1',
          question: '오늘의 운세는?',
          spreadType: 'one-card',
          cards: [createTestCard()],
          interpretation: '좋은 하루가 될 것입니다.',
          questionType: 'general',
          userSession: 'test-session',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockSkip.mockResolvedValue(mockReadings);
      require('../models/Reading').default.countDocuments.mockResolvedValue(1);

      const request = new NextRequest('http://localhost:3000/api/readings');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.readings).toEqual(mockReadings);
      expect(data.total).toBe(1);
      expect(data.page).toBe(1);
      expect(data.limit).toBe(10);
    });

    test('페이지네이션이 올바르게 작동해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/readings?page=2&limit=5');
      await GET(request);

      expect(mockSkip).toHaveBeenCalledWith(5); // (page - 1) * limit = (2 - 1) * 5 = 5
      expect(mockLimit).toHaveBeenCalledWith(5);
    });

    test('질문 타입 필터가 올바르게 작동해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/readings?type=love');
      await GET(request);

      const ReadingModel = require('../models/Reading').default;
      expect(ReadingModel.find).toHaveBeenCalledWith({
        userSession: 'test-session-id',
        questionType: 'love'
      });
    });

    test('잘못된 페이지 번호에 대해 기본값을 사용해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/readings?page=invalid&limit=invalid');
      await GET(request);

      expect(mockLimit).toHaveBeenCalledWith(10); // 기본 limit
      expect(mockSkip).toHaveBeenCalledWith(0); // 기본 page (1-1)*10 = 0
    });

    test('데이터베이스 오류 시 500 에러를 반환해야 함', async () => {
      mockSkip.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/readings');
      const response = await GET(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to fetch readings');
    });
  });

  describe('POST /api/readings', () => {
    test('성공적으로 새 리딩을 저장해야 함', async () => {
      const mockSavedReading = {
        _id: 'new-reading-id',
        question: '새로운 질문',
        spreadType: 'three-card',
        cards: [createTestCard(), createTestCard(), createTestCard()],
        interpretation: '새로운 해석',
        questionType: 'love',
        userSession: 'test-session-id',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockSave.mockResolvedValue(mockSavedReading);

      const requestBody = {
        question: '새로운 질문',
        spreadType: 'three-card',
        cards: [createTestCard(), createTestCard(), createTestCard()],
        interpretation: '새로운 해석',
        questionType: 'love'
      };

      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.reading).toEqual(mockSavedReading);
    });

    test('필수 필드가 누락된 경우 400 에러를 반환해야 함', async () => {
      const incompleteBody = {
        question: '질문만 있는 요청',
        // spreadType, cards, interpretation, questionType 누락
      };

      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: JSON.stringify(incompleteBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing required fields');
    });

    test('잘못된 카드 개수에 대해 400 에러를 반환해야 함', async () => {
      const invalidCardsBody = {
        question: '잘못된 카드 개수',
        spreadType: 'one-card',
        cards: [], // 빈 배열
        interpretation: '해석',
        questionType: 'general'
      };

      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: JSON.stringify(invalidCardsBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid number of cards');
    });

    test('너무 많은 카드에 대해 400 에러를 반환해야 함', async () => {
      const tooManyCards = Array(11).fill(createTestCard()); // 10개 초과

      const invalidCardsBody = {
        question: '너무 많은 카드',
        spreadType: 'celtic-cross',
        cards: tooManyCards,
        interpretation: '해석',
        questionType: 'general'
      };

      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: JSON.stringify(invalidCardsBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid number of cards');
    });

    test('잘못된 JSON에 대해 적절히 처리해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('데이터베이스 저장 오류 시 500 에러를 반환해야 함', async () => {
      mockSave.mockRejectedValue(new Error('Database save error'));

      const validBody = {
        question: '유효한 질문',
        spreadType: 'one-card',
        cards: [createTestCard()],
        interpretation: '유효한 해석',
        questionType: 'general'
      };

      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: JSON.stringify(validBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to save reading');
    });

    test('사용자 세션이 올바르게 설정되어야 함', async () => {
      const mockSavedReading = {
        _id: 'session-test-id',
        userSession: 'test-session-id'
      };

      mockSave.mockResolvedValue(mockSavedReading);

      const requestBody = {
        question: '세션 테스트',
        spreadType: 'one-card',
        cards: [createTestCard()],
        interpretation: '세션 테스트 해석',
        questionType: 'general'
      };

      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      await POST(request);

      // Reading 모델이 올바른 세션 ID로 생성되었는지 확인
      const ReadingModel = require('../models/Reading').default;
      expect(ReadingModel).toHaveBeenCalledWith(
        expect.objectContaining({
          userSession: 'test-session-id'
        })
      );
    });
  });

  describe('에러 처리 및 엣지 케이스', () => {
    test('Content-Type이 application/json이 아닌 POST 요청을 처리해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/readings', {
        method: 'POST',
        body: JSON.stringify({
          question: '테스트',
          spreadType: 'one-card',
          cards: [createTestCard()],
          interpretation: '테스트 해석',
          questionType: 'general'
        }),
        headers: {
          'Content-Type': 'text/plain', // 잘못된 Content-Type
        },
      });

      const response = await POST(request);
      
      // JSON 파싱 오류로 인한 500 에러 또는 적절한 처리
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('매우 큰 페이지 번호에 대해 적절히 처리해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/readings?page=999999&limit=1');
      const response = await GET(request);

      expect(response.status).toBe(200);
      // 빈 결과 또는 적절한 처리
    });

    test('음수 페이지 번호에 대해 기본값을 사용해야 함', async () => {
      const request = new NextRequest('http://localhost:3000/api/readings?page=-1&limit=10');
      await GET(request);

      expect(mockSkip).toHaveBeenCalledWith(0); // 기본 페이지 1로 처리 (1-1)*10 = 0
    });
  });
});