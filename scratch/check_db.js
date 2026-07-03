const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://admin:anello2025@anello.gszbntp.mongodb.net/anello';

async function check() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const products = await db.collection('products').find({}).toArray();
    console.log('Total products:', products.length);
    if (products.length > 0) {
      console.log('Sample product:', JSON.stringify(products[0], null, 2));
      const categories = [...new Set(products.map(p => p.cat))];
      console.log('All categories in DB:', categories);
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
  }
}

check();
