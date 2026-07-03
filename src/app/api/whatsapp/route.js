import { NextResponse } from 'next/server';

export async function GET() {
  const number = process.env.WHATSAPP_NUMBER || '919545457711';
  return NextResponse.redirect(`https://wa.me/${number}`);
}
