import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'product_view', 'add_to_cart', 'purchase', 'login', 'signup', 'custom']
  },
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  url: {
    type: String,
    required: true
  },
  pathname: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: ''
  },
  device: {
    type: String,
    enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'],
    default: 'Unknown'
  },
  browser: {
    type: String,
    default: 'Unknown'
  },
  trafficSource: {
    type: String,
    enum: ['Direct', 'Google', 'Facebook', 'Instagram', 'Referral', 'Other'],
    default: 'Direct'
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  city: {
    type: String,
    default: 'Unknown'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Index for efficient querying of dates
analyticsEventSchema.index({ createdAt: 1 });
analyticsEventSchema.index({ eventType: 1 });

const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', analyticsEventSchema);

export default AnalyticsEvent;
