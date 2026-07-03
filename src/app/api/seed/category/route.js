import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { category, products } = body;

    if (!category || !products) {
      return NextResponse.json({ error: 'category and products are required' }, { status: 400 });
    }

    let count = 0;
    for (const p of products) {
      p.cat = category;
      // Ensure slug is present and clean
      if (!p.slug && p.name) {
        p.slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      
      // Enforce number type formats
      if (p.rating !== undefined) p.rating = Number(p.rating);
      if (p.reviews !== undefined) p.reviews = Number(p.reviews);
      if (p.price !== undefined) p.price = Number(p.price);
      if (p.oldPrice !== undefined && p.oldPrice !== null) p.oldPrice = Number(p.oldPrice);
      if (p.stock !== undefined) p.stock = Number(p.stock);

      // Map singular 'img' from Flutter app to 'images' array if 'images' is not populated
      if (p.img && (!p.images || p.images.length === 0)) {
        p.images = [p.img];
      }

      await Product.findOneAndUpdate(
        { slug: p.slug },
        { $set: p },
        { upsert: true, new: true }
      );
      count++;
    }

    const totalCount = await Product.countDocuments({});
    return NextResponse.json({
      success: true,
      message: `Seeded ${count} products for category ${category}`,
      count: count,
      totalProducts: totalCount
    });
  } catch (error) {
    console.error('API POST Seed Category Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
