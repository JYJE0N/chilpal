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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-[9999] transition-all duration-300 ${
        isScrolled
          ? "bg-black/50 backdrop-blur-xl border-b border-white/20 shadow-xl"
          : "bg-black/30 backdrop-blur-lg border-b border-white/10"
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
            <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
            <h1 className="text-xl font-bold text-white/90">TAROT 78</h1>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-2 transition-all duration-300 ${
                  pathname === href
                    ? "text-purple-300 font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {label}
                {/* 액티브 언더라인 */}
                {pathname === href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                )}
                {/* 호버 언더라인 */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 rounded-full transform scale-x-0 hover:scale-x-100 transition-transform duration-300" />
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
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20 bg-black/40 backdrop-blur-md rounded-lg shadow-lg">
            <div className="space-y-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative block px-4 py-3 transition-all duration-300 ${
                    pathname === href
                      ? "text-purple-300 font-semibold"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-3" />
                    {label}
                  </div>
                  {/* 액티브 인디케이터 */}
                  {pathname === href && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r" />
                  )}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
