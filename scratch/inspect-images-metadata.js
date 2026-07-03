const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    // Check if it is a PNG
    if (buffer.toString('ascii', 1, 4) === 'PNG') {
      const width = buffer.readInt32BE(16);
      const height = buffer.readInt32BE(20);
      return { width, height };
    }
  } catch (e) {}
  return null;
}

const mediaDir = path.join(__dirname, 'extracted-xlsx', 'xl', 'media');
const userImagesDir = path.join(__dirname, '..', 'bulk-import', 'Images');

console.log('--- Media Files ---');
fs.readdirSync(mediaDir).forEach(file => {
  const fullPath = path.join(mediaDir, file);
  const size = fs.statSync(fullPath).size;
  const dims = getPngDimensions(fullPath);
  console.log(`${file}: size=${size} bytes, dims=${dims ? `${dims.width}x${dims.height}` : 'unknown'}`);
});

console.log('\n--- User Files ---');
fs.readdirSync(userImagesDir).forEach(file => {
  const fullPath = path.join(userImagesDir, file);
  const size = fs.statSync(fullPath).size;
  const dims = getPngDimensions(fullPath);
  console.log(`${file}: size=${size} bytes, dims=${dims ? `${dims.width}x${dims.height}` : 'unknown'}`);
});
