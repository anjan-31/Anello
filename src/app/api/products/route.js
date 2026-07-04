import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Review from '@/models/Review';

// Allow 60 second cache instead of always forcing dynamic
export const revalidate = 60;

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(req) {
  try {
    await connectDB();
    
    // Get query parameters
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '500'), 500); // Max 500
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const onlyHome = url.searchParams.get('onlyHome') === 'true';
    const q = url.searchParams.get('q');
    const cat = url.searchParams.get('cat');
    
    // Build query conditions
    let query = {};
    const conditions = [];

    if (onlyHome) {
      conditions.push({
        $or: [
          { isBestSeller: true },
          { isStylish: true },
          { isNewArrival: true }
        ]
      });
    }

    if (cat && cat.trim().length > 0) {
      conditions.push({
        cat: { $regex: new RegExp('^' + cat.trim() + '$', 'i') }
      });
    }

    if (q && q.trim().length > 0) {
      conditions.push({
        $or: [
          { name: { $regex: q.trim(), $options: 'i' } },
          { description: { $regex: q.trim(), $options: 'i' } }
        ]
      });
    }

    if (conditions.length > 0) {
      query = { $and: conditions };
    }
    
    // Get products with limit and skip for pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(); // Use lean() for faster read-only queries

    // Bulk check for reviews instead of N+1 queries
    const productIds = products.map(p => p._id);
    const reviewCounts = await Review.aggregate([
      { $match: { productId: { $in: productIds } } },
      { $group: { _id: '$productId', count: { $sum: 1 } } }
    ]);
    
    const reviewCountMap = {};
    reviewCounts.forEach(r => {
      reviewCountMap[r._id.toString()] = r.count;
    });

    // Update products with review counts
    const updatedProducts = products.map(p => ({
      ...p,
      reviews: reviewCountMap[p._id.toString()] || 0,
      // Auto-generate slug if missing so links never become /products/undefined
      slug: p.slug || slugify(p.name)
    }));

    // Patch any products missing a slug in the DB (run silently in background)
    const missingSlug = products.filter(p => !p.slug);
    if (missingSlug.length > 0) {
      const bulkOps = missingSlug.map(p => ({
        updateOne: {
          filter: { _id: p._id },
          update: { $set: { slug: slugify(p.name) } }
        }
      }));
      Product.bulkWrite(bulkOps).catch(() => {});
    }

    return NextResponse.json(updatedProducts);
  } catch (error) {
    console.error('API GET Products Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.slug && body.name) {
      body.slug = slugify(body.name);
    }
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;
    if (!updateData.slug && updateData.name) {
      updateData.slug = slugify(updateData.name);
    }
    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
