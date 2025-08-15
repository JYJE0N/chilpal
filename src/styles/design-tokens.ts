// 디자인 토큰 시스템 - 일관된 디자인을 위한 중앙 관리
export const designTokens = {
  // 색상 팔레트
  colors: {
    // 주요 브랜드 색상
    primary: {
      50: 'rgb(240, 235, 255)',  // 매우 연한 보라
      100: 'rgb(230, 220, 255)', 
      200: 'rgb(200, 180, 240)',
      300: 'rgb(170, 140, 220)',
      400: 'rgb(140, 110, 200)',  // 메인 보라
      500: 'rgb(120, 100, 200)',  // 기본 보라
      600: 'rgb(100, 80, 180)',
      700: 'rgb(80, 60, 160)',
      800: 'rgb(60, 40, 140)',
      900: 'rgb(40, 20, 120)',
    },
    
    // 보조 색상 - 블루
    secondary: {
      50: 'rgb(240, 245, 255)',
      100: 'rgb(220, 235, 255)',
      200: 'rgb(180, 210, 255)',
      300: 'rgb(140, 185, 255)',  // 연한 블루
      400: 'rgb(100, 160, 240)',
      500: 'rgb(80, 140, 220)',   // 기본 블루
      600: 'rgb(60, 120, 200)',
      700: 'rgb(40, 100, 180)',
      800: 'rgb(20, 80, 160)',
      900: 'rgb(10, 60, 140)',
    },
    
    // 강조 색상 - 핑크
    accent: {
      50: 'rgb(255, 240, 250)',
      100: 'rgb(255, 220, 240)',
      200: 'rgb(255, 200, 230)',
      300: 'rgb(255, 170, 210)',
      400: 'rgb(240, 140, 190)',  // 포인트 핑크
      500: 'rgb(220, 120, 170)',  // 기본 핑크
      600: 'rgb(200, 100, 150)',
      700: 'rgb(180, 80, 130)',
      800: 'rgb(160, 60, 110)',
      900: 'rgb(140, 40, 90)',
    },
    
    // 시맨틱 색상
    semantic: {
      success: 'rgb(34, 197, 94)',   // 초록
      warning: 'rgb(250, 204, 21)',  // 노랑
      error: 'rgb(239, 68, 68)',     // 빨강 (삭제 등)
      info: 'rgb(59, 130, 246)',     // 파랑
    },
    
    // 배경 색상
    background: {
      deep: 'rgb(10, 15, 40)',      // 깊은 밤
      dark: 'rgb(20, 25, 60)',      // 어두운 배경
      medium: 'rgb(30, 35, 80)',    // 중간 배경
      light: 'rgba(255, 255, 255, 0.08)', // 글래스 효과
      glass: 'rgba(255, 255, 255, 0.12)', // 강한 글래스
    },
    
    // 텍스트 색상
    text: {
      primary: 'rgb(255, 255, 255)',     // 주 텍스트
      secondary: 'rgba(255, 255, 255, 0.8)', // 보조 텍스트
      muted: 'rgba(255, 255, 255, 0.6)',     // 약한 텍스트
      accent: 'rgb(200, 150, 230)',          // 강조 텍스트
    },
  },
  
  // 간격 시스템
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  
  // 반경 시스템
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',  // 완전 둥근
  },
  
  // 그림자 시스템
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    
    // 신비로운 글로우 효과
    glow: {
      sm: '0 0 10px rgba(120, 100, 200, 0.3)',
      md: '0 0 20px rgba(120, 100, 200, 0.4)',
      lg: '0 0 30px rgba(120, 100, 200, 0.5)',
      xl: '0 0 40px rgba(120, 100, 200, 0.6)',
    },
    
    // 카드별 글로우
    card: {
      purple: '0 0 20px rgba(140, 110, 200, 0.4)',
      blue: '0 0 20px rgba(100, 160, 240, 0.4)',
      pink: '0 0 20px rgba(240, 140, 190, 0.4)',
    },
  },
  
  // 애니메이션 타이밍
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
    slower: '500ms ease-in-out',
  },
  
  // 타이포그래피
  typography: {
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      base: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  
  // 브레이크포인트
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// 타입 정의
export type DesignTokens = typeof designTokens;
export type ColorPalette = typeof designTokens.colors;
export type PrimaryColors = typeof designTokens.colors.primary;
export type SemanticColors = typeof designTokens.colors.semantic;

// 유틸리티 함수들
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return '';
  }
  
  return value;
};

// CSS 변수 생성 함수
export const generateCSSVariables = () => {
  const cssVars: string[] = [];
  
  // 색상 변수
  Object.entries(designTokens.colors.primary).forEach(([key, value]) => {
    cssVars.push(`--color-primary-${key}: ${value};`);
  });
  
  Object.entries(designTokens.colors.secondary).forEach(([key, value]) => {
    cssVars.push(`--color-secondary-${key}: ${value};`);
  });
  
  Object.entries(designTokens.colors.accent).forEach(([key, value]) => {
    cssVars.push(`--color-accent-${key}: ${value};`);
  });
  
  // 간격 변수
  Object.entries(designTokens.spacing).forEach(([key, value]) => {
    cssVars.push(`--spacing-${key}: ${value};`);
  });
  
  // 반경 변수
  Object.entries(designTokens.borderRadius).forEach(([key, value]) => {
    cssVars.push(`--radius-${key}: ${value};`);
  });
  
  return cssVars.join('\n  ');
};

// 카드 수트별 색상 매핑
export const cardSuitColors = {
  major: {
    border: designTokens.colors.primary[400],
    shadow: designTokens.shadows.card.purple,
    text: designTokens.colors.primary[300],
  },
  cups: {
    border: designTokens.colors.secondary[400],
    shadow: designTokens.shadows.card.blue,
    text: designTokens.colors.secondary[300],
  },
  pentacles: {
    border: designTokens.colors.semantic.success,
    shadow: '0 0 20px rgba(34, 197, 94, 0.4)',
    text: 'rgb(134, 239, 172)',
  },
  swords: {
    border: 'rgb(156, 163, 175)',
    shadow: '0 0 20px rgba(156, 163, 175, 0.4)',
    text: 'rgb(209, 213, 219)',
  },
  wands: {
    border: 'rgb(248, 113, 113)',
    shadow: '0 0 20px rgba(248, 113, 113, 0.4)',
    text: 'rgb(252, 165, 165)',
  },
} as const;

// 스프레드별 색상 테마
export const spreadThemes = {
  'one-card': {
    gradient: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.secondary[500]})`,
    accent: designTokens.colors.primary[400],
  },
  'three-card': {
    gradient: `linear-gradient(135deg, ${designTokens.colors.secondary[500]}, ${designTokens.colors.accent[500]})`,
    accent: designTokens.colors.secondary[400],
  },
  'celtic-cross': {
    gradient: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.accent[400]})`,
    accent: designTokens.colors.accent[400],
  },
  'relationship': {
    gradient: `linear-gradient(135deg, ${designTokens.colors.accent[400]}, ${designTokens.colors.primary[500]})`,
    accent: designTokens.colors.accent[500],
  },
  'love-spread': {
    gradient: `linear-gradient(135deg, ${designTokens.colors.accent[500]}, ${designTokens.colors.accent[300]})`,
    accent: designTokens.colors.accent[400],
  },
  'career-path': {
    gradient: `linear-gradient(135deg, ${designTokens.colors.secondary[600]}, ${designTokens.colors.primary[500]})`,
    accent: designTokens.colors.secondary[500],
  },
  'yes-no': {
    gradient: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.secondary[600]})`,
    accent: designTokens.colors.primary[500],
  },
} as const;