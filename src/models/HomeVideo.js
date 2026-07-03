import mongoose from 'mongoose';

const HomeVideoSchema = new mongoose.Schema({
  slot: { type: Number, required: true, unique: true },
  url: { type: String, required: true },
  hashtag: { type: String, default: '#Anello' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  link: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.HomeVideo || mongoose.model('HomeVideo', HomeVideoSchema);
