const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(png|jpe?g)$/i)) {
      console.log(`Compressing: ${fullPath}`);
      const tempPath = fullPath + '.tmp';
      try {
        if (file.toLowerCase().endsWith('.png')) {
          await sharp(fullPath)
            .png({ quality: 50, compressionLevel: 9, adaptiveFiltering: true })
            .toFile(tempPath);
        } else {
          await sharp(fullPath)
            .jpeg({ quality: 50, progressive: true })
            .toFile(tempPath);
        }
        
        // Only replace if it actually reduced the size
        const origStat = fs.statSync(fullPath);
        const newStat = fs.statSync(tempPath);
        if (newStat.size < origStat.size) {
            fs.unlinkSync(fullPath);
            fs.renameSync(tempPath, fullPath);
            console.log(`-> Compressed by ${Math.round(100 - (newStat.size / origStat.size * 100))}%`);
        } else {
            fs.unlinkSync(tempPath);
            console.log(`-> Kept original (no size benefit)`);
        }
      } catch (err) {
        console.error(`Failed to process ${fullPath}:`, err.message);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'public')).then(() => {
  console.log('All images compressed.');
});
