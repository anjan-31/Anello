import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    let email = searchParams.get('email');
    
    // Check Authorization header for mobile app compatibility
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (mongoose.Types.ObjectId.isValid(token)) {
        const user = await User.findById(token);
        if (user) {
          email = user.email;
        }
      }
    }
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Search by customerEmail or userId if we matched a user
    const userSearch = authHeader && authHeader.startsWith('Bearer ') && mongoose.Types.ObjectId.isValid(authHeader.split(' ')[1])
      ? authHeader.split(' ')[1]
      : null;

    const query = userSearch 
      ? { $or: [{ userId: userSearch }, { customerEmail: email }] }
      : { customerEmail: email };

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
