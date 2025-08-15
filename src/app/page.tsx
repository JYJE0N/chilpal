// src/app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { Moon, Sparkles, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "칠팔 타로 - 78장 완전한 타로 카드 리딩 | 무료 온라인 타로점",
  description:
    "78장의 완전한 타로 덱으로 정확한 타로 리딩을 경험하세요. 메이저 아르카나와 마이너 아르카나를 모두 활용한 무료 온라인 타로점. 연애운, 직업운, 재물운을 지금 확인해보세요.",
  openGraph: {
    title: "칠팔 타로 - 78장 완전한 타로 카드 리딩",
    description: "과거, 현재, 미래의 메시지를 78장의 타로 카드로 확인하세요",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4 relative">
      {/* 추가 별똥별 애니메이션 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[200px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          style={{
            top: '20%',
            left: '-200px',
            transform: 'rotate(45deg)',
            animation: 'shooting-star-1 15s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-[150px] h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-0"
          style={{
            top: '60%',
            left: '-150px',
            transform: 'rotate(35deg)',
            animation: 'shooting-star-2 18s ease-in-out infinite 5s',
          }}
        />
        <div 
          className="absolute w-[180px] h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-0"
          style={{
            top: '40%',
            left: '-180px',
            transform: 'rotate(40deg)',
            animation: 'shooting-star-3 12s ease-in-out infinite 8s',
          }}
        />
      </div>
      
      <div className="text-center space-y-8 relative z-10">
        <div className="space-y-6">
          <h1 className="text-7xl font-bold text-white drop-shadow-2xl flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Moon className="w-12 h-12 text-blue-300 animate-pulse" />
            </div>
            칠팔 타로
            <Star className="w-12 h-12 text-blue-200 animate-pulse" />
          </h1>
          <div className="space-y-3">
            <p className="text-2xl font-semibold text-white/90 drop-shadow-lg">
              78장 카드가 전하는 메시지
            </p>
            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              알 수 없는 미래에 대한 궁금증을
              <br />
              카드를 통해 확인해보세요
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <Link href="/reading">
            <button className="w-full px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 hover:bg-white/15 hover:border-white/30 shadow-xl flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-300" />
              타로 보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
