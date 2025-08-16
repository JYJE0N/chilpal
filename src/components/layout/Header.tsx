"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sparkles, Home, BookOpen } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/reading", label: "Reading", icon: Sparkles },
  { href: "/history", label: "History", icon: BookOpen },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 기본 스크롤 상태
      setIsScrolled(currentScrollY > 20);
      
      // 모바일에서 스크롤 방향에 따른 헤더 표시/숨김
      if (window.innerWidth < 768) { // md breakpoint
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // 아래로 스크롤 시 헤더 숨김
          setIsHeaderVisible(false);
          setIsMobileMenuOpen(false); // 메뉴도 닫기
        } else {
          // 위로 스크롤 시 헤더 표시
          setIsHeaderVisible(true);
        }
      } else {
        // 데스크톱에서는 항상 표시
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-[9999] h-20 transition-all duration-300 backdrop-blur-xl mobile-header-blur ${
        isScrolled
          ? "bg-gradient-to-r from-slate-900/60 via-blue-950/50 to-slate-900/60 border-b border-white/5 shadow-lg shadow-slate-900/30"
          : "bg-gradient-to-r from-slate-950/40 via-blue-950/30 to-slate-950/40 border-b border-white/5"
      }`}
      style={{
        transform: `translate3d(0, ${isHeaderVisible ? '0' : '-100%'}, 0)`
      }}
    >
      <div className="container-unified h-full">
        <div className="flex justify-between items-center h-full">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-all hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <h1 className="text-xl font-bold text-white">TAROT 78</h1>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-2 transition-all duration-300 font-medium group ${
                  pathname === href
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {label}
                {/* 액티브 밑줄 - 은은한 핑크-보라 */}
                {pathname === href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                )}
                {/* 호버 밑줄 - 은은한 보라색 */}
                {pathname !== href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-purple-400/10 bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl">
            <div className="space-y-3">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative block px-6 py-4 transition-all duration-300 rounded-lg ${
                    pathname === href
                      ? "text-white font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/15"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-4" />
                    <span className="text-base">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
