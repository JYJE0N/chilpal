"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Disc, Sparkles, Home, BookOpen, Dot } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav-scrolled backdrop-blur-xl"
          : "glass-nav backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-all hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-0.5">
              <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold mystic-text-gradient">
              칠팔 타로
            </h1>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full transition-all ${
                pathname === "/"
                  ? "glass-button text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              홈
            </Link>
            <Link
              href="/reading"
              className={`px-4 py-2 rounded-full transition-all ${
                pathname === "/reading"
                  ? "glass-button text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              타로 리딩
            </Link>
            <Link
              href="/history"
              className={`px-4 py-2 rounded-full transition-all ${
                pathname === "/history"
                  ? "glass-button text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              히스토리
            </Link>
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
          <nav className="md:hidden mt-4 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <Link
                href="/"
                className={`block px-4 py-2 rounded-lg transition-all ${
                  pathname === "/"
                    ? "glass-button text-white"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="inline w-4 h-4 mr-2" />홈
              </Link>
              <Link
                href="/reading"
                className={`block px-4 py-2 rounded-lg transition-all ${
                  pathname === "/reading"
                    ? "glass-button text-white"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sparkles className="inline w-4 h-4 mr-2" />
                타로 리딩
              </Link>
              <Link
                href="/history"
                className={`block px-4 py-2 rounded-lg transition-all ${
                  pathname === "/history"
                    ? "glass-button text-white"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="inline w-4 h-4 mr-2" />
                히스토리
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
