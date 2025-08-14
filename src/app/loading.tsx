export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* 타로 카드 로딩 애니메이션 - CSS 애니메이션으로 변경 */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-16 h-24 mystic-bg rounded-lg mystic-glow animate-pulse"
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: '2s',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl animate-bounce">🌙</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* 로딩 텍스트 */}
        <h2 className="text-3xl font-bold mystic-text-gradient mb-2 drop-shadow-lg animate-pulse">
          신비로운 별빛 아래에서 운명의 카드를 준비하는 중...
        </h2>
        
        <p className="text-white/80 text-lg">
          잠시만 기다려 주세요 ✨
        </p>
      </div>
    </div>
  );
}