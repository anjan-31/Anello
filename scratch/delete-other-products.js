const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let uri = '';
envContent.split('\n').forEach(line => {
  if (line.trim().startsWith('MONGODB_URI=')) {
    uri = line.split('MONGODB_URI=')[1].trim();
  }
});

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const productsToImport = [
  'Luminous Aquamarine Floral Aura Ring',
  'Royal Sapphire Cabochon Infinity Twist Ring',
  'Eternal Opal Blossom Silver Ring',
  'Smoky Quartz Timeless Solitaire Ring',
  'Vibrant Peridot Ivy Filigree Ring',
  'Aquamarine Crystal Foliage Band Ring',
  'Vibrant Ruby Foliage Silver Ring',
  'Deep Crimson Garnet Ivy Ring',
  'Serene Aquamarine Split-Shank Twist Ring',
  'Violet Amethyst Wavy Infinity Ring',
  'Lush Peridot Split Bypass Ring',
  'Iridescent Opal Marquise Petal Ring',
  'Victorian Aquamarine Starburst Heirloom Ring',
  'Tanzanite Marquise Split-Shank Halo Ring',
  'Tanzanite Azure Blossom Halo Ring',
  'Golden Citrine Wavy Infinity Ring',
  'Violet Amethyst Split Bypass Ring',
  'Amethyst Royal Blossom Halo Ring',
  'Opal Radiant Bypass Crystal Ring'
];

const slugsToKeep = productsToImport.map(name => slugify(name));

async function deleteOthers() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    
    const result = await productsCollection.deleteMany({
      slug: { $nin: slugsToKeep }
    });
    
    console.log(`Deleted ${result.deletedCount} products that were not in the import list.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

deleteOthers();
