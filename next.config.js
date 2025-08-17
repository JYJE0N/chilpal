/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 프로덕션 빌드 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'X-RobotsTag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
  // 이미지 최적화 설정
  images: {
    // 이미지 포맷 설정 (WebP 우선)
    formats: ['image/webp'],
    // 이미지 크기 제한 (바이트) - 모바일 중심
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 192],
    deviceSizes: [480, 640, 750, 828, 1080, 1200],
    // 이미지 최소화 및 캐시 설정
    minimumCacheTTL: 86400, // 24시간 캐시
    // 모바일 우선 최적화
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 정적 이미지 import 최적화
    disableStaticImages: false,
  },
};

module.exports = nextConfig;
