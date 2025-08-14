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
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white">🔮 칠팔 타로 🔮</h1>
            <p className="text-purple-200 text-xl max-w-2xl">
              78장의 완전한 타로 덱으로 당신의 운명을 확인해보세요.
              <br />
              과거, 현재, 미래의 메시지가 기다리고 있습니다.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Link href="/reading">
              <button className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 text-lg shadow-lg">
                🔮 타로 리딩 시작하기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
