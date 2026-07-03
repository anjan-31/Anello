import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import AnalyticsEvent from '@/models/AnalyticsEvent';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for AnalyticsEvent');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

function parseUserAgent(userAgent) {
  const ua = (userAgent || '').toLowerCase();
  
  // Basic Device Detection
  let device = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = 'Tablet';
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device = 'Mobile';
  }

  // Basic Browser Detection
  let browser = 'Unknown';
  if (ua.includes('edg/')) {
    browser = 'Edge';
  } else if (ua.includes('chrome') || ua.includes('crios')) {
    browser = 'Chrome';
  } else if (ua.includes('firefox') || ua.includes('fxios')) {
    browser = 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('opera') || ua.includes('opr/')) {
    browser = 'Opera';
  }

  return { device, browser };
}

function detectTrafficSource(referrer) {
  const ref = (referrer || '').toLowerCase();
  if (!ref) return 'Direct';
  if (ref.includes('google.')) return 'Google';
  if (ref.includes('facebook.com')) return 'Facebook';
  if (ref.includes('instagram.com')) return 'Instagram';
  if (ref.includes('bing.') || ref.includes('yahoo.')) return 'Other';
  return 'Referral';
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const headersList = req.headers;
    const userAgent = headersList.get('user-agent') || '';
    
    const { device, browser } = parseUserAgent(userAgent);
    const trafficSource = detectTrafficSource(data.referrer);

    const event = new AnalyticsEvent({
      eventType: data.eventType || 'page_view',
      visitorId: data.visitorId,
      userId: data.userId || null,
      url: data.url,
      pathname: data.pathname,
      referrer: data.referrer || '',
      device,
      browser,
      trafficSource,
      productId: data.productId || null,
      metadata: data.metadata || {}
    });

    await event.save();
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Analytics track error:', error);
    // Return 200 even on error so client side isn't blocked by tracking errors
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 200 });
  }
}
