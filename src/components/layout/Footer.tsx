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
    <footer className="bg-white/5 backdrop-blur-lg border-t border-white/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 로고 & 설명 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <h3 className="text-lg font-bold text-white/90">TAROT 78</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              78장으로 당신의 앞날을.
              <br />
              카드의 전령이 당신을
              <br />
              기다리고 있습니다.
              <br />
              재미로 보세요.
            </p>
          </div>

          {/* 메뉴 링크 */}
          <div>
            <h4 className="text-white/90 font-semibold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home", icon: Home },
                { href: "/reading", label: "Reading", icon: Sparkles },
                { href: "/history", label: "History", icon: History },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-white transition-colors flex items-center space-x-2 hover:bg-white/5 px-2 py-1 rounded"
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
            <h4 className="text-white/90 font-semibold mb-4">Info</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                {
                  icon: Crown,
                  color: "text-yellow-400",
                  text: "메이저 아르카나 22장",
                },
                {
                  icon: Grid3X3,
                  color: "text-purple-400",
                  text: "마이너 아르카나 56장",
                },
                { icon: RotateCcw, color: "", text: "정/역방향 해석 지원" },
                { icon: Zap, color: "", text: "Next.js + TypeScript" },
              ].map(({ icon: Icon, color, text }, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2"
                >
                  <Icon className={`w-3 h-3 ${color}`} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/70 text-sm flex items-center justify-center gap-2">
            © 2025 78 Tarot Project. Made by {"Doomock"}
            <Heart className="w-3 h-3 text-blue-300" />
          </p>
          <p className="text-white/60 text-xs mt-2">2nd. Toy Project</p>
        </div>
      </div>
    </footer>
  );
}
