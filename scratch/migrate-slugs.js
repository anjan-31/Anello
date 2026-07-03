import mongoose from 'mongoose';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
const mongoUriLine = envFile.split('\n').find(line => line.startsWith('MONGODB_URI='));
const MONGODB_URI = mongoUriLine ? mongoUriLine.split('=')[1].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '') : '';


const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...', MONGODB_URI.substring(0, 20) + '...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const products = await Product.find({ slug: { $exists: false } });
    console.log(`Found ${products.length} products without a slug.`);

    for (let p of products) {
      if (p.name) {
        let slug = slugify(p.name);
        // Handle potential duplicates
        let existing = await Product.findOne({ slug });
        if (existing) {
          slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }
        p.slug = slug;
        await p.save();
        console.log(`Updated ${p.name} -> ${slug}`);
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
