import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

export const useKakao = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드되어 있으면 바로 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
      setIsLoaded(true);
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.async = true;
    
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
        setIsLoaded(true);
      }
    };

    script.onerror = () => {
      console.warn('카카오 SDK 로드 실패');
    };

    document.head.appendChild(script);

    return () => {
      // cleanup시 스크립트 제거
      const existingScript = document.querySelector('script[src*="kakao"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return { isLoaded, Kakao: window?.Kakao };
};