const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let ffmpegPath;
try {
  ffmpegPath = require('./fftemp/node_modules/ffmpeg-static');
} catch (e) {
  console.error("Failed to load ffmpeg-static", e);
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');

for (let i = 1; i <= 8; i++) {
  const inputFile = path.join(publicDir, `V${i}.mp4`);
  const outputFile = path.join(publicDir, `V${i}_compressed.mp4`);
  
  if (fs.existsSync(inputFile)) {
    console.log(`Compressing V${i}.mp4...`);
    try {
      execSync(`"${ffmpegPath}" -y -i "${inputFile}" -vcodec libx264 -crf 28 -preset fast -vf "scale='min(720,iw)':-2" -c:a aac -b:a 128k "${outputFile}"`, { stdio: 'inherit' });
      
      fs.renameSync(inputFile, path.join(publicDir, `V${i}_original.mp4`));
      fs.renameSync(outputFile, inputFile);
      console.log(`Successfully compressed V${i}.mp4`);
    } catch (e) {
      console.error(`Error compressing V${i}.mp4`, e.message);
    }
  }
}
console.log("Compression finished.");
