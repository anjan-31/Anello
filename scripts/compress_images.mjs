// Script to compress all images in public folder
// Run: node scripts/compress_images.mjs

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const sizeBefore = fs.statSync(filePath).size;

  try {
    let buffer;

    if (ext === '.png') {
      buffer = await sharp(filePath).png({ quality: 85, compressionLevel: 9 }).toBuffer();
    } else if (ext === '.jpg' || ext === '.jpeg') {
      buffer = await sharp(filePath).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    } else if (ext === '.webp') {
      buffer = await sharp(filePath).webp({ quality: 82 }).toBuffer();
    } else {
      return;
    }

    fs.writeFileSync(filePath, buffer);
    const sizeAfter = fs.statSync(filePath).size;
    const saved = ((sizeBefore - sizeAfter) / sizeBefore * 100).toFixed(1);
    console.log(`✅ ${path.basename(filePath)}: ${(sizeBefore/1024).toFixed(0)}KB → ${(sizeAfter/1024).toFixed(0)}KB (${saved}% saved)`);
  } catch (err) {
    console.error(`❌ ${path.basename(filePath)}: ${err.message}`);
  }
}

async function main() {
  const files = fs.readdirSync(publicDir).filter(f =>
    EXTENSIONS.includes(path.extname(f).toLowerCase())
  );

  console.log(`\n🗜️  Compressing ${files.length} images in /public...\n`);

  for (const file of files) {
    const filePath = path.join(publicDir, file);
    await compressImage(filePath);
  }

  console.log('\n✅ All images compressed!');
}

main().catch(console.error);
