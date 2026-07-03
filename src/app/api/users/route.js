import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password');
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
