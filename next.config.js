/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 프로덕션 빌드 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // 이미지 최적화 설정
  images: {
    // 이미지 포맷 설정
    formats: ['image/avif', 'image/webp'],
    // 이미지 크기 제한 (바이트)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 이미지 최소화
    minimumCacheTTL: 60,
    // 정적 이미지 import 최적화
    disableStaticImages: false,
  },
};

module.exports = nextConfig;
