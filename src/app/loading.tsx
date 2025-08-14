import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
      <div className="text-center">
        {/* 타로 카드 로딩 애니메이션 */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-16 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg"
              animate={{
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* 로딩 텍스트 */}
        <motion.h2
          className="text-2xl font-bold text-white mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          운명의 카드를 준비하는 중...
        </motion.h2>
        
        <p className="text-purple-200">
          잠시만 기다려 주세요
        </p>
      </div>
    </div>
  );
}