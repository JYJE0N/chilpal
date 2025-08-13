import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 로고 & 설명 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🔮</span>
              <h3 className="text-lg font-bold text-white">칠팔 타로</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              78장의 완전한 타로 덱으로
              <br />
              당신의 운명을 확인해보세요.
              <br />
              과거, 현재, 미래의 메시지가
              <br />
              기다리고 있습니다.
            </p>
          </div>

          {/* 메뉴 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-4">메뉴</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>🏠</span>
                  <span>홈</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reading"
                  className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>🔮</span>
                  <span>타로 리딩</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <span>🎴</span>
                  <span>카드 데모</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 프로젝트 정보 */}
          <div>
            <h4 className="text-white font-semibold mb-4">프로젝트 정보</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li className="flex items-center space-x-2">
                <span>✨</span>
                <span>메이저 아르카나 22장</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🎴</span>
                <span>마이너 아르카나 56장</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>🔄</span>
                <span>정/역방향 해석 지원</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Next.js + TypeScript</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-purple-200 text-sm">
            © 2025 칠팔 타로 프로젝트. Made with 💜
          </p>
          <p className="text-purple-300 text-xs mt-2">
            78장의 완전한 타로 덱으로 운명을 확인해보세요
          </p>
        </div>
      </div>
    </footer>
  );
}
