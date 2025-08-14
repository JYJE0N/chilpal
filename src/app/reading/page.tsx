// src/app/reading/page.tsx
import MainLayout from "@/components/layout/MainLayout";
import CardSelection from "@/components/cards/CardSelection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "타로 리딩 시작하기",
  description: "질문을 입력하고 타로 카드를 선택하세요. 1카드 리딩과 3카드 스프레드(과거-현재-미래)로 당신의 운명을 확인할 수 있습니다.",
  openGraph: {
    title: "타로 리딩 시작하기 | 칠팔 타로",
    description: "질문을 입력하고 타로 카드를 선택하여 운명을 확인하세요",
    url: "/reading",
  },
};

export default function ReadingPage() {
  return (
    <MainLayout>
      <CardSelection />
    </MainLayout>
  );
}