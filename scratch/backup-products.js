const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');

const MONGODB_URI = "mongodb+srv://admin:anello2025@anello.gszbntp.mongodb.net/anello";

const BACKUP_DIR = 'A:\\anello_backup';
const MEDIA_DIR = path.join(BACKUP_DIR, 'media');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function getFilenameFromUrl(url) {
  try {
    const parsed = new URL(url);
    const basename = path.basename(parsed.pathname);
    return decodeURIComponent(basename);
  } catch (e) {
    return 'unknown_' + Date.now();
  }
}

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected!');
  
  console.log('Fetching products...');
  const products = await Product.find({}).lean();
  
  console.log(`Found ${products.length} products. Saving JSON...`);
  fs.writeFileSync(path.join(BACKUP_DIR, 'products.json'), JSON.stringify(products, null, 2));
  
  console.log('Starting media download...');
  let downloadedMedia = 0;
  
  const urls = new Set();
  
  products.forEach(p => {
    if (p.images && Array.isArray(p.images)) {
      p.images.forEach(img => {
        if (img && img.startsWith('http')) urls.add(img);
      });
    }
    if (p.video && p.video.startsWith('http')) {
      urls.add(p.video);
    }
  });
  
  const totalMedia = urls.size;
  console.log(`Found ${totalMedia} unique media URLs.`);
  
  for (const url of urls) {
    let filename = getFilenameFromUrl(url);
    if (!filename || filename === '/') {
        filename = 'media_' + Date.now();
    }
    const dest = path.join(MEDIA_DIR, filename);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading: ${url}`);
      try {
        await downloadFile(url, dest);
        downloadedMedia++;
      } catch (err) {
        console.error(`Error downloading ${url}:`, err.message);
      }
    } else {
      console.log(`Already exists, skipping: ${filename}`);
      downloadedMedia++;
    }
  }
  
  console.log(`\nBackup completed successfully!`);
  console.log(`Data saved to: ${path.join(BACKUP_DIR, 'products.json')}`);
  console.log(`Media saved to: ${MEDIA_DIR} (${downloadedMedia}/${totalMedia} files)`);
  
  await mongoose.disconnect();
}

run().catch(console.error);
