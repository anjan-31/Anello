import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, message, website } = await req.json();

    if (website) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Sending to the same email as per user request
      subject: `New Support Request from ${name || 'Customer'}`,
      text: `
        Name: ${name || 'N/A'}
        Email: ${email || 'N/A'}
        Message: ${message}
      `,
      replyTo: email || undefined
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Support email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
