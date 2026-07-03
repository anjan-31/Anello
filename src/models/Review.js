import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  isSiteReview: { type: Boolean, default: false },
  name: { type: String, required: true },
  city: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  image: { type: String, default: '' }, // Optional review image
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
