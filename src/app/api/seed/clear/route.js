import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function DELETE(req) {
  try {
    await connectDB();
    const result = await Product.deleteMany({});
    return NextResponse.json({ success: true, message: 'All products cleared', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('API DELETE Seed Clear Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
