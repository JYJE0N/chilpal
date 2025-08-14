// src/app/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";

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
