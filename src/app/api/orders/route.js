import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import mongoose from 'mongoose';
import { sendOrderEmails, sendStatusUpdateEmail } from '@/lib/mailer';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (body.website) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Map mobile payload to website schema
    if (body.address && typeof body.address === 'object') {
      body.addressDetails = {
        fullName: body.address.name || '',
        phone: body.address.phone || '',
        fullAddress: `${body.address.line1 || ''}${body.address.line2 ? ', ' + body.address.line2 : ''}`,
        city: body.address.city || '',
        state: body.address.state || '',
        pincode: body.address.pincode || ''
      };
      body.address = body.addressDetails.fullAddress;
      body.phone = body.addressDetails.phone;
      if (!body.customerName) {
        body.customerName = body.addressDetails.fullName;
      }
    }

    if (body.userId && mongoose.Types.ObjectId.isValid(body.userId)) {
      const user = await User.findById(body.userId);
      if (user) {
        if (!body.customerEmail) body.customerEmail = user.email;
        if (!body.customerName) body.customerName = user.name;
      }
    }

    // Ensure customerEmail is present (fallback to dummy if still missing)
    if (!body.customerEmail) {
      body.customerEmail = 'customer@anelloworld.com';
    }
    if (!body.customerName) {
      body.customerName = 'Valued Customer';
    }

    // Map items fields (e.g. img -> image)
    if (Array.isArray(body.items)) {
      body.items = body.items.map(item => ({
        ...item,
        image: item.image || item.img || ''
      }));
    }
    
    // Calculate the next sequential orderId (starting at 202601)
    const lastOrder = await Order.findOne({ orderId: { $exists: true } }).sort({ orderId: -1 });
    const nextOrderId = lastOrder && lastOrder.orderId ? lastOrder.orderId + 1 : 202601;
    body.orderId = nextOrderId;
    
    // Create order
    const order = await Order.create(body);
    
    // Update stock and sold counts
    for (const item of body.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.qty, sold: item.qty }
        });
      }
    }
    
    // Send email notifications
    try {
      await sendOrderEmails(order);
    } catch (emailError) {
      console.error('Failed to send order emails:', emailError);
    }
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const { id, status } = await req.json();
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    if (order) {
      try {
        await sendStatusUpdateEmail(order);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
