"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  console.log("Navigation component rendering");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "🏠 홈", icon: "🏠" },
    { href: "/reading", label: "🔮 타로 리딩", icon: "🔮" },
    { href: "/history", label: "📜 히스토리", icon: "📜" },
    { href: "/demo", label: "🎨 데모", icon: "🎨" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav-scrolled backdrop-blur-xl border-b border-white/20"
          : "glass-nav backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <span className="text-2xl">🌙</span>
              <span className="absolute -top-1 -right-1 text-xs">✨</span>
            </div>
            <span className="font-bold text-lg mystic-text-gradient">
              칠팔 타로
            </span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 rounded-full transition-all duration-300 group ${
                  pathname === item.href
                    ? "text-white glass-button"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label.split(" ")[1]}</span>
                </span>
                
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* 모바일 메뉴 */}
          <div className="md:hidden flex items-center space-x-4">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-full transition-all duration-300 ${
                  pathname === item.href
                    ? "text-white glass-button"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 진행 표시기 (스크롤 시에만) */}
      {isScrolled && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 origin-left"
          style={{ width: "100%" }}
        />
      )}
    </motion.nav>
  );
}