import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* 404 아이콘 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-5xl">🔍</span>
            </div>
          </motion.div>

          {/* 메시지 */}
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          
          <p className="text-purple-200 mb-8">
            찾으시는 페이지가 존재하지 않거나<br />
            이동되었을 수 있습니다.
          </p>

          {/* 액션 버튼들 */}
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg">
                🏠 홈으로
              </button>
            </Link>
            
            <Link href="/reading">
              <button className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all border border-white/30">
                🔮 타로 리딩
              </button>
            </Link>
          </div>

          {/* 추천 */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <p className="text-purple-300 text-sm mb-3">
              💡 이런 페이지는 어떠세요?
            </p>
            <div className="space-y-2">
              <Link href="/reading" className="block text-purple-200 text-sm hover:text-white transition-colors">
                • 타로 리딩 시작하기
              </Link>
              <Link href="/history" className="block text-purple-200 text-sm hover:text-white transition-colors">
                • 리딩 히스토리 확인
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}