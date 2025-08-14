// src/app/manifest.ts
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '칠팔 타로 - 78장 완전한 타로 카드 리딩',
    short_name: '칠팔 타로',
    description: '78장의 완전한 타로 덱으로 당신의 운명을 확인하세요',
    start_url: '/',
    display: 'standalone',
    background_color: '#1e1b4b',
    theme_color: '#9333ea',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['entertainment', 'lifestyle'],
    lang: 'ko-KR',
  };
}