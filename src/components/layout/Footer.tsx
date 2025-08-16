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
    <footer className="bg-gradient-to-b from-slate-900/50 via-slate-800/40 to-slate-900/50 backdrop-blur-xl border-t-2 border-purple-400/30">
      <div className="dawn-container py-16 px-6">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-8">
          {/* 로고 & 설명 */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              <h3 className="text-xl font-bold text-white">TAROT 78</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              78장으로 당신의 앞날을.
              <br />
              카드의 전령이 당신을
              <br />
              기다리고 있습니다.
              <br />
              <span className="text-purple-400 font-medium">재미로 보세요.</span>
            </p>
          </div>

          {/* 메뉴 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Menu</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Home", icon: Home },
                { href: "/reading", label: "Reading", icon: Sparkles },
                { href: "/history", label: "History", icon: History },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-3"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 프로젝트 정보 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Info</h4>
            <ul className="space-y-3 text-sm">
              {[
                {
                  icon: Crown,
                  color: "text-purple-400",
                  text: "메이저 아르카나 22장",
                },
                {
                  icon: Grid3X3,
                  color: "text-pink-400",
                  text: "마이너 아르카나 56장",
                },
                { icon: RotateCcw, color: "text-cyan-400", text: "정/역방향 해석 지원" },
                { icon: Zap, color: "text-cyan-400", text: "Next.js + TypeScript" },
              ].map(({ icon: Icon, color, text }, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 text-gray-400"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="border-t-2 border-purple-400/20 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-300 flex items-center justify-center gap-2">
            © 2025 78 Tarot Project. Made by <span className="text-purple-400 font-medium">{"Doomock"}</span>
            <Heart className="w-4 h-4 text-purple-400 animate-pulse" />
          </p>
          <p className="text-gray-600 text-xs mt-2">2nd. Toy Project</p>
        </div>
      </div>
    </footer>
  );
}
