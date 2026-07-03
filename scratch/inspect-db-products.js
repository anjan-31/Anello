const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let uri = '';
envContent.split('\n').forEach(line => {
  if (line.startsWith('MONGODB_URI=')) {
    uri = line.split('MONGODB_URI=')[1].trim();
  }
});
console.log('Connecting to:', uri);

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const products = await db.collection('products').find({}).limit(5).toArray();
    console.log('First 5 Products in DB:');
    console.log(JSON.stringify(products, null, 2));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
