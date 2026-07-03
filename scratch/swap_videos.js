const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://admin:anello2025@anello.gszbntp.mongodb.net/anello';

const HomeVideoSchema = new mongoose.Schema({
  slot: { type: Number, required: true, unique: true },
  url: { type: String, required: true },
  hashtag: { type: String, default: '#Anello' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null }
}, { timestamps: true });

const HomeVideo = mongoose.models.HomeVideo || mongoose.model('HomeVideo', HomeVideoSchema);

async function swapSlots() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const video2 = await HomeVideo.findOne({ slot: 2 });
    const video4 = await HomeVideo.findOne({ slot: 4 });

    if (!video2 || !video4) {
      console.log('Could not find both videos (Slot 2 and Slot 4)');
      if (!video2) console.log('Missing Slot 2');
      if (!video4) console.log('Missing Slot 4');
      process.exit(1);
    }

    console.log('Swapping Slot 2 and Slot 4...');
    console.log(`Slot 2 was: ${video2.hashtag} (${video2.url})`);
    console.log(`Slot 4 was: ${video4.hashtag} (${video4.url})`);

    // Use a temp slot to avoid unique constraint error
    const TEMP_SLOT = 999;
    
    // 1. Move 2 to TEMP
    await HomeVideo.updateOne({ slot: 2 }, { $set: { slot: TEMP_SLOT } });
    
    // 2. Move 4 to 2
    await HomeVideo.updateOne({ slot: 4 }, { $set: { slot: 2 } });
    
    // 3. Move TEMP to 4
    await HomeVideo.updateOne({ slot: TEMP_SLOT }, { $set: { slot: 4 } });

    console.log('Swap completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during swap:', err);
    process.exit(1);
  }
}

swapSlots();
