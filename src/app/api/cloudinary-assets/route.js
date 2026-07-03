import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
  }

  try {
    // Cloudinary Admin API to fetch video resources
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/video?max_results=50`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to fetch Cloudinary assets' }, { status: res.status });
    }

    // Simplify the response
    const videos = data.resources.map(r => ({
      public_id: r.public_id,
      url: r.secure_url,
      thumbnail: r.secure_url.replace(/\.[^/.]+$/, ".jpg"), // basic thumbnail guess
      created_at: r.created_at
    }));

    return NextResponse.json(videos);
  } catch (err) {
    console.error('Cloudinary fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
