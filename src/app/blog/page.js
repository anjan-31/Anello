import Link from 'next/link';
import { buildArticleSchema } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/blog-posts';

export const metadata = {
  title: 'Jewelry Blog & Guides | Diamond, Gold & Ring Tips | Anello',
  description: 'Expert jewelry guides, diamond buying tips, ring size charts, and styling advice from Anello — India\'s premium fine jewelry brand.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Jewelry Blog & Expert Guides | Anello Store',
    description: 'Read diamond buying guides, ring trends, and styling tips from Anello experts.',
    type: 'website',
  },
};


const CATEGORY_COLORS = {
  'Engagement': '#e91e8c',
  'Guides': '#d4af37',
  'Diamonds': '#6366f1',
  'Metals': '#059669',
  'Trends': '#f59e0b',
  'Couples': '#ec4899',
  'Buying Guide': '#7c3aed',
  'Gifts': '#dc2626',
};

export default function BlogPage() {
  const listingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Anello Jewelry Blog',
    url: 'https://www.anellostore.com/blog',
    description: 'Expert jewelry guides, diamond buying tips, and ring trends from Anello India.',
    publisher: { '@type': 'Organization', name: 'Anello Store' },
    blogPost: BLOG_POSTS.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://www.anellostore.com/blog/${post.slug}`,
      datePublished: post.date,
      author: { '@type': 'Organization', name: 'Anello Editorial Team' },
    })),
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '90px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }} />

      {/* Hero */}
      <header style={{ textAlign: 'center', padding: '3rem 2rem 4rem', borderBottom: '1px solid var(--border2)', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '4px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '1rem' }}>
          The Anello Journal
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.1 }}>
          Jewelry Guides & <em>Expert Tips</em>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
          Expert advice on diamonds, gold, ring styles, and everything you need to know before buying fine jewelry in India.
        </p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem 5rem' }}>

        {/* Featured Post */}
        <article style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '20px', overflow: 'hidden', marginBottom: '3rem' }}>
          <div style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
              <span style={{ background: CATEGORY_COLORS[BLOG_POSTS[0].category], color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                {BLOG_POSTS[0].category}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{BLOG_POSTS[0].dateDisplay} · {BLOG_POSTS[0].readTime}</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.2 }}>
              <Link href={`/blog/${BLOG_POSTS[0].slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {BLOG_POSTS[0].title}
              </Link>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
              {BLOG_POSTS[0].excerpt}
            </p>
            <Link href={`/blog/${BLOG_POSTS[0].slug}`} style={{ color: '#d4af37', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem' }}>
              Read full guide →
            </Link>
          </div>
        </article>

        {/* All Posts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '2rem' }}>
          {BLOG_POSTS.slice(1).map(post => (
            <article key={post.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ background: CATEGORY_COLORS[post.category], color: '#fff', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {post.category}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{post.dateDisplay} · {post.readTime}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {post.title}
                </Link>
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem', fontSize: '0.93rem' }}>
                {post.excerpt}
              </p>
              <Link href={`/blog/${post.slug}`} style={{ color: '#d4af37', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem' }}>
                Read article →
              </Link>
            </article>
          ))}
        </div>

        {/* Internal Links CTA */}
        <div style={{ marginTop: '5rem', textAlign: 'center', padding: '3rem', background: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '1rem' }}>
            Ready to Find Your Ring?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Browse our full collection of certified diamond, gold, and silver rings.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/diamond-rings" style={{ padding: '0.8rem 1.8rem', background: 'linear-gradient(135deg,#d4af37,#c8a028)', color: '#fff', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>
              Diamond Rings
            </Link>
            <Link href="/engagement-rings" style={{ padding: '0.8rem 1.8rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', color: 'var(--text)', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>
              Engagement Rings
            </Link>
            <Link href="/gold-rings" style={{ padding: '0.8rem 1.8rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', color: 'var(--text)', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>
              Gold Rings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
