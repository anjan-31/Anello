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

// Slugs helper
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

const productsToImport = [
  {
    imageFile: '53.png',
    price: 2981,
    name: 'Luminous Aquamarine Floral Aura Ring',
    description: 'Exquisitely crafted from 925 sterling silver, this ring features a captivating oval aquamarine centerpiece nestled within a sparkling crystal floral halo. Designed to radiate premium elegance, it adds a subtle splash of royal blue shimmer to any outfit.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '55.png',
    price: 4378,
    name: 'Royal Sapphire Cabochon Infinity Twist Ring',
    description: 'Adorn your finger with this stunning cabochon-cut royal blue sapphire ring. Featuring a sleek oval gemstone wrapped in a dazzling crystal-studded infinity twist band of 925 sterling silver, this piece symbolizes timeless love and modern luxury.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '1.png',
    price: 3355,
    name: 'Eternal Opal Blossom Silver Ring',
    description: 'Featuring a luminous oval white opal centerpiece that reflects a mesmerizing play of colors, this 925 sterling silver ring is framed by sparkling crystal petals. Perfect for gifting or adding a luxurious touch to your evening wear.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '2.png',
    price: 3575,
    name: 'Smoky Quartz Timeless Solitaire Ring',
    description: 'A minimalist masterpiece in 925 sterling silver, this ring showcases a rich, multi-faceted oval smoky quartz gemstone in a secure four-prong setting. Ideal for sophisticated everyday styling and subtle luxury.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '3.png',
    price: 2343,
    name: 'Vibrant Peridot Ivy Filigree Ring',
    description: 'Embrace nature-inspired elegance with this green peridot silver ring. The oval-cut gemstone is enveloped by a delicate leaf-patterned filigree band in 925 sterling silver, capturing fresh brilliance and artistic charm.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '4.png',
    price: 2530,
    name: 'Aquamarine Crystal Foliage Band Ring',
    description: 'A breath of fresh elegance, this 925 sterling silver ring boasts a serene oval aquamarine centered on a band embellished with shimmering crystal leaves. Perfect for modern, light-filled elegance.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '5.png',
    price: 2662,
    name: 'Vibrant Ruby Foliage Silver Ring',
    description: 'Capture bold sophistication with this oval-cut ruby gemstone ring. Set in a 925 sterling silver band detailed with glittering crystal leaves, this piece is an unforgettable statement of love and confidence.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '6.png',
    price: 2123,
    name: 'Deep Crimson Garnet Ivy Ring',
    description: 'Crafted in high-quality 925 sterling silver, this ring holds a rich, deep red oval garnet nestled within a detailed, leaf-patterned filigree band. A striking addition for vintage-inspired elegance.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '7.png',
    price: 2145,
    name: 'Serene Aquamarine Split-Shank Twist Ring',
    description: 'This graceful silver ring features an oval-cut light blue aquamarine nestled between delicate rows of sparkling crystals. The split-shank twist design in 925 sterling silver ensures a flattering and modern look.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '8.png',
    price: 2838,
    name: 'Violet Amethyst Wavy Infinity Ring',
    description: 'An exquisite round-cut violet amethyst takes center stage in this 925 sterling silver design. Surrounded by a sparkling, wave-like S-curve band set with diamond-cut crystals, this ring is a testament to graceful beauty.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '10.png',
    price: 2739,
    name: 'Lush Peridot Split Bypass Ring',
    description: 'This striking 925 sterling silver bypass ring highlights an oval green peridot. Flanked by a sleek split band adorned with channel-set crystal accents, it offers a fresh, contemporary approach to luxury styling.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '11.png',
    price: 1980,
    name: 'Iridescent Opal Marquise Petal Ring',
    description: 'Showcasing a magical oval white opal that glimmers with iridescent colors, this 925 sterling silver ring is accented with delicate marquise-shaped crystal clusters on the shoulders for a vintage, romantic finish.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '24.png',
    price: 5082,
    name: 'Victorian Aquamarine Starburst Heirloom Ring',
    description: 'A true showstopper, this vintage-inspired 925 sterling silver ring features a luminous oval aquamarine at the center of an elaborate, gothic starburst halo of sparkling diamonds. Exudes antique charm and royal grandeur.',
    isNewArrival: true,
    isStylish: true,
    isExclusive: true
  },
  {
    imageFile: '26.png',
    price: 4598,
    name: 'Tanzanite Marquise Split-Shank Halo Ring',
    description: 'Make a striking statement with this royal marquise-cut tanzanite gemstone. Bordered by a classic crystal halo and a split-shank band of 925 sterling silver, it is designed for unforgettable style and elegance.',
    isNewArrival: true,
    isBestSeller: true,
    isExclusive: true
  },
  {
    imageFile: '52.png',
    price: 2728,
    name: 'Tanzanite Azure Blossom Halo Ring',
    description: 'This 925 sterling silver ring features a brilliant oval-cut blue tanzanite gemstone wrapped in a floral crystal halo. The deep blue tones combined with sparkling accents create a premium, eye-catching floral design.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '12.png',
    price: 2783,
    name: 'Golden Citrine Wavy Infinity Ring',
    description: 'Bring warmth and light to your style with this round-cut golden citrine ring. Nestled in a 925 sterling silver bypass band with a wavy, crystal-encrusted S-curve, it makes for a dazzling and modern addition to your collection.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '56.png',
    price: 2772,
    name: 'Violet Amethyst Split Bypass Ring',
    description: 'An allure oval-cut violet amethyst set in a 925 sterling silver bypass shank. Shimmering channel-set crystals highlight the band, creating a sophisticated and contemporary look for any occasion.',
    isNewArrival: true,
    isStylish: true
  },
  {
    imageFile: '57.png',
    price: 2464,
    name: 'Amethyst Royal Blossom Halo Ring',
    description: 'A gorgeous oval-cut violet amethyst sits at the heart of this 925 sterling silver ring, surrounded by a crown-like halo of sparkling crystal petals. Exudes feminine elegance and rich royal color.',
    isNewArrival: true,
    isBestSeller: true
  },
  {
    imageFile: '59.jpg',
    price: 3355,
    name: 'Opal Radiant Bypass Crystal Ring',
    description: 'This unique 925 sterling silver ring highlights a glowing oval white opal. The band splits into a bypass frame flanked by radiant crystal clusters that hold the gem in a beautiful, crown-like hug.',
    isNewArrival: true,
    isStylish: true
  }
];

