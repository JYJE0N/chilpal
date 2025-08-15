import { useEffect, useState, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => void;
  threshold?: number;
  disabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  disabled = false
}: UsePullToRefreshOptions) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || window.scrollY > 0) return;
    setStartY(e.touches[0].clientY);
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || window.scrollY > 0 || startY === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      // 당기는 동작 감지
      setPullDistance(Math.min(distance, threshold * 1.5));
      setIsPulling(distance > threshold);

      // 새로고침 영역에서는 스크롤 방지
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [disabled, startY, threshold]);

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;

    if (isPulling && pullDistance > threshold) {
      onRefresh();
    }

    // 상태 초기화
    setIsPulling(false);
    setPullDistance(0);
    setStartY(0);
  }, [disabled, isPulling, pullDistance, threshold, onRefresh]);

  useEffect(() => {
    // 모바일 디바이스에서만 활성화
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (!isMobile || disabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, disabled]);

  return {
    isPulling,
    pullDistance,
    isRefreshing: isPulling && pullDistance > threshold
  };
};