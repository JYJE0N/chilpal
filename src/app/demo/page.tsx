// src/app/demo/page.tsx
import FullscreenLayout from "@/components/layout/FullscreenLayout";
import { TarotCardDemo } from "@/components/cards/TarotCard";

export default function DemoPage() {
  return (
    <FullscreenLayout>
      <TarotCardDemo />
    </FullscreenLayout>
  );
}
