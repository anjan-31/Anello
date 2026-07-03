import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import Product from '@/models/Product';
import User from '@/models/User';
import Order from '@/models/Order';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Visitor Analytics
    const totalVisitors = await AnalyticsEvent.distinct('visitorId').exec();
    
    // Realtime active users (distinct visitors in last 10 mins)
    const activeUsers = await AnalyticsEvent.distinct('visitorId', {
      createdAt: { $gte: tenMinsAgo }
    }).exec();

    // 2. Traffic over last 30 days (daily breakdown)
    const trafficDaily = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view', createdAt: { $gte: thirtyDaysAgo } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" }
        }
      },
      { $project: { date: "$_id", views: 1, visitors: { $size: "$uniqueVisitors" } } },
      { $sort: { date: 1 } }
    ]);

    // 3. Traffic Source Breakdown
    const trafficSources = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: "$trafficSource", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count" } }
    ]);

    // 4. Device Breakdown
    const devices = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count" } }
    ]);

    // 5. Browser Breakdown
    const browsers = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'page_view' } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count" } }
    ]);

    // 6. Product Analytics
    const productViews = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'product_view', productId: { $ne: null } } },
      { $group: { _id: "$productId", views: { $sum: 1 }, uniqueViews: { $addToSet: "$visitorId" } } },
      { $project: { productId: "$_id", views: 1, uniqueViews: { $size: "$uniqueViews" } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Populate product details
    const populatedProductViews = await Product.populate(productViews, { path: 'productId', select: 'name cat price images' });

    // 7. General user stats
    const totalRegistered = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const addToCartEvents = await AnalyticsEvent.countDocuments({ eventType: 'add_to_cart' });

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalVisitors: totalVisitors.length,
          activeUsers: activeUsers.length,
          totalRegistered,
          totalOrders,
          addToCartEvents
        },
        trafficDaily,
        trafficSources,
        devices,
        browsers,
        topProducts: populatedProductViews
      }
    });

  } catch (error) {
    console.error('Fetch dashboard analytics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
