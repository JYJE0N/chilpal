import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import MobileViewportProvider from "@/components/providers/MobileViewportProvider";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "칠팔 타로 - 78장 완전한 타로 카드 리딩",
    template: "%s | 칠팔 타로"
  },
  description: "78장의 완전한 타로 덱으로 당신의 운명을 확인하세요. 메이저 아르카나 22장과 마이너 아르카나 56장을 통한 정확한 타로 점술. 연애운, 직업운, 재물운, 건강운을 무료로 확인해보세요.",
  keywords: [
    "타로", "타로카드", "타로점", "타로리딩", "무료타로", "온라인타로",
    "타로점술", "운세", "오늘의운세", "연애운", "직업운", "재물운",
    "메이저아르카나", "마이너아르카나", "78장타로", "칠팔타로",
    "3카드스프레드", "원카드리딩", "과거현재미래"
  ],
  authors: [{ name: "칠팔 타로" }],
  creator: "칠팔 타로",
  publisher: "칠팔 타로",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://chilpal-tarot.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "칠팔 타로 - 78장 완전한 타로 카드 리딩",
    description: "78장의 완전한 타로 덱으로 과거, 현재, 미래를 확인하세요. 무료 온라인 타로 점술 서비스",
    url: process.env.NEXT_PUBLIC_URL || "https://chilpal-tarot.vercel.app",
    siteName: "칠팔 타로",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "칠팔 타로 - 78장 완전한 타로 카드 리딩",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "칠팔 타로 - 78장 완전한 타로 카드 리딩",
    description: "78장의 완전한 타로 덱으로 당신의 운명을 확인하세요",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    other: {
      naver: "naver-site-verification-code",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 기본 다크모드 차단 - 최소한의 호환성 */}
        <meta name="color-scheme" content="light" />
        {/* 모바일 브라우저 주소창 대응 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, minimum-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2d1953" />
        <meta name="msapplication-navbutton-color" content="#2d1953" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* 파비콘 설정 */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 중요한 이미지 preload */}
        <link rel="preload" href="/images/cards/card-back.webp" as="image" type="image/webp" />
        
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <MobileViewportProvider />
        <ToastProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
