// Script to upload Excel images to Cloudinary and add products to MongoDB
// Run: node scripts/import_silver_rings.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
});

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Cloudinary Cloud:', CLOUDINARY_CLOUD_NAME);
console.log('MongoDB URI found:', !!MONGODB_URI);

// SEO-friendly silver ring names
const RING_NAMES = [
  'Sterling Silver Twisted Rope Band Ring',
  'Pure Silver Floral Filigree Statement Ring',
  'Silver Oxidised Boho Midi Finger Ring',
  'Elegant Silver Solitaire Crystal Ring',
  'Silver Celtic Knot Eternity Band Ring',
  'Vintage Silver Leaf Wrap Cocktail Ring',
  'Silver Double Halo Stacking Ring',
  'Minimalist Silver Geometric Open Ring',
  'Silver Braided Infinity Love Band Ring',
  'Handcrafted Silver Oval Dome Ring',
];

// Prices from Excel
const PRICES = [7007, 6380, 5060, 2530, 10230, 6193, 7700, 6600, 5060, 3135];

const DESCRIPTIONS = [
  'A beautifully crafted sterling silver twisted rope band ring, perfect for everyday elegance.',
  'Delicate floral filigree design in pure silver, ideal for special occasions.',
  'Bohemian style oxidised silver midi ring with intricate detailing.',
  'Timeless solitaire crystal silver ring radiating brilliance and grace.',
  'Celtic knot eternity band in sterling silver symbolising eternal love.',
  'Vintage inspired leaf wrap cocktail ring in premium 925 sterling silver.',
  'Double halo stacking ring in silver for a layered, luxurious look.',
  'Minimalist geometric open band ring in polished sterling silver.',
  'Braided infinity love band ring crafted in 925 sterling silver.',
  'Handcrafted oval dome ring in pure silver with smooth finish.',
];

async function uploadToCloudinary(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const base64 = imageData.toString('base64');
  const dataUri = `data:image/png;base64,${base64}`;

  const formData = new URLSearchParams();
  formData.append('file', dataUri);
  formData.append('upload_preset', 'ml_default');
  formData.append('folder', 'anello/silver-rings');

  // Use signed upload
  const timestamp = Math.round(Date.now() / 1000);
  const crypto = await import('crypto');
  const signature = crypto.createHash('sha1')
    .update(`folder=anello/silver-rings&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
    .digest('hex');

  const fd = new URLSearchParams();
  fd.append('file', dataUri);
  fd.append('folder', 'anello/silver-rings');
  fd.append('timestamp', timestamp);
  fd.append('api_key', CLOUDINARY_API_KEY);
  fd.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });

  const data = await res.json();
  if (data.secure_url) {
    console.log(`✅ Uploaded: ${data.secure_url}`);
    return data.secure_url;
  } else {
    console.error('❌ Upload failed:', JSON.stringify(data));
    return null;
  }
}

async function addProductToDB(productData) {
  const res = await fetch('http://localhost:4000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (data._id) {
    console.log(`✅ Product added: ${productData.name}`);
  } else {
    console.error('❌ Product add failed:', JSON.stringify(data));
  }
  return data;
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  const mediaDir = path.join(__dirname, '..', 'excel_extracted', 'xl', 'media');
  
  console.log('\n🚀 Starting Silver Ring Import...\n');
  
  for (let i = 0; i < 10; i++) {
    const imgFile = path.join(mediaDir, `image${i + 1}.png`);
    const name = RING_NAMES[i];
    const price = PRICES[i];
    
    console.log(`\n[${i+1}/10] Processing: ${name}`);
    
    // Upload image
    const imageUrl = await uploadToCloudinary(imgFile);
    
    if (!imageUrl) {
      console.log(`⚠️ Skipping product ${i+1} due to image upload failure`);
      continue;
    }

    // Add product
    const oldPrice = Math.round(price * 1.2);
    await addProductToDB({
      name,
      slug: slugify(name) + '-' + (i + 1),
      cat: 'Silver Ring',
      price,
      oldPrice,
      stock: 50,
      sold: 0,
      emoji: '💍',
      badge: `-${Math.round((1 - price/oldPrice) * 100)}%`,
      isNewArrival: false,
      isStylish: false,
      isBestSeller: false,
      isExclusive: false,
      description: DESCRIPTIONS[i],
      material: '925 Sterling Silver',
      images: [imageUrl],
      rating: 5,
    });

    // Small delay between uploads
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n✅ Import complete!');
}

main().catch(console.error);
