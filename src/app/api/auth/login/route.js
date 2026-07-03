import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req) {
  try {
    await connectDB();
    
    // Get client IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    
    // 1. Rate Limiting (Max 5 attempts per minute per IP)
    const limitCheck = rateLimit(ip, 5, 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { email, password, website, recaptchaToken } = await req.json();
    
    // 2. Honeypot check
    if (website) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // 3. Google reCAPTCHA v3 verification
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (secretKey && secretKey !== '6Ld-mock-secret-key-here-xxxx') {
      if (!recaptchaToken) {
        return NextResponse.json({ error: 'Verification token is missing. Please try again.' }, { status: 400 });
      }
      try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
        const verifyRes = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = await verifyRes.json();
        
        if (!verifyData.success || verifyData.score < 0.5) {
          return NextResponse.json({ error: 'Verification failed. Bot activity detected.' }, { status: 400 });
        }
      } catch (err) {
        console.error('reCAPTCHA validation error:', err);
        // We log the error but allow the request to proceed if the Google verification service itself fails
      }
    }
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    const safeUser = user.toObject();
    delete safeUser.password;
    safeUser.token = safeUser._id.toString();
    return NextResponse.json(safeUser);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
