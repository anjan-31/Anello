import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req) {
  try {
    await connectDB();
    const count = await Product.countDocuments({});
    return NextResponse.json({ success: true, totalProducts: count, count: count });
  } catch (error) {
    console.error('API GET Seed Status Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
