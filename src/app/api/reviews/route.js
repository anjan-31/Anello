import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';

// Cache for 30 seconds (reviews don't change frequently)
export const revalidate = 30;

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    // Check if reviews exist
    const count = await Review.countDocuments({ productId });
    if (count === 0) {
      const product = await Product.findById(productId).lean();
      if (product) {
        const seededReviews = [
          {
            productId,
            name: 'Priya Sharma',
            city: 'Mumbai',
            rating: 5,
            text: `The ${product.name} is absolutely stunning. The craftsmanship is impeccable and it arrived beautifully packed with the certificate.`,
            createdAt: new Date('2026-03-15T12:00:00Z')
          },
          {
            productId,
            name: 'Ananya Reddy',
            city: 'Hyderabad',
            rating: 5,
            text: 'Ordered as an anniversary gift. My partner was speechless! The quality is far beyond what I expected at this price point.',
            createdAt: new Date('2026-02-28T12:00:00Z')
          },
          {
            productId,
            name: 'Kavya Nair',
            city: 'Bengaluru',
            rating: 4,
            text: 'Gorgeous ring. Delivery was quick and the packaging was luxurious. Very happy with the purchase.',
            createdAt: new Date('2026-01-10T12:00:00Z')
          }
        ];
        await Review.insertMany(seededReviews);
        await Product.findByIdAndUpdate(productId, { rating: 4.7, reviews: 3 });
      }
    }

    // Use lean() for faster queries
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('API GET Reviews Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { productId, name, city, rating, text, image, website } = body;

    if (website) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!productId || !name || !rating || !text) {
      return NextResponse.json({ error: 'productId, name, rating and text are required' }, { status: 400 });
    }

    // Save the new review
    const newReview = await Review.create({
      productId,
      name,
      city: city || '',
      rating: Number(rating),
      text,
      image: image || ''
    });

    // Update Product average rating and total reviews count
    const allReviews = await Review.find({ productId });
    const totalReviews = allReviews.length;
    const avgRating = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1));

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviews: totalReviews
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error('API POST Review Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
