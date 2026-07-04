import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

// Hard reset: delete ALL seeded reviews AND reset all product review counts from actual Review docs
export async function DELETE() {
  try {
    await connectDB();

    const seededNames = ['Priya Sharma', 'Ananya Reddy', 'Kavya Nair'];

    // 1. Delete all seeded reviews
    const deleteResult = await Review.deleteMany({ name: { $in: seededNames } });

    // 2. Reset ALL products: set reviews=0, rating=0 first
    await Product.updateMany({}, { $set: { reviews: 0, rating: 0 } });

    // 3. Recalculate for products that have REAL reviews
    const realReviews = await Review.aggregate([
      { $group: { _id: '$productId', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
    ]);

    for (const r of realReviews) {
      await Product.findByIdAndUpdate(r._id, {
        $set: { reviews: r.count, rating: Math.round(r.avgRating * 10) / 10 }
      });
    }

    return NextResponse.json({
      message: 'Full reset done',
      deletedReviews: deleteResult.deletedCount,
      productsWithRealReviews: realReviews.length
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
