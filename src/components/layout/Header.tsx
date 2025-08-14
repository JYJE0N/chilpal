"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-2xl">🔮</span>
            <h1 className="text-xl font-bold text-white">칠팔</h1>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full transition-all ${
                pathname === "/"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              홈
            </Link>
            <Link
              href="/reading"
              className={`px-4 py-2 rounded-full transition-all ${
                pathname === "/reading"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              타로 리딩
            </Link>
            <Link
              href="/history"
              className={`px-4 py-2 rounded-full transition-all ${
                pathname === "/history"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
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
                    ? "bg-purple-600 text-white"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 홈
              </Link>
              <Link
                href="/reading"
                className={`block px-4 py-2 rounded-lg transition-all ${
                  pathname === "/reading"
                    ? "bg-purple-600 text-white"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔮 타로 리딩
              </Link>
              <Link
                href="/history"
                className={`block px-4 py-2 rounded-lg transition-all ${
                  pathname === "/history"
                    ? "bg-purple-600 text-white"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                📚 히스토리
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
