import Link from "next/link";
import { Sparkles, Home, BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-card-light border-t border-purple-400/10">
      <div className="container-unified py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 로고 & 설명 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-primary">칠팔 타로</h3>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              78장 인생의 길라잡이.
              <br />
              <span className="text-accent font-medium">
                재미로 보는 칠팔타로
              </span>
            </p>
          </div>

          {/* 메뉴 링크 */}
          <div>
            <h4 className="text-primary font-semibold mb-4">메뉴</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "홈", icon: Home },
                { href: "/reading", label: "타로 리딩", icon: Sparkles },
                { href: "/history", label: "히스토리", icon: BookOpen },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-secondary hover:text-accent transition-colors flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="border-t border-purple-400/10 mt-6 pt-6 text-center">
          <div className="text-sm text-muted">
            <p className="mb-1">© 2025 칠팔 타로</p>
            <p className="flex items-center justify-center gap-2">
              Made by <span className="text-accent font-medium">Doomock</span>
              <Heart className="w-4 h-4 text-pink-400" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
