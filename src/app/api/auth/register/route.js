import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, website } = await req.json();
    
    if (website) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    
    const user = await User.create({ name, email, password });
    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser.token = safeUser._id.toString();
    
    return NextResponse.json(safeUser, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
