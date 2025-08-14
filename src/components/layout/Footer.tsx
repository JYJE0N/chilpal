import Link from "next/link";
import {
  Dot,
  Sparkles,
  Home,
  BookOpen,
  RotateCcw,
  Zap,
  Heart,
  Crown,
  Grid3X3,
  History,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-nav border-t border-white/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 로고 & 설명 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <h3 className="text-lg font-bold mystic-text-gradient">
                칠팔 타로
              </h3>
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
                  <Home className="w-3 h-3" />
                  <span>홈</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reading"
                  className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>타로 리딩</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <History className="w-3 h-3" />
                  <span>히스토리</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 프로젝트 정보 */}
          <div>
            <h4 className="text-white font-semibold mb-4">프로젝트 정보</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li className="flex items-center space-x-2">
                <Crown className="w-3 h-3 text-yellow-400" />
                <span>메이저 아르카나 22장</span>
              </li>
              <li className="flex items-center space-x-2">
                <Grid3X3 className="w-3 h-3 text-purple-400" />
                <span>마이너 아르카나 56장</span>
              </li>
              <li className="flex items-center space-x-2">
                <RotateCcw className="w-3 h-3" />
                <span>정/역방향 해석 지원</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="w-3 h-3" />
                <span>Next.js + TypeScript</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-purple-200 text-sm flex items-center justify-center gap-2">
            © 2025 칠팔 타로 프로젝트. Made with{" "}
            <Heart className="w-3 h-3 text-pink-300" />
          </p>
          <p className="text-purple-300 text-xs mt-2">
            78장의 완전한 타로 덱으로 운명을 확인해보세요
          </p>
        </div>
      </div>
    </footer>
  );
}
