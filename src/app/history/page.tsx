// src/app/history/page.tsx
"use client";

import MainLayout from "@/components/layout/MainLayout";
import HistoryView from "@/components/history/HistoryView";

export default function HistoryPage() {
  return (
    <MainLayout>
      <HistoryView />
    </MainLayout>
  );
}