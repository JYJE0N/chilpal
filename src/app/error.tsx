'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 에러 추적 서비스로 전송)
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="max-w-md w-full">
        <div className="mystic-bg rounded-2xl p-8 text-center shadow-2xl mystic-glow">
          {/* 에러 아이콘 */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mystic-glow animate-pulse">
              <span className="text-5xl">😵</span>
            </div>
          </div>

          {/* 에러 메시지 */}
          <h2 className="text-3xl font-bold mystic-text-gradient mb-4 drop-shadow-lg">
            앗! 문제가 발생했습니다
          </h2>
          
          <p className="text-purple-200 mb-6">
            일시적인 오류가 발생했습니다.<br />
            잠시 후 다시 시도해 주세요.
          </p>

          {/* 에러 상세 (개발 환경에서만 표시) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="text-purple-300 cursor-pointer text-sm">
                에러 상세 정보
              </summary>
              <pre className="mt-2 p-3 bg-black/30 rounded text-xs text-gray-300 overflow-auto">
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}

          {/* 액션 버튼들 */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 mystic-button text-white font-semibold rounded-full transition-all transform hover:scale-105 mystic-glow-hover"
            >
              다시 시도
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all border border-white/30 mystic-glow-hover"
            >
              홈으로
            </button>
          </div>

          {/* 도움말 */}
          <p className="mt-6 text-purple-300 text-sm">
            문제가 계속되면 잠시 후 다시 방문해 주세요 💜
          </p>
        </div>
      </div>
    </div>
  );
}