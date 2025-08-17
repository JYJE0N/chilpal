#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// 이미지 최적화 설정
const IMAGE_QUALITY = 75; // WebP 품질 (1-100) - 모바일 최적화를 위해 낮춤
const MAX_WIDTH = 400; // 최대 너비 - 모바일에 맞게 축소
const MAX_HEIGHT = 600; // 최대 높이 - 모바일에 맞게 축소

async function optimizeImage(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // 비율 유지하면서 리사이즈
    let resizeOptions = {};
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      resizeOptions = {
        width: MAX_WIDTH,
        height: MAX_HEIGHT,
        fit: 'inside',
        withoutEnlargement: true
      };
    }
    
    // WebP로 변환 및 최적화
    await image
      .resize(resizeOptions)
      .webp({ quality: IMAGE_QUALITY })
      .toFile(outputPath);
    
    const inputStats = await fs.stat(inputPath);
    const outputStats = await fs.stat(outputPath);
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}: ${(inputStats.size / 1024 / 1024).toFixed(1)}MB → ${(outputStats.size / 1024).toFixed(0)}KB (-${reduction}%)`);
    
    return { success: true, reduction };
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function processDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && /\.(png|jpg|jpeg)$/i.test(entry.name)) {
      const outputPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      await optimizeImage(fullPath, outputPath);
    }
  }
}

async function main() {
  console.log('🎨 타로 카드 이미지 최적화 시작...\n');
  
  const cardsDir = path.join(process.cwd(), 'public', 'images', 'cards');
  
  try {
    await processDirectory(cardsDir);
    console.log('\n✨ 이미지 최적화 완료!');
    console.log('💡 Tip: WebP를 지원하지 않는 브라우저를 위해 원본 이미지도 보관하세요.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// sharp 패키지 확인
try {
  require.resolve('sharp');
  main();
} catch (e) {
  console.log('📦 sharp 패키지를 먼저 설치해주세요:');
  console.log('yarn add -D sharp');
  process.exit(1);
}