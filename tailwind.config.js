/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 3D 변환을 위한 설정 추가
      transformStyle: {
        "3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      // 칠팔 타로 프로젝트용 커스텀 색상
      colors: {
        tarot: {
          primary: "#6366f1", // 인디고
          secondary: "#8b5cf6", // 바이올렛
          accent: "#f59e0b", // 황금
          dark: "#1e1b4b", // 다크 인디고
        },
      },
      // 카드 애니메이션용 키프레임
      keyframes: {
        "card-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "card-reveal": {
          "0%": {
            transform: "scale(0.8) rotateY(180deg)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1) rotateY(0deg)",
            opacity: "1",
          },
        },
        "mystical-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
          },
        },
      },
      animation: {
        "card-flip": "card-flip 0.6s ease-in-out",
        "card-reveal": "card-reveal 0.8s ease-out",
        "mystical-glow": "mystical-glow 2s ease-in-out infinite",
      },
      // 타로 카드 비율
      aspectRatio: {
        tarot: "2/3", // 타로 카드 표준 비율
      },
    },
  },
  plugins: [],
};
