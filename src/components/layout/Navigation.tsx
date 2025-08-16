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
      className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 opacity-95 ${
        isScrolled
          ? "bg-gradient-to-r from-slate-800/40 via-blue-900/30 to-slate-800/40 backdrop-blur-xl border-b border-solid border-white/8 shadow-lg shadow-slate-900/20"
          : "bg-gradient-to-r from-slate-900/15 via-blue-950/10 to-slate-900/15 backdrop-blur-sm border-b border-solid border-white/4 shadow-md shadow-slate-900/10"
      }`}
      style={{
        boxShadow: isScrolled 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="dawn-container h-full">
        <div className="flex items-center justify-between h-full">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <span className="text-2xl">🌙</span>
              <span className="absolute -top-1 -right-1 text-xs">✨</span>
            </div>
            <span className="font-bold text-lg dawn-text-primary">
              칠팔 타로
            </span>
          </Link>

          {/* 네비게이션 메뉴 */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-3 transition-all duration-300 group font-medium ${
                  pathname === item.href
                    ? "dawn-text-primary"
                    : "dawn-text-secondary hover:dawn-text-primary"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span>{item.label.split(" ")[1]}</span>
                </span>
                {/* 액티브 밑줄 - 은은한 핵크-보라 */}
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full" />
                )}
                {/* 호버 밑줄 - 아주 은은한 흰색 */}
                {pathname !== item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            ))}
          </div>

          {/* 모바일 메뉴 */}
          <div className="md:hidden flex items-center space-x-2">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  pathname === item.href
                    ? "dawn-text-primary bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30"
                    : "dawn-text-secondary hover:dawn-text-primary hover:bg-white/10"
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
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 origin-left"
          style={{ width: "100%" }}
        />
      )}
    </motion.nav>
  );
}