const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let uri = '';
envContent.split('\n').forEach(line => {
  if (line.startsWith('MONGODB_URI=')) {
    uri = line.split('MONGODB_URI=')[1].trim();
  }
});

async function run() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();
    console.log('Total products:', products.length);
    products.forEach((p, index) => {
      console.log(`${index + 1}. Name: ${p.name}`);
      console.log(`   Cat: ${p.cat}`);
      console.log(`   Images:`, p.images);
      console.log(`   Img:`, p.img);
      console.log(`   Badge:`, p.badge);
      console.log('----------------------------------------');
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
