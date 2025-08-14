'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center shadow-2xl border border-white/20">
          {/* 에러 아이콘 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-5xl">😵</span>
            </div>
          </motion.div>

          {/* 에러 메시지 */}
          <h2 className="text-2xl font-bold text-white mb-4">
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
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              다시 시도
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all border border-white/30"
            >
              홈으로
            </button>
          </div>

          {/* 도움말 */}
          <p className="mt-6 text-purple-300 text-sm">
            문제가 계속되면 잠시 후 다시 방문해 주세요 💜
          </p>
        </div>
      </motion.div>
    </div>
  );
}