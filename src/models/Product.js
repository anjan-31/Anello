import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  cat: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  stock: { type: Number, required: true },
  sold: { type: Number, default: 0 },
  emoji: { type: String, default: '💍' },
  badge: { type: String, default: null },
  isNewArrival: { type: Boolean, default: false, index: true },
  isStylish: { type: Boolean, default: false, index: true },
  isBestSeller: { type: Boolean, default: false, index: true },
  isExclusive: { type: Boolean, default: false },
  description: { type: String, default: '' },
  images: { type: [String], default: [] },
  video: { type: String, default: '' },
  material: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
}, { timestamps: true });

// Add compound index for better query performance
ProductSchema.index({ isNewArrival: 1, createdAt: -1 });
ProductSchema.index({ isStylish: 1, createdAt: -1 });
ProductSchema.index({ isBestSeller: 1, createdAt: -1 });
ProductSchema.index({ cat: 1, createdAt: -1 });

delete mongoose.models.Product;
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
