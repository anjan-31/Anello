const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

const mediaDir = path.join(__dirname, 'extracted-xlsx', 'xl', 'media');
const userImagesDir = path.join(__dirname, '..', 'bulk-import', 'Images');

try {
  const mediaFiles = fs.readdirSync(mediaDir);
  const userFiles = fs.readdirSync(userImagesDir);

  const mediaHashMap = {};
  mediaFiles.forEach(file => {
    const fullPath = path.join(mediaDir, file);
    const stat = fs.statSync(fullPath);
    const hash = getHash(fullPath);
    mediaHashMap[hash] = {
      name: file,
      size: stat.size
    };
  });

  const matched = [];
  const unmatchedUser = [];

  userFiles.forEach(file => {
    const fullPath = path.join(userImagesDir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return;

    const hash = getHash(fullPath);
    if (mediaHashMap[hash]) {
      matched.push({
        userFile: file,
        mediaFile: mediaHashMap[hash].name,
        size: stat.size
      });
    } else {
      unmatchedUser.push({
        userFile: file,
        size: stat.size
      });
    }
  });

  console.log('Matched files:', matched.length);
  console.log(JSON.stringify(matched, null, 2));

  console.log('Unmatched user files:', unmatchedUser.length);
  if (unmatchedUser.length > 0) {
    console.log(JSON.stringify(unmatchedUser, null, 2));
  }

} catch (err) {
  console.error('Error matching files:', err);
}