const sourceImagesDir = path.join(__dirname, '..', 'bulk-import', 'Images');
const targetImagesDir = path.join(__dirname, '..', 'public', 'products');

// Step 1 & 2: Copy files
console.log('Creating target products images directory if not exists...');
if (!fs.existsSync(targetImagesDir)) {
  fs.mkdirSync(targetImagesDir, { recursive: true });
}

console.log('Copying images...');
productsToImport.forEach(prod => {
  const srcFile = path.join(sourceImagesDir, prod.imageFile);
  const destFile = path.join(targetImagesDir, prod.imageFile);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${prod.imageFile} successfully.`);
  } else {
    console.warn(`Warning: Source image not found at ${srcFile}`);
  }
});

// Step 3: Insert into Database
async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Create unique slugs and format products for database
    const dbProducts = productsToImport.map(prod => {
      const slugBase = slugify(prod.name);
      return {
        name: prod.name,
        slug: slugBase,
        cat: 'Silver Ring',
        price: prod.price,
        oldPrice: Math.round(prod.price * 1.5), // Beautiful discount effect
        stock: 1,
        sold: 0,
        emoji: '💍',
        badge: 'NEW',
        isNewArrival: prod.isNewArrival || false,
        isStylish: prod.isStylish || false,
        isBestSeller: prod.isBestSeller || false,
        isExclusive: prod.isExclusive || false,
        description: prod.description,
        images: [`/products/${prod.imageFile}`],
        material: '925 Sterling Silver',
        rating: 5,
        reviews: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    console.log(`Inserting ${dbProducts.length} products...`);
    
    // We will do an upsert by slug to prevent duplicates if script is run multiple times
    for (const p of dbProducts) {
      const res = await productsCollection.updateOne(
        { slug: p.slug },
        { $set: p },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        console.log(`Successfully inserted: ${p.name}`);
      } else {
        console.log(`Successfully updated/restored: ${p.name}`);
      }
    }

    console.log('Bulk import complete!');

  } catch (err) {
    console.error('Database connection or query error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

importData();
