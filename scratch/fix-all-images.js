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

async function fixImages() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    
    const prods = await productsCollection.find({}).toArray();
    let updated = 0;
    for (let p of prods) {
      if (p.images && p.images.length === 1) {
        p.images.push(p.images[0]);
        await productsCollection.updateOne({_id: p._id}, {$set: {images: p.images}});
        updated++;
      }
    }
    console.log(`Updated ${updated} products to have 2 images.`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

fixImages();
