import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import * as XLSX from 'xlsx';

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Koi file nahi mili' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Excel file khali hai' }, { status: 400 });
    }

    const products = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;

      // Support both your format (Name, Image, Price) and full format
      const name = String(row['Name'] || row['name'] || '').trim();
      const price = parseFloat(row['Price'] || row['price'] || 0);
      const imageUrl = String(row['Image'] || row['image'] || row['Images'] || row['images'] || '').trim();
      const cat = String(row['Category'] || row['cat'] || row['Cat'] || 'Silver Ring').trim() || 'Silver Ring';
      const stock = parseInt(row['Stock'] || row['stock'] || 1) || 1;
      const oldPrice = parseFloat(row['MRP'] || row['oldPrice'] || row['Old Price'] || 0) || null;
      const description = String(row['Description'] || row['description'] || '').trim();
      const material = String(row['Material'] || row['material'] || '925 Sterling Silver').trim();
      const badge = String(row['Badge'] || row['badge'] || '').trim() || null;

      if (!name) { errors.push(`Row ${rowNum}: Name missing`); continue; }
      if (!price || price <= 0) { errors.push(`Row ${rowNum}: Valid price missing`); continue; }

      // Images — single URL or comma-separated
      const images = imageUrl
        ? imageUrl.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      products.push({
        name,
        slug: slugify(name) + '-' + Date.now() + '-' + i,
        cat,
        price,
        oldPrice,
        stock,
        sold: 0,
        emoji: '💍',
        badge,
        isNewArrival: false,
        isStylish: false,
        isBestSeller: false,
        isExclusive: false,
        description,
        images,
        material,
        rating: 5,
      });
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'Koi valid product nahi mila', details: errors }, { status: 400 });
    }

    const inserted = await Product.insertMany(products, { ordered: false });

    return NextResponse.json({
      success: true,
      inserted: inserted.length,
      errors: errors.length > 0 ? errors : undefined,
      message: `${inserted.length} products successfully add ho gaye!`
    }, { status: 201 });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
