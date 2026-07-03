import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { id, name, email, image } = await req.json();
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists but without googleId, we can optionally link them
      if (!user.googleId) {
        user.googleId = id;
        user.avatar = user.avatar || image;
        await user.save();
      }
    } else {
      // Create new user for google login
      user = await User.create({
        name,
        email,
        googleId: id,
        avatar: image
      });
    }
    
    const { password, ...safeUser } = user._doc;
    return NextResponse.json(safeUser);
  } catch (err) {
    console.error('Google Auth API Error:', err);
    return NextResponse.json({ error: 'Failed to authenticate with Google' }, { status: 500 });
  }
}
