'use client';

import { useEffect } from 'react';

export function useMobileViewport() {
  useEffect(() => {
    // 실제 뷰포트 높이 계산 함수
    const setViewportHeight = () => {
      // 실제 뷰포트 높이를 계산 (주소창 제외)
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // 삼성 브라우저 다크모드 감지 및 차단
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 삼성 브라우저 특정 처리
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('samsungbrowser')) {
          document.documentElement.style.cssText += `
            filter: none !important;
            -webkit-filter: none !important;
            background-color: rgb(45, 25, 83) !important;
          `;
          
          // 모든 요소에 필터 차단 적용
          const style = document.createElement('style');
          style.innerHTML = `
            * {
              filter: none !important;
              -webkit-filter: none !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
    };

    // 초기 설정
    setViewportHeight();

    // 리사이즈 이벤트 (주소창 숨김/표시)
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setViewportHeight, 100);
    };

    // orientation 변경 감지
    const handleOrientationChange = () => {
      setTimeout(setViewportHeight, 500);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // 스크롤 시 주소창 제어
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 스크롤 방향 감지
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // 아래로 스크롤 - 주소창 숨기기
        document.body.style.paddingTop = '0';
      } else {
        // 위로 스크롤 - 주소창 표시
        document.body.style.paddingTop = '';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(resizeTimer);
    };
  }, []);
}