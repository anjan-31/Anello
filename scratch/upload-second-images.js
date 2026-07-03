const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Parse credentials from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let uri = '', cloudName = '', apiKey = '', apiSecret = '';
envContent.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    if (key === 'MONGODB_URI') uri = val;
    if (key === 'CLOUDINARY_CLOUD_NAME') cloudName = val;
    if (key === 'CLOUDINARY_API_KEY') apiKey = val;
    if (key === 'CLOUDINARY_API_SECRET') apiSecret = val;
  }
});

if (!uri || !cloudName || !apiKey || !apiSecret) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

// Map slug to local second image filename
const secondImageMap = {
  'luminous-aquamarine-floral-aura-ring': '54.png',
  'violet-amethyst-wavy-infinity-ring': '9.png',
  'iridescent-opal-marquise-petal-ring': '23.png',
  'victorian-aquamarine-starburst-heirloom-ring': '25.png',
  'tanzanite-marquise-split-shank-halo-ring': '27.png',
  'amethyst-royal-blossom-halo-ring': '58.png',
};

async function uploadToCloudinary(filePath) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signatureString = `timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  const fileUri = `data:image/png;base64,${base64Data}`;

  const formData = new FormData();
  formData.append('file', fileUri);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error(data.error?.message || 'Upload failed');
  }
}

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    for (const [slug, fileName] of Object.entries(secondImageMap)) {
      const product = await productsCollection.findOne({ slug });
      if (!product) {
        console.log(`Product not found for slug: ${slug}`);
        continue;
      }

      console.log(`Uploading second image (${fileName}) for product: ${product.name}`);
      const filePath = path.join(__dirname, '..', 'bulk-import', 'Images', fileName);
      if (!fs.existsSync(filePath)) {
        console.error(`Local file not found at ${filePath}`);
        continue;
      }

      try {
        const url = await uploadToCloudinary(filePath);
        console.log(`Uploaded to Cloudinary: ${url}`);

        // Update product images array in DB
        const currentImages = product.images || [];
        const newImages = [currentImages[0]];
        newImages.push(url);

        await productsCollection.updateOne(
          { _id: product._id },
          { $set: { images: newImages } }
        );
        console.log(`Updated images for product ${product.name} in DB.`);
      } catch (err) {
        console.error(`Error uploading or updating for ${slug}:`, err);
      }
    }
  } catch (err) {
    console.error('Connection or general error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
