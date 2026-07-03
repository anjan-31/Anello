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

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    console.log('Updating stock of all products to 1...');
    const result = await productsCollection.updateMany(
      {},
      { $set: { stock: 1 } }
    );

    console.log(`Successfully updated stock to 1 for all ${result.modifiedCount} products!`);

  } catch (err) {
    console.error('Error updating stock:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
