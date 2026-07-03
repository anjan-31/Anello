import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { BLOG_POSTS } from '@/lib/blog-posts';

export default async function sitemap() {
  const BASE_URL = 'https://www.anelloworld.com';
  const now = new Date();

  // Core static pages
  const staticPages = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/collections`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/trust`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/refund-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/shipping-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // SEO Category pages
  const categories = [
    'diamond-rings', 'gold-rings', 'silver-rings',
    'engagement-rings', 'couple-rings', 'bridal-rings',
    'minimalist-rings', 'luxury-rings',
  ];
  const categoryPages = categories.map(slug => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Blog post pages
  const blogPages = BLOG_POSTS.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  // Dynamic product pages from MongoDB
  let productPages = [];
  try {
    await connectDB();
    const products = await Product.find({ slug: { $exists: true } }).select('slug updatedAt').lean();
    productPages = products.map(p => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt || now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch products:', e.message);
  }

  return [...staticPages, ...categoryPages, ...blogPages, ...productPages];
}
