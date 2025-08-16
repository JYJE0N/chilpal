// 통합 디자인 시스템 - 단일 소스 진실
export const unifiedDesignSystem = {
  // 색상 팔레트 - 몽환적 밤하늘 테마
  colors: {
    // 기본 밤하늘 색상
    night: {
      deep: 'rgb(10, 15, 40)',        // #0a0f28 - 깊은 밤
      blue: 'rgb(30, 40, 95)',        // #1e285f - 진한 블루
      indigo: 'rgb(55, 65, 140)',     // #37418c - 인디고
      mystic: 'rgb(80, 100, 180)',    // #5064b4 - 메인 블루
      purple: 'rgb(120, 100, 200)',   // #7864c8 - 보라빛 블루
      lavender: 'rgb(150, 130, 220)', // #9682dc - 라벤더
      pink: 'rgb(200, 150, 230)',     // #c896e6 - 연한 핑크 퍼플
      starlight: 'rgb(230, 235, 255)', // #e6ebff - 별빛
      moonlight: 'rgb(255, 255, 255)', // #ffffff - 달빛
    },
    
    // 수트별 색상
    suits: {
      major: {
        border: 'rgb(168, 85, 247)',     // purple-500
        shadow: 'rgba(168, 85, 247, 0.3)',
        text: 'rgb(196, 181, 253)',      // purple-300
      },
      cups: {
        border: 'rgb(59, 130, 246)',     // blue-500
        shadow: 'rgba(59, 130, 246, 0.3)',
        text: 'rgb(147, 197, 253)',      // blue-300
      },
      pentacles: {
        border: 'rgb(34, 197, 94)',      // green-500
        shadow: 'rgba(34, 197, 94, 0.3)',
        text: 'rgb(134, 239, 172)',      // green-300
      },
      swords: {
        border: 'rgb(156, 163, 175)',    // gray-400
        shadow: 'rgba(156, 163, 175, 0.3)',
        text: 'rgb(209, 213, 219)',      // gray-300
      },
      wands: {
        border: 'rgb(248, 113, 113)',    // red-400
        shadow: 'rgba(248, 113, 113, 0.3)',
        text: 'rgb(252, 165, 165)',      // red-300
      },
    },
    
    // 텍스트 색상
    text: {
      primary: 'rgb(255, 255, 255)',           // 주 텍스트 (흰색)
      secondary: 'rgba(255, 255, 255, 0.8)',   // 보조 텍스트
      muted: 'rgba(255, 255, 255, 0.6)',       // 약한 텍스트
      accent: 'rgb(168, 85, 247)',             // 강조 텍스트 (보라)
      point: 'rgb(236, 72, 153)',              // 포인트 텍스트 (핑크)
      success: 'rgb(34, 197, 94)',             // 성공 (초록)
      warning: 'rgb(250, 204, 21)',            // 경고 (노랑)
      error: 'rgb(239, 68, 68)',               // 에러 (빨강)
      info: 'rgb(6, 182, 212)',                // 정보 (청록)
    },
    
    // 배경 색상
    background: {
      deep: 'rgb(10, 15, 40)',
      dark: 'rgb(30, 40, 95)',
      medium: 'rgb(55, 65, 140)',
      glass: {
        light: 'rgba(255, 255, 255, 0.08)',
        medium: 'rgba(255, 255, 255, 0.12)',
        strong: 'rgba(255, 255, 255, 0.16)',
      },
      card: {
        light: 'rgba(45, 37, 71, 0.4)',
        medium: 'rgba(69, 57, 97, 0.3)',
        strong: 'rgba(93, 78, 123, 0.25)',
      },
    },
    
    // 그라데이션
    gradients: {
      primary: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))',
      secondary: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(147, 51, 234))',
      night: 'linear-gradient(180deg, rgb(10, 15, 40) 0%, rgb(30, 40, 95) 50%, rgb(55, 65, 140) 100%)',
      mystic: 'linear-gradient(135deg, rgba(45, 37, 71, 0.4) 0%, rgba(69, 57, 97, 0.3) 50%, rgba(45, 37, 71, 0.4) 100%)',
    },
  },
  
  // 간격 시스템
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // 반경 시스템
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // 그림자 시스템
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    
    // 글로우 효과
    glow: {
      purple: '0 0 20px rgba(168, 85, 247, 0.4)',
      pink: '0 0 20px rgba(236, 72, 153, 0.4)',
      blue: '0 0 20px rgba(59, 130, 246, 0.4)',
      mystic: '0 0 30px rgba(120, 100, 200, 0.3)',
    },
  },
  
  // 애니메이션
  animation: {
    duration: {
      fast: '150ms',
      base: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      base: 'ease-in-out',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // 타이포그래피
  typography: {
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      base: 1.5,
      relaxed: 1.75,
    },
  },
  
  // 컴포넌트별 스타일
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))',
        hover: 'linear-gradient(135deg, rgb(147, 51, 234), rgb(219, 39, 119))',
        shadow: '0 4px 16px rgba(168, 85, 247, 0.3)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.08)',
        hover: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
      },
    },
    
    card: {
      glass: {
        background: 'linear-gradient(135deg, rgba(45, 37, 71, 0.4) 0%, rgba(69, 57, 97, 0.3) 50%, rgba(45, 37, 71, 0.4) 100%)',
        border: '1px solid rgba(157, 143, 199, 0.2)',
        shadow: '0 8px 32px rgba(15, 12, 31, 0.5), 0 0 64px rgba(236, 72, 153, 0.1)',
        backdrop: 'blur(20px)',
      },
    },
    
    input: {
      background: 'rgba(45, 37, 71, 0.3)',
      border: '1px solid rgba(157, 143, 199, 0.2)',
      focus: {
        border: 'rgba(168, 85, 247, 0.5)',
        shadow: '0 0 0 3px rgba(168, 85, 247, 0.2)',
      },
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

// CSS 변수 생성 함수
export const generateCSSVariables = () => {
  const { colors, spacing, borderRadius, shadows, typography } = unifiedDesignSystem;
  
  return `
    /* 밤하늘 색상 */
    --night-deep: ${colors.night.deep};
    --night-blue: ${colors.night.blue};
    --night-indigo: ${colors.night.indigo};
    --night-mystic: ${colors.night.mystic};
    --night-purple: ${colors.night.purple};
    --night-lavender: ${colors.night.lavender};
    --night-pink: ${colors.night.pink};
    --night-starlight: ${colors.night.starlight};
    --night-moonlight: ${colors.night.moonlight};
    
    /* 텍스트 색상 */
    --text-primary: ${colors.text.primary};
    --text-secondary: ${colors.text.secondary};
    --text-muted: ${colors.text.muted};
    --text-accent: ${colors.text.accent};
    --text-point: ${colors.text.point};
    --text-success: ${colors.text.success};
    --text-warning: ${colors.text.warning};
    --text-error: ${colors.text.error};
    --text-info: ${colors.text.info};
    
    /* 배경 색상 */
    --bg-deep: ${colors.background.deep};
    --bg-dark: ${colors.background.dark};
    --bg-medium: ${colors.background.medium};
    --bg-glass-light: ${colors.background.glass.light};
    --bg-glass-medium: ${colors.background.glass.medium};
    --bg-glass-strong: ${colors.background.glass.strong};
    
    /* 그라데이션 */
    --gradient-primary: ${colors.gradients.primary};
    --gradient-secondary: ${colors.gradients.secondary};
    --gradient-night: ${colors.gradients.night};
    --gradient-mystic: ${colors.gradients.mystic};
    
    /* 간격 */
    --spacing-xs: ${spacing.xs};
    --spacing-sm: ${spacing.sm};
    --spacing-md: ${spacing.md};
    --spacing-lg: ${spacing.lg};
    --spacing-xl: ${spacing.xl};
    --spacing-2xl: ${spacing['2xl']};
    --spacing-3xl: ${spacing['3xl']};
    
    /* 반경 */
    --radius-sm: ${borderRadius.sm};
    --radius-md: ${borderRadius.md};
    --radius-lg: ${borderRadius.lg};
    --radius-xl: ${borderRadius.xl};
    --radius-2xl: ${borderRadius['2xl']};
    --radius-full: ${borderRadius.full};
    
    /* 그림자 */
    --shadow-sm: ${shadows.sm};
    --shadow-md: ${shadows.md};
    --shadow-lg: ${shadows.lg};
    --shadow-xl: ${shadows.xl};
    --shadow-glow-purple: ${shadows.glow.purple};
    --shadow-glow-pink: ${shadows.glow.pink};
    --shadow-glow-blue: ${shadows.glow.blue};
    --shadow-glow-mystic: ${shadows.glow.mystic};
    
    /* 타이포그래피 */
    --font-size-xs: ${typography.fontSize.xs};
    --font-size-sm: ${typography.fontSize.sm};
    --font-size-base: ${typography.fontSize.base};
    --font-size-lg: ${typography.fontSize.lg};
    --font-size-xl: ${typography.fontSize.xl};
    --font-size-2xl: ${typography.fontSize['2xl']};
    --font-size-3xl: ${typography.fontSize['3xl']};
    --font-size-4xl: ${typography.fontSize['4xl']};
    --font-size-5xl: ${typography.fontSize['5xl']};
  `;
};

// 수트별 색상 매핑 함수
export const getSuitColors = (suit: string) => {
  const suitColors = unifiedDesignSystem.colors.suits;
  return suitColors[suit as keyof typeof suitColors] || suitColors.major;
};

// 컴포넌트 스타일 헬퍼
export const getComponentStyles = (component: string, variant: string = 'primary') => {
  const components = unifiedDesignSystem.components;
  const componentStyles = components[component as keyof typeof components];
  if (!componentStyles) return {};
  return (componentStyles as any)[variant] || {};
};

// 타입 정의
export type UnifiedDesignSystem = typeof unifiedDesignSystem;
export type NightColors = typeof unifiedDesignSystem.colors.night;
export type SuitColors = typeof unifiedDesignSystem.colors.suits;
export type TextColors = typeof unifiedDesignSystem.colors.text;