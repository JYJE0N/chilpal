import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mystic-bg rounded-2xl p-8 shadow-2xl mystic-glow">
          {/* 404 아이콘 */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mystic-glow animate-pulse">
              <span className="text-5xl">🔍</span>
            </div>
          </div>

          {/* 메시지 */}
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          
          <h2 className="text-3xl font-bold mystic-text-gradient mb-4 drop-shadow-lg">
            페이지를 찾을 수 없습니다
          </h2>
          
          <p className="text-purple-200 mb-8">
            찾으시는 페이지가 존재하지 않거나<br />
            이동되었을 수 있습니다.
          </p>

          {/* 액션 버튼들 */}
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <button className="px-6 py-3 mystic-button text-white font-semibold rounded-full transition-all transform hover:scale-105 mystic-glow-hover">
                🏠 홈으로
              </button>
            </Link>
            
            <Link href="/reading">
              <button className="px-6 py-3 bg-white/20 text-white font-semibold rounded-full hover:bg-white/30 transition-all border border-white/30 mystic-glow-hover">
                🔮 타로 리딩
              </button>
            </Link>
          </div>

          {/* 추천 */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg mystic-glow">
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
      </div>
    </div>
  );
}