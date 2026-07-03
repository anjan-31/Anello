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

const backupPath = 'A:\\anello_backup\\products.json';

async function restore() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected.');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    console.log('Clearing existing products...');
    await productsCollection.deleteMany({});

    console.log(`Loading backup from ${backupPath}...`);
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    const products = JSON.parse(backupContent);

    // Convert string _ids to MongoDB ObjectIds
    const productsToInsert = products.map(p => {
      const { _id, ...rest } = p;
      return {
        _id: new mongoose.Types.ObjectId(_id),
        ...rest,
        createdAt: rest.createdAt ? new Date(rest.createdAt) : new Date(),
        updatedAt: rest.updatedAt ? new Date(rest.updatedAt) : new Date()
      };
    });

    console.log(`Inserting ${productsToInsert.length} products...`);
    await productsCollection.insertMany(productsToInsert);
    console.log('Restored successfully!');
  } catch (err) {
    console.error('Error during restore:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

restore();
