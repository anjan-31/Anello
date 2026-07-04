import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function DELETE() {
  try {
    await connectDB();
    const result = await Order.deleteMany({});
    return NextResponse.json({
      message: 'All orders deleted',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
