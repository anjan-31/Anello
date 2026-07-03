const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local for connection string
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let uri = '';
envContent.split('\n').forEach(line => {
  if (line.trim().startsWith('MONGODB_URI=')) {
    uri = line.split('MONGODB_URI=')[1].trim();
  }
});

if (!uri) {
  console.error('Failed to locate MONGODB_URI in .env.local');
  process.exit(1);
}

const newSlugs = [
  'luminous-aquamarine-floral-aura-ring',
  'royal-sapphire-cabochon-infinity-twist-ring',
  'eternal-opal-blossom-silver-ring',
  'smoky-quartz-timeless-solitaire-ring',
  'vibrant-peridot-ivy-filigree-ring',
  'aquamarine-crystal-foliage-band-ring',
  'vibrant-ruby-foliage-silver-ring',
  'deep-crimson-garnet-ivy-ring',
  'serene-aquamarine-split-shank-twist-ring',
  'violet-amethyst-wavy-infinity-ring',
  'lush-peridot-split-bypass-ring',
  'iridescent-opal-marquise-petal-ring',
  'victorian-aquamarine-starburst-heirloom-ring',
  'tanzanite-marquise-split-shank-halo-ring',
  'tanzanite-azure-blossom-halo-ring',
  'golden-citrine-wavy-infinity-ring',
  'violet-amethyst-split-bypass-ring',
  'amethyst-royal-blossom-halo-ring',
  'opal-radiant-bypass-crystal-ring'
];

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    console.log('Deleting products not in the new arrivals list...');
    const result = await productsCollection.deleteMany({
      slug: { $nin: newSlugs }
    });

    console.log(`Successfully deleted ${result.deletedCount} old products!`);

  } catch (err) {
    console.error('Error deleting old products:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
