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
    <div className="container-unified flex items-center justify-center min-h-[calc(100vh-200px)] relative">
      <div className="text-center py-16 relative z-10">
        <div className="space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold text-primary drop-shadow-2xl flex items-center justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Moon className="w-10 h-10 md:w-12 md:h-12 text-blue-300 animate-pulse" />
            </div>
            칠팔 타로
            <Star className="w-10 h-10 md:w-12 md:h-12 text-accent animate-pulse" />
          </h1>
          <div className="space-y-4">
            <p className="text-xl md:text-2xl font-semibold text-point drop-shadow-lg">
              78장 카드가 전하는 메시지
            </p>
            <p className="text-base md:text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
              알 수 없는 미래에 대한 궁금증을
              <br />
              카드를 통해 확인해보세요
            </p>
          </div>
        </div>

        <div className="max-w-sm mx-auto mt-12">
          <Link href="/reading">
            <button className="btn-primary group relative w-full text-lg md:text-xl px-8 py-6 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4),0_0_60px_rgba(236,72,153,0.3)] overflow-hidden">
              {/* 별빛 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* 버튼 내용 */}
              <div className="relative flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-spin" />
                타로 보기
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
