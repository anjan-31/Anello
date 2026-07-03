import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Check if id is a valid ObjectId, otherwise treat it as a slug
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
    
    const product = await Product.findOne(query).lean();
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('API GET Product by ID Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
