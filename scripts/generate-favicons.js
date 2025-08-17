const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 파비콘을 생성할 크기들
const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' } // Apple touch icon
];

async function generateFavicons() {
  console.log('🎯 파비콘 생성 시작...');

  const svgPath = path.join(__dirname, '../public/favicon.svg');
  const publicDir = path.join(__dirname, '../public');

  try {
    // SVG 파일 읽기
    const svgBuffer = fs.readFileSync(svgPath);

    // 각 크기별로 PNG 생성
    for (const { size, name } of FAVICON_SIZES) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png({
          quality: 100,
          compressionLevel: 9,
          progressive: true
        })
        .toFile(outputPath);
        
      console.log(`✅ 생성됨: ${name} (${size}x${size})`);
    }

    // favicon.ico 생성 (16x16과 32x32 조합)
    console.log('🔄 favicon.ico 생성 중...');
    
    const ico16Buffer = await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toBuffer();
      
    const ico32Buffer = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();

    // ICO 형식은 복잡하므로 32x32만 사용
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.ico'));

    console.log('✅ favicon.ico 생성 완료');

    // Web App Manifest용 파일 생성
    const manifest = {
      name: "칠팔 타로",
      short_name: "칠팔타로",
      description: "78장의 완전한 타로 덱으로 당신의 운명을 확인하세요",
      start_url: "/",
      display: "standalone",
      background_color: "#1a0b2e",
      theme_color: "#5b21b6",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    };

    fs.writeFileSync(
      path.join(publicDir, 'site.webmanifest'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('✅ site.webmanifest 생성 완료');
    console.log('🎉 모든 파비콘 생성 완료!');
    
  } catch (error) {
    console.error('❌ 파비콘 생성 실패:', error);
    process.exit(1);
  }
}

generateFavicons();