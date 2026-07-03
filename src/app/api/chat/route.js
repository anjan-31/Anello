import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

const GROQ_API_KEY = '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';

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, language } = body;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    await connectDB();
    const products = await Product.find({}).select('name slug price category material').lean();
    
    const productCatalog = products.map(p => `- Name: ${p.name}, Price: ₹${p.price}, Slug: ${p.slug}, Material: ${p.material || 'N/A'}`).join('\n');

    const langInstruction = language === 'hi' 
      ? "CRITICAL: Respond ONLY in Hindi. Do not use English." 
      : "CRITICAL: Respond ONLY in English. Do not use Hindi.";

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are the official chat bot for "Anello Fine Rings" website. 
            ${langInstruction}
            
            STRICT RULES:
            1. Only provide information about what is available on the Anello website.
            2. If asked about something not on the site, politely say that Anello specializes in premium rings and currently offers specific collections.
            3. CRITICAL: If the user asks to see rings, or if you recommend a specific ring from the catalog, you MUST output a product tag in this exact format: [PRODUCT: slug]. DO NOT use markdown links or markdown images. ONLY use the [PRODUCT: slug] tag. You can use this tag multiple times for different rings.
            
            CURRENT PRODUCT CATALOG (Live from database):
            ${productCatalog}
            
            WEBSITE CONTENT DETAILS:
            - Store Name: Anello Fine Rings.
            - Products: Handcrafted premium rings in Silver, Gold, and Diamond.
            - Categories: Silver Rings (Sterling Silver, Amethyst, Black Titanium), Gold Rings (18K & 22K Yellow/Rose Gold), Diamond Rings (Solitaires, Halo, Trilogy).
            - Key Services: BIS Hallmarked jewelry, Free Pan-India Shipping, 7-Day Hassle-free Returns, 0% Making Charges on Gold jewelry.
            - Trust: GIA/IGI Certified Diamonds, 500+ designs, 18K+ customers.
            - Support: Ring Size Guide, Order Tracking, Jewelry Care.
            - Contact Details: If asked for a phone number, ALWAYS and ONLY provide the official number: +91 95454 57711. NEVER use generic or placeholder numbers like 1234567890. Email: worldanello@gmail.com. Instagram ID: @world.anello
            
            Keep responses very short, professional, and friendly. Speak as if you are part of the Anello team.`
          },
          ...messages
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    const data = await groqResponse.json();
    
    if (!groqResponse.ok) {
      return NextResponse.json({ 
        error: data.error?.message || 'Groq API Error'
      }, { status: groqResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API Route Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
