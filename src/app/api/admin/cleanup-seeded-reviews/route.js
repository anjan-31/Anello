import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

// One-time cleanup: removes auto-seeded fake reviews and resets product ratings to 0
export async function DELETE() {
  try {
    await connectDB();

    const seededNames = ['Priya Sharma', 'Ananya Reddy', 'Kavya Nair'];

    // Find all seeded reviews
    const seededReviews = await Review.find({ name: { $in: seededNames } }).lean();
    const affectedProductIds = [...new Set(seededReviews.map(r => r.productId?.toString()).filter(Boolean))];

    // Delete seeded reviews
    const deleteResult = await Review.deleteMany({ name: { $in: seededNames } });

    // For each affected product, recalculate real review count & rating
    for (const productId of affectedProductIds) {
      const realReviews = await Review.find({ productId }).lean();
      const count = realReviews.length;
      const avg = count > 0 ? realReviews.reduce((s, r) => s + r.rating, 0) / count : 0;
      await Product.findByIdAndUpdate(productId, { reviews: count, rating: avg });
    }

    return NextResponse.json({
      message: 'Cleanup done',
      deletedReviews: deleteResult.deletedCount,
      productsReset: affectedProductIds.length
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
