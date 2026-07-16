import mongoose from 'mongoose';
import * as xlsx from 'xlsx';

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String },
  cat: { type: String },
  price: { type: Number },
  oldPrice: { type: Number },
  stock: { type: Number },
  sold: { type: Number },
  emoji: { type: String },
  badge: { type: String },
  isNewArrival: { type: Boolean },
  isStylish: { type: Boolean },
  isBestSeller: { type: Boolean },
  isExclusive: { type: Boolean },
  description: { type: String },
  images: { type: [String] },
  video: { type: String },
  material: { type: String },
  rating: { type: Number },
  reviews: { type: Number },
}, { timestamps: true, collection: 'products' });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function exportProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({}).sort({ name: 1 }).lean();
    console.log(`Found ${products.length} products`);

    const data = products.map((p, index) => ({
      'S.No': index + 1,
      'Name': p.name || '',
      'Category': p.cat || '',
      'Price': p.price || '',
      'Old Price': p.oldPrice || '',
      'Description': p.description || '',
      'Material': p.material || '',
      'Stock': p.stock || 0,
      'Sold': p.sold || 0,
      'Rating': p.rating || 0,
      'Reviews': p.reviews || 0,
      'Emoji': p.emoji || '',
      'Badge': p.badge || '',
      'Is New Arrival': p.isNewArrival ? 'Yes' : 'No',
      'Is Stylish': p.isStylish ? 'Yes' : 'No',
      'Is Best Seller': p.isBestSeller ? 'Yes' : 'No',
      'Is Exclusive': p.isExclusive ? 'Yes' : 'No',
      'Images': (p.images || []).join(', '),
      'Video': p.video || ''
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Products');

    const outputPath = 'all_products.xlsx';
    xlsx.writeFile(wb, outputPath);
    console.log(`Successfully exported to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

exportProducts();
