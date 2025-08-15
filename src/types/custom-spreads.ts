// 커스텀 스프레드 타입 정의
import { SpreadType, SpreadDefinition, CardPosition } from './spreads';

// 확장된 스프레드 타입
export type CustomSpreadType = SpreadType | string;

// 커스텀 스프레드 정의
export interface CustomSpread extends Omit<SpreadDefinition, 'id'> {
  id: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  likes: number;
  usage: number;
  
  // 스프레드 레이아웃 정보
  layout: {
    type: 'grid' | 'circular' | 'cross' | 'custom';
    columns?: number;
    rows?: number;
    customPositions?: CardPosition[];
  };
  
  // 해석 규칙
  interpretationRules?: {
    relationships?: Array<{
      cards: number[];
      description: string;
    }>;
    specialCombinations?: Array<{
      condition: string;
      message: string;
    }>;
  };
}

// 스프레드 빌더 클래스
export class SpreadBuilder {
  private spread: Partial<CustomSpread> = {
    positions: [],
    category: 'intermediate',
    estimatedTime: '10분',
    recommendedFor: [],
    tags: [],
    difficulty: 3,
    likes: 0,
    usage: 0,
    isPublic: false,
    layout: {
      type: 'custom',
      customPositions: [],
    },
  };

  constructor(id: string, name: string) {
    this.spread.id = id;
    this.spread.name = name;
    this.spread.createdAt = new Date();
    this.spread.updatedAt = new Date();
  }

  setDescription(description: string): this {
    this.spread.description = description;
    return this;
  }

  setAuthor(author: string): this {
    this.spread.author = author;
    return this;
  }

  setCategory(category: 'simple' | 'intermediate' | 'advanced'): this {
    this.spread.category = category;
    return this;
  }

  setEstimatedTime(time: string): this {
    this.spread.estimatedTime = time;
    return this;
  }

  setDifficulty(difficulty: 1 | 2 | 3 | 4 | 5): this {
    this.spread.difficulty = difficulty;
    return this;
  }

  addPosition(position: CardPosition): this {
    if (!this.spread.positions) {
      this.spread.positions = [];
    }
    this.spread.positions.push(position);
    this.spread.cardCount = this.spread.positions.length;
    return this;
  }

  addTag(tag: string): this {
    if (!this.spread.tags) {
      this.spread.tags = [];
    }
    this.spread.tags.push(tag);
    return this;
  }

  addRecommendation(recommendation: string): this {
    if (!this.spread.recommendedFor) {
      this.spread.recommendedFor = [];
    }
    this.spread.recommendedFor.push(recommendation);
    return this;
  }

  setLayout(type: 'grid' | 'circular' | 'cross' | 'custom', options?: any): this {
    if (!this.spread.layout) {
      this.spread.layout = { type };
    }
    this.spread.layout.type = type;
    
    if (type === 'grid' && options) {
      this.spread.layout.columns = options.columns;
      this.spread.layout.rows = options.rows;
    }
    
    return this;
  }

  setPublic(isPublic: boolean): this {
    this.spread.isPublic = isPublic;
    return this;
  }

  build(): CustomSpread {
    if (!this.spread.id || !this.spread.name || !this.spread.description) {
      throw new Error('스프레드는 id, name, description이 필수입니다.');
    }
    
    if (!this.spread.positions || this.spread.positions.length === 0) {
      throw new Error('스프레드는 최소 1개 이상의 카드 위치가 필요합니다.');
    }
    
    return this.spread as CustomSpread;
  }
}

