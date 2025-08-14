// src/app/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "칠팔 타로 - 78장 완전한 타로 카드 리딩 | 무료 온라인 타로점",
  description: "78장의 완전한 타로 덱으로 정확한 타로 리딩을 경험하세요. 메이저 아르카나와 마이너 아르카나를 모두 활용한 무료 온라인 타로점. 연애운, 직업운, 재물운을 지금 확인해보세요.",
  openGraph: {
    title: "칠팔 타로 - 78장 완전한 타로 카드 리딩",
    description: "과거, 현재, 미래의 메시지를 78장의 타로 카드로 확인하세요",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-7xl font-bold mystic-text-gradient drop-shadow-2xl">
              🌙 칠팔 타로 ✨
            </h1>
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-white/90 drop-shadow-lg">
                신비로운 밤하늘이 전하는 메시지
              </p>
              <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
                78장의 완전한 타로 덱으로 당신의 운명을 확인해보세요.<br />
                과거, 현재, 미래의 메시지가 별빛과 함께 기다리고 있습니다.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Link href="/reading">
              <button className="w-full px-8 py-4 mystic-button mystic-glow-hover text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 starlight-shimmer">
                🔮 운명의 카드 뽑기 ✨
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
