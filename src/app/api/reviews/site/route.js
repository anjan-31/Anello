import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    
    const reviews = await Review.find({ isSiteReview: true }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('API GET Site Reviews Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, city, rating, text, image, website } = body;

    if (website) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!name || !rating || !text) {
      return NextResponse.json({ error: 'name, rating and text are required' }, { status: 400 });
    }

    const newReview = await Review.create({
      isSiteReview: true,
      name,
      city: city || '',
      rating: Number(rating),
      text,
      image: image || ''
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error('API POST Site Review Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
