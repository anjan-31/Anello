import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const lastOrder = await Order.findOne({ customerEmail: email })
      .sort({ createdAt: -1 })
      .select('addressDetails');

    if (lastOrder && lastOrder.addressDetails) {
      return NextResponse.json(lastOrder.addressDetails);
    }
    
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
