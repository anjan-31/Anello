import connectDB from '@/lib/db';
import Product from '@/models/Product';

const BASE_URL = 'https://www.anellostore.com';

// Static public images with full SEO metadata
const STATIC_IMAGES = [
  { loc: '/', url: '/logo.png', title: 'Anello Store — Premium Fine Rings India', caption: 'Anello Store logo — Buy gold, diamond and silver rings online in India' },
  { loc: '/', url: '/ring1.png', title: 'Luxury Diamond Ring — Anello Store India', caption: '18K gold diamond ring by Anello — BIS Hallmarked, IGI Certified' },
  { loc: '/', url: '/ring2.png', title: 'Gold Ring Online India — Anello', caption: '22K yellow gold ring — handcrafted, BIS Hallmarked, free shipping India' },
  { loc: '/', url: '/ring3.png', title: 'Silver Gemstone Ring — Anello Store', caption: '925 sterling silver natural gemstone ring — Anello fine jewelry India' },
  { loc: '/', url: '/ring4.png', title: 'Engagement Ring for Women India — Anello', caption: 'Premium engagement ring for women — certified diamond, gold setting' },
  { loc: '/', url: '/ring5.png', title: 'Couple Ring Set India — Anello', caption: 'His and her couple ring set — gold, silver, diamond options' },
  { loc: '/', url: '/ring6.png', title: 'Rose Gold Diamond Ring India — Anello', caption: '18K rose gold diamond halo ring — IGI certified, BIS Hallmarked' },
  { loc: '/', url: '/ring7.png', title: 'Minimalist Gold Band India — Anello', caption: 'Ultra-thin 18K gold minimalist ring — daily wear, stackable' },
  { loc: '/', url: '/ring8.png', title: 'Bridal Ring Set India — Anello Store', caption: 'Luxury bridal ring set — diamond solitaire with matching band' },
  { loc: '/diamond-rings', url: '/diamond_cat.png', title: 'Diamond Rings Online India — Anello Collection', caption: 'Certified diamond rings collection — IGI/GIA certified, BIS Hallmarked gold' },
  { loc: '/diamond-rings', url: '/diamond_cat_new.png', title: 'New Diamond Ring Designs India 2026 — Anello', caption: 'New arrival diamond rings — oval, solitaire, halo styles' },
  { loc: '/diamond-rings', url: '/diamond_cat_genz.png', title: 'Modern Diamond Rings India — Anello', caption: 'Contemporary diamond ring designs for modern Indian women' },
  { loc: '/diamond-rings', url: '/diamond_cat_onhand.png', title: 'Diamond Ring on Hand — Anello India', caption: 'IGI certified diamond ring worn on hand — Anello Store India' },
  { loc: '/gold-rings', url: '/gold_cat.png', title: 'Gold Rings Online India — BIS Hallmarked 22K 18K', caption: 'BIS Hallmarked 22K yellow gold rings — Anello India collection' },
  { loc: '/gold-rings', url: '/gold_cat_new.png', title: 'New Gold Ring Designs India 2026 — Anello', caption: 'New arrival gold ring designs — 22K and 18K BIS Hallmarked' },
  { loc: '/gold-rings', url: '/gold_cat_genz.png', title: 'Modern Gold Rings India — Anello Store', caption: 'Contemporary 18K gold rings for modern Indian women — Anello' },
  { loc: '/gold-rings', url: '/gold_cat_ornate.png', title: 'Ornate Gold Bridal Rings India — Anello', caption: 'Traditional ornate gold bridal ring — 22K, BIS Hallmarked, free shipping' },
  { loc: '/silver-rings', url: '/silver_cat.png', title: 'Sterling Silver Rings Online India — 925 Silver', caption: '925 sterling silver rings — natural gemstones, anti-tarnish rhodium plating' },
  { loc: '/silver-rings', url: '/silver_cat_new.png', title: 'New Silver Ring Designs India 2026 — Anello', caption: 'New 925 sterling silver ring designs — Anello fine jewelry India' },
  { loc: '/silver-rings', url: '/silver_cat_onhand.png', title: 'Silver Ring on Hand India — Anello Store', caption: '925 sterling silver natural gemstone ring worn on hand — Anello India' },
  { loc: '/', url: '/promo_jewelry_1.png', title: 'Premium Jewelry Rings India — Anello Store', caption: 'Anello premium fine jewelry collection — gold, diamond, silver rings India' },
  { loc: '/', url: '/promo_jewelry_2.png', title: 'Fine Jewelry Collection India — Anello', caption: 'Anello fine jewelry rings — luxury craftsmanship, BIS Hallmarked, IGI certified' },
  { loc: '/silver-rings', url: '/promo_silver_1.png', title: 'Sterling Silver Jewelry India — Anello Collection', caption: 'Anello 925 sterling silver jewelry collection — natural gemstones, India' },
  { loc: '/silver-rings', url: '/promo_silver_2.png', title: 'Silver Ring Collection India — Anello Store', caption: 'Premium silver ring collection — natural gemstones, rhodium plating, India' },
  { loc: '/', url: '/stylish_model.png', title: 'Luxury Ring Styling India — Anello Store', caption: 'Premium ring styling inspiration — Anello luxury jewelry India' },
  { loc: '/', url: '/M1_v2.jpg', title: 'Diamond Ring Model India — Anello', caption: 'Model wearing Anello diamond ring — premium fine jewelry India' },
  { loc: '/', url: '/M2_v2.jpg', title: 'Gold Ring Styling India — Anello Store', caption: 'Anello gold ring worn by model — luxury jewelry India 2026' },
  { loc: '/', url: '/M3_v2.jpg', title: 'Silver Ring on Model — Anello India', caption: 'Anello sterling silver ring — model styling, fine jewelry India' },
  { loc: '/', url: '/M4_v2.jpg', title: 'Couple Ring Set India — Anello Store', caption: 'His and her couple ring set — Anello fine jewelry, India' },
];

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let productImages = [];

  try {
    await connectDB();
    const products = await Product.find(
      { images: { $exists: true, $not: { $size: 0 } } },
      { slug: 1, name: 1, images: 1, cat: 1, material: 1 }
    ).lean();

    productImages = products.flatMap(p =>
      (p.images || []).slice(0, 3).map((imgUrl, i) => ({
        loc: `/products/${p.slug}`,
        url: imgUrl,
        title: `${p.name} — Buy Online at Anello India`,
        caption: `${p.name} — ${p.material || p.cat} ring by Anello. BIS Hallmarked, free shipping across India.`,
      }))
    );
  } catch (e) {
    console.error('Image sitemap: product fetch failed:', e.message);
  }

  const allImages = [...STATIC_IMAGES, ...productImages];

  // Group by page URL
  const pageMap = new Map();
  for (const img of allImages) {
    const pageUrl = `${BASE_URL}${img.loc}`;
    if (!pageMap.has(pageUrl)) pageMap.set(pageUrl, []);
    const imgUrl = img.url.startsWith('http') ? img.url : `${BASE_URL}${img.url}`;
    pageMap.get(pageUrl).push({
      url: imgUrl,
      title: img.title,
      caption: img.caption,
    });
  }

  const urlEntries = Array.from(pageMap.entries())
    .map(([pageUrl, images]) => {
      const imageXml = images.map(img => `
    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
      <image:geo_location>India</image:geo_location>
    </image:image>`).join('');

      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>${imageXml}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}
