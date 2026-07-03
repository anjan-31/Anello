import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomeVideo from '@/models/HomeVideo';

// Cache for 60 seconds
export const revalidate = 60;

export async function GET() {
  await dbConnect();
  try {
    // Use lean() for faster read-only queries
    const videos = await HomeVideo.find({}).sort({ slot: 1 }).lean();
    return NextResponse.json(videos);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { slot, url, hashtag, productId, link } = body;
    
    const video = await HomeVideo.findOneAndUpdate(
      { slot },
      { url, hashtag, productId: productId || null, link: link || '' },
      { upsert: true, new: true }
    );
    
    return NextResponse.json(video);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
