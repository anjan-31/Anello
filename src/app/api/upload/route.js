import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { image } = await req.json();
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary credentials missing in .env.local' }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureString = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

    const formData = new FormData();
    formData.append('file', image);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      return NextResponse.json({ url: data.secure_url }, { status: 200 });
    } else {
      return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
