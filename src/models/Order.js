import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: Number,
    emoji: String,
    image: String,
    ringSize: { type: Number, default: null }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'processing' },
  address: { type: String, required: false },
  addressDetails: {
    fullName: { type: String },
    phone: { type: String },
    fullAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  phone: { type: String, required: false },
  paymentMethod: { type: String, default: 'COD' },
  orderId: { type: Number }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
