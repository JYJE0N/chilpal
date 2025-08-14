# 칠팔 타로 (Chilpal Tarot) - 프로젝트 문서

## 📌 프로젝트 개요
**칠팔 타로**는 Next.js 15 기반의 타로 카드 리딩 웹 애플리케이션입니다. 78장의 완전한 타로 덱을 사용하여 사용자에게 온라인 타로 점술 서비스를 제공합니다.

## 🎯 주요 기능

### 1. 타로 리딩 서비스
- **스프레드 유형**: 1카드 리딩, 3카드 리딩 (과거-현재-미래)
- **질문 분류**: 연애(love), 직업(career), 재정(money), 건강(health), 일반(general)
- **카드 해석**: 정방향/역방향 구분, AI 기반 종합 해석
- **리딩 저장**: MongoDB를 통한 히스토리 관리

### 2. 타로 카드 구성 (78장)
#### 메이저 아르카나 (22장)
- 0번 The Fool부터 21번 The World까지
- 모든 카드 역방향 해석 지원
- 인생의 주요 전환점과 영적 교훈 표현

#### 마이너 아르카나 (56장)
- **Cups (컵)**: 감정, 관계, 사랑, 직관
- **Pentacles (펜타클)**: 물질, 재정, 건강, 실용성
- **Swords (검)**: 사고, 갈등, 도전, 의사소통
- **Wands (완드)**: 열정, 창조성, 영감, 행동
- 각 수트별 Ace부터 10까지 + 코트카드(Page, Knight, Queen, King)

### 3. 사용자 경험 기능
- 카드 셔플 애니메이션
- 3D 카드 뒤집기 효과
- 실시간 스크롤 진행 표시
- 세션 기반 개인화 (쿠키 사용)
- 반응형 디자인 (모바일/데스크톱)

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animation**: Framer Motion 12.23
- **UI Components**: Radix UI
- **State**: React 18.3 Hooks

### Backend
- **API**: Next.js API Routes
- **Database**: MongoDB + Mongoose 8.17
- **Session**: UUID 기반 쿠키 관리
- **Runtime**: Node.js 18.17+

### Development
- **Package Manager**: Yarn
- **Linting**: ESLint 9 + Next.js config
- **Build**: Next.js Turbopack

## 📁 프로젝트 구조

```
chilpal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 홈페이지 (메인 진입점)
│   │   ├── reading/page.tsx    # 타로 리딩 페이지
│   │   ├── demo/page.tsx       # UI 데모 페이지
│   │   ├── history/page.tsx    # 리딩 히스토리
│   │   └── api/                # API 엔드포인트
│   │       ├── readings/       # 리딩 CRUD API
│   │       └── test-db/        # DB 연결 테스트
│   │
│   ├── components/             # React 컴포넌트
│   │   ├── cards/              
│   │   │   ├── CardSelection.tsx    # 카드 선택 로직
│   │   │   ├── TarotCard.tsx       # 카드 컴포넌트
│   │   │   └── RealImageCard.tsx   # 실제 카드 이미지
│   │   ├── history/            
│   │   │   └── HistoryView.tsx     # 히스토리 뷰
│   │   └── layout/             
│   │       ├── MainLayout.tsx       # 메인 레이아웃
│   │       ├── Header.tsx          # 헤더
│   │       └── Footer.tsx          # 푸터
│   │
│   ├── data/                   # 타로 카드 데이터
│   │   ├── all-tarot-cards.ts      # 전체 카드 관리
│   │   ├── major-arcana.ts         # 메이저 아르카나
│   │   ├── cups-minor-arcana.ts    # 컵 카드
│   │   ├── pentacles-minor-arcana.ts # 펜타클 카드
│   │   ├── swords-minor-arcana.ts  # 검 카드
│   │   └── wands-minor-arcana.ts   # 완드 카드
│   │
│   ├── lib/                    # 유틸리티 함수
│   │   ├── mongodb.ts              # DB 연결
│   │   ├── tarot-interpretation.ts # 카드 해석 로직
│   │   └── reading-history.ts      # 히스토리 관리
│   │
│   ├── models/                 # 데이터 모델
│   │   └── Reading.ts              # MongoDB 스키마
│   │
│   └── types/                  # TypeScript 타입
│       └── tarot.ts                # 타로 관련 타입 정의
│
├── public/
│   └── images/cards/           # 카드 이미지 파일
│       ├── card-back.png           # 카드 뒷면
│       ├── major/                  # 메이저 아르카나 이미지
│       └── minor/                  # 마이너 아르카나 이미지
│           ├── cups/
│           ├── pentacles/
│           ├── swords/
│           └── wands/
│
├── package.json                # 프로젝트 의존성
├── next.config.ts              # Next.js 설정
├── tailwind.config.js          # Tailwind CSS 설정
└── tsconfig.json              # TypeScript 설정
```

