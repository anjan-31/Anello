const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:anello2025@anello.gszbntp.mongodb.net/anello');
const ProductSchema = new mongoose.Schema({ name: String, createdAt: Date }, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  const products = await Product.find({ 
    name: { $in: [
      'Tanzanite Marquise Split-Shank Halo Ring', 
      'Vibrant Ruby Foliage Silver Ring', 
      'Aquamarine Crystal Foliage Band Ring'
    ] }
  }).select('name createdAt');

  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}
run();
