const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const mediaDir = path.join(__dirname, 'extracted-xlsx', 'xl', 'media');
const userImagesDir = path.join(__dirname, '..', 'bulk-import', 'Images');

async function getPerceptualBuffer(filePath) {
  try {
    // Resize to 16x16, greyscale, raw buffer
    return await sharp(filePath)
      .resize(16, 16, { fit: 'fill' })
      .greyscale()
      .raw()
      .toBuffer();
  } catch (err) {
    console.error(`Error processing image ${filePath}:`, err);
    return null;
  }
}

function calculateDiff(buf1, buf2) {
  let diff = 0;
  for (let i = 0; i < buf1.length; i++) {
    diff += Math.abs(buf1[i] - buf2[i]);
  }
  return diff;
}

async function run() {
  const mediaFiles = fs.readdirSync(mediaDir).filter(f => f.match(/\.(png|jpe?g)$/i));
  const userFiles = fs.readdirSync(userImagesDir).filter(f => f.match(/\.(png|jpe?g)$/i));

  console.log(`Processing ${mediaFiles.length} media files and ${userFiles.length} user files...`);

  const mediaBuffers = {};
  for (const file of mediaFiles) {
    const fullPath = path.join(mediaDir, file);
    const buf = await getPerceptualBuffer(fullPath);
    if (buf) {
      mediaBuffers[file] = buf;
    }
  }

  const userBuffers = {};
  for (const file of userFiles) {
    const fullPath = path.join(userImagesDir, file);
    const buf = await getPerceptualBuffer(fullPath);
    if (buf) {
      userBuffers[file] = buf;
    }
  }

  const matches = [];
  const unmatchedUser = [];

  for (const userFile of userFiles) {
    const userBuf = userBuffers[userFile];
    if (!userBuf) continue;

    let bestMatch = null;
    let minDiff = Infinity;

    for (const mediaFile of mediaFiles) {
      const mediaBuf = mediaBuffers[mediaFile];
      if (!mediaBuf) continue;

      const diff = calculateDiff(userBuf, mediaBuf);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = mediaFile;
      }
    }

    // Threshold of diff per pixel (16x16 = 256 pixels, max diff is 256 * 255 = 65280)
    // A diff of less than 2000 (average < 8 per pixel) is an extremely solid match
    if (minDiff < 3000) {
      matches.push({
        userFile,
        mediaFile: bestMatch,
        diff: minDiff
      });
    } else {
      unmatchedUser.push({
        userFile,
        bestMatch,
        diff: minDiff
      });
    }
  }

  console.log('\n--- Match Results ---');
  console.log(`Total matched: ${matches.length}`);
  console.log(JSON.stringify(matches, null, 2));

  if (unmatchedUser.length > 0) {
    console.log(`\n--- Unmatched/Suspicious (${unmatchedUser.length}) ---`);
    console.log(JSON.stringify(unmatchedUser, null, 2));
  }
}

run();