// 프리셋 커스텀 스프레드
export const customSpreadPresets: CustomSpread[] = [
  new SpreadBuilder('chakra-spread', '차크라 스프레드')
    .setDescription('7개 차크라의 에너지 상태를 확인하는 스프레드')
    .setCategory('advanced')
    .setEstimatedTime('15-20분')
    .setDifficulty(4)
    .addPosition({ id: 1, name: '루트 차크라', description: '생존과 안정성', x: 50, y: 85 })
    .addPosition({ id: 2, name: '천골 차크라', description: '창조성과 감정', x: 50, y: 75 })
    .addPosition({ id: 3, name: '태양신경총', description: '개인의 힘과 의지', x: 50, y: 65 })
    .addPosition({ id: 4, name: '심장 차크라', description: '사랑과 연민', x: 50, y: 55 })
    .addPosition({ id: 5, name: '목 차크라', description: '의사소통과 진실', x: 50, y: 45 })
    .addPosition({ id: 6, name: '제3의 눈', description: '직관과 통찰', x: 50, y: 35 })
    .addPosition({ id: 7, name: '크라운 차크라', description: '영적 연결', x: 50, y: 25 })
    .addTag('차크라')
    .addTag('에너지')
    .addTag('영성')
    .addRecommendation('에너지 밸런스 확인')
    .addRecommendation('차크라 정렬')
    .addRecommendation('영적 성장')
    .setLayout('custom')
    .setPublic(true)
    .build(),

  new SpreadBuilder('moon-phase', '달의 위상 스프레드')
    .setDescription('달의 8가지 위상을 통해 현재 주기를 이해하는 스프레드')
    .setCategory('intermediate')
    .setEstimatedTime('12-15분')
    .setDifficulty(3)
    .addPosition({ id: 1, name: '신월', description: '새로운 시작', x: 50, y: 20 })
    .addPosition({ id: 2, name: '초승달', description: '의도 설정', x: 70, y: 30 })
    .addPosition({ id: 3, name: '상현달', description: '도전과 결정', x: 80, y: 50 })
    .addPosition({ id: 4, name: '보름달', description: '완성과 해방', x: 70, y: 70 })
    .addPosition({ id: 5, name: '하현달', description: '감사와 공유', x: 50, y: 80 })
    .addPosition({ id: 6, name: '그믐달', description: '해방과 용서', x: 30, y: 70 })
    .addPosition({ id: 7, name: '발사믹 문', description: '휴식과 성찰', x: 20, y: 50 })
    .addPosition({ id: 8, name: '다크문', description: '내면의 지혜', x: 30, y: 30 })
    .addTag('달')
    .addTag('주기')
    .addTag('타이밍')
    .addRecommendation('현재 에너지 주기 파악')
    .addRecommendation('타이밍 결정')
    .setLayout('circular')
    .setPublic(true)
    .build(),

  new SpreadBuilder('elemental-cross', '원소 십자가')
    .setDescription('4원소의 균형과 중심을 확인하는 스프레드')
    .setCategory('simple')
    .setEstimatedTime('7-10분')
    .setDifficulty(2)
    .addPosition({ id: 1, name: '불 (열정)', description: '당신의 열정과 동기', x: 50, y: 20 })
    .addPosition({ id: 2, name: '물 (감정)', description: '감정적 상태', x: 80, y: 50 })
    .addPosition({ id: 3, name: '공기 (사고)', description: '정신적 명료함', x: 50, y: 80 })
    .addPosition({ id: 4, name: '흙 (물질)', description: '현실적 기반', x: 20, y: 50 })
    .addPosition({ id: 5, name: '정수 (중심)', description: '모든 원소의 통합', x: 50, y: 50 })
    .addTag('원소')
    .addTag('균형')
    .addTag('기초')
    .addRecommendation('에너지 균형 확인')
    .addRecommendation('원소별 상태 파악')
    .setLayout('cross')
    .setPublic(true)
    .build(),
];

// 스프레드 검증 함수
export function validateCustomSpread(spread: Partial<CustomSpread>): string[] {
  const errors: string[] = [];
  
  if (!spread.name || spread.name.length < 2) {
    errors.push('스프레드 이름은 2자 이상이어야 합니다.');
  }
  
  if (!spread.description || spread.description.length < 10) {
    errors.push('스프레드 설명은 10자 이상이어야 합니다.');
  }
  
  if (!spread.positions || spread.positions.length < 1) {
    errors.push('최소 1개 이상의 카드 위치가 필요합니다.');
  }
  
  if (spread.positions && spread.positions.length > 15) {
    errors.push('카드는 최대 15장까지 가능합니다.');
  }
  
  // 위치 중복 확인
  if (spread.positions) {
    const ids = spread.positions.map(p => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      errors.push('카드 위치 ID가 중복되었습니다.');
    }
  }
  
  return errors;
}

// 스프레드 저장/불러오기 (로컬스토리지)
export class SpreadStorage {
  private static STORAGE_KEY = 'custom_spreads';
  
  static save(spread: CustomSpread): void {
    const spreads = this.getAll();
    const index = spreads.findIndex(s => s.id === spread.id);
    
    if (index >= 0) {
      spreads[index] = { ...spread, updatedAt: new Date() };
    } else {
      spreads.push(spread);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(spreads));
  }
  
  static getAll(): CustomSpread[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const spreads = JSON.parse(stored);
      return spreads.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      }));
    } catch {
      return [];
    }
  }
  
  static get(id: string): CustomSpread | null {
    const spreads = this.getAll();
    return spreads.find(s => s.id === id) || null;
  }
  
  static delete(id: string): void {
    const spreads = this.getAll();
    const filtered = spreads.filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
  
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}