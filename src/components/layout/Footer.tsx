import Link from "next/link";
import {
  Sparkles,
  Home,
  RotateCcw,
  Zap,
  Heart,
  Crown,
  Grid3X3,
  History,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-nav border-t border-white/20">
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
              {[
                { href: "/", label: "홈", icon: Home },
                { href: "/reading", label: "타로 리딩", icon: Sparkles },
                { href: "/history", label: "히스토리", icon: History },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 프로젝트 정보 */}
          <div>
            <h4 className="text-white font-semibold mb-4">프로젝트 정보</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              {[
                { icon: Crown, color: "text-yellow-400", text: "메이저 아르카나 22장" },
                { icon: Grid3X3, color: "text-purple-400", text: "마이너 아르카나 56장" },
                { icon: RotateCcw, color: "", text: "정/역방향 해석 지원" },
                { icon: Zap, color: "", text: "Next.js + TypeScript" },
              ].map(({ icon: Icon, color, text }, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Icon className={`w-3 h-3 ${color}`} />
                  <span>{text}</span>
                </li>
              ))}
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