## 🔄 주요 워크플로우

### 리딩 프로세스
1. **스프레드 선택**: 1카드 또는 3카드 선택
2. **질문 입력**: 사용자 질문 입력 및 카테고리 자동 분류
3. **카드 셔플**: 애니메이션과 함께 카드 섞기
4. **카드 선택**: 뒷면 카드 중 선택
5. **카드 공개**: 선택한 카드 뒤집기 애니메이션
6. **해석 제공**: 개별 카드 + 종합 해석
7. **저장**: MongoDB에 리딩 결과 저장

### API 엔드포인트
- `GET /api/readings` - 리딩 히스토리 조회
- `POST /api/readings` - 새 리딩 저장
- `GET /api/readings/[id]` - 특정 리딩 조회
- `GET /api/readings/stats` - 통계 조회

## 🎨 디자인 특징

### 비주얼 테마
- 다크 모드 중심의 신비로운 분위기
- 보라색-분홍색 그라디언트 활용
- 글로우 효과와 그림자로 깊이감 표현

### 애니메이션
- Framer Motion 기반 부드러운 전환
- 카드 셔플, 뒤집기, 선택 애니메이션
- 스크롤 기반 인터랙션

### 반응형 설계
- 모바일 퍼스트 접근
- 태블릿, 데스크톱 최적화
- 터치 제스처 지원

## 🔐 데이터 관리

### MongoDB 스키마
```typescript
Reading {
  question: string
  spreadType: 'one-card' | 'three-card'
  cards: DrawnCard[]
  interpretation: string
  questionType: 'love' | 'career' | 'money' | 'health' | 'general'
  userSession: string
  createdAt: Date
  updatedAt: Date
}
```

### 세션 관리
- UUID 기반 세션 ID 생성
- 쿠키로 1년간 유지
- 개인별 리딩 히스토리 분리

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 18.17.0 이상
- MongoDB 데이터베이스
- Yarn 패키지 매니저

### 환경 변수
```env
MONGODB_URI=mongodb://localhost:27017/tarot
NODE_ENV=development|production
```

### 실행 명령어
```bash
# 개발 서버 실행
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start

# 린트 체크
yarn lint
```

## 📝 주요 타입 정의

### TarotCard
- id, name, suit, number
- upright/reversed meanings
- keywords, interpretations
- image_url

### DrawnCard
- TarotCard 확장
- position (upright/reversed)
- current meanings

### Reading
- question, spread_type
- cards array
- interpretation
- timestamps

## 🔧 확장 가능성

### 계획된 기능
- 더 많은 스프레드 유형 추가
- 카드 조합 해석 강화
- 사용자 계정 시스템
- 리딩 공유 기능
- 다국어 지원

### 기술적 개선
- Redis 캐싱 도입
- WebSocket 실시간 기능
- PWA 지원
- 성능 최적화

## 📌 참고사항

- 모든 카드 이미지는 public/images/cards/ 디렉토리에 위치
- 메이저 아르카나만 역방향 해석 지원
- 세션 기반으로 로그인 없이 사용 가능
- Railway 배포 최적화 완료

---

*이 문서는 프로젝트의 전반적인 구조와 기능을 설명합니다. 개발 시 참조용으로 활용하세요.*