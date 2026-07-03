const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:anello2025@anello.gszbntp.mongodb.net/anello').then(async () => {
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ name: String, createdAt: Date }, { strict: false }));
  
  // Base date
  const baseDateStr = '2026-05-25T13:18:46.480Z';
  
  // Ruby - Newest (Appears First)
  await Product.updateOne(
    { name: 'Vibrant Ruby Foliage Silver Ring' },
    { $set: { createdAt: new Date('2026-05-25T13:18:46.485Z') } }
  );
  
  // Tanzanite - Middle (Appears Second)
  await Product.updateOne(
    { name: 'Tanzanite Marquise Split-Shank Halo Ring' },
    { $set: { createdAt: new Date('2026-05-25T13:18:46.484Z') } }
  );
  
  // Aquamarine - Oldest (Appears Third)
  await Product.updateOne(
    { name: 'Aquamarine Crystal Foliage Band Ring' },
    { $set: { createdAt: new Date('2026-05-25T13:18:46.483Z') } }
  );

  console.log('Update complete.');
  process.exit(0);
});
