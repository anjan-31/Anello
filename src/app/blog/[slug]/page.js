import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { BLOG_CONTENT } from '@/lib/blog-content';
import { buildArticleSchema, buildBreadcrumbSchema, buildFAQSchema } from '@/lib/seo';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) return { title: 'Article Not Found | Anello' };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Anello Editorial Team'],
      url: `https://www.anellostore.com/blog/${post.slug}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  const postContent = BLOG_CONTENT[slug];
  if (!postContent) notFound();

  const articleSchema = buildArticleSchema(post);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);
  const faqSchema = buildFAQSchema(postContent.faqs);

  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  // Dynamic products recommendation
  let recommendedProducts = [];
  try {
    await connectDB();
    let categoryFilter = {};
    if (post.category === 'Engagement') {
      categoryFilter = { cat: /engagement/i };
    } else if (post.category === 'Diamonds' || slug.includes('diamond')) {
      categoryFilter = { cat: /diamond/i };
    } else if (post.category === 'Metals' || slug.includes('gold')) {
      categoryFilter = { cat: /gold/i };
    } else if (slug.includes('silver')) {
      categoryFilter = { cat: /silver/i };
    }
    recommendedProducts = await Product.find(categoryFilter).limit(3).lean();
    if (recommendedProducts.length < 2) {
      recommendedProducts = await Product.find({}).limit(3).lean();
    }
  } catch (err) {
    console.error('Failed to fetch recommendations for blog:', err);
  }

  // Parse markdown-style content
  const paragraphs = postContent.content.trim().split('\n').filter(l => l.trim());

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem 5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ padding: '1.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <Link href="/blog" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Blog</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--text)' }}>{post.title}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ background: '#d4af37', color: '#fff', padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              {post.category}
            </span>
            <time dateTime={post.date} style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{post.dateDisplay}</time>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>· {post.readTime}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{post.excerpt}</p>
        </header>

        {/* Article Content */}
        <article style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '1rem' }}>
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) {
              return <h2 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', margin: '3rem 0 1.2rem', borderBottom: '1px solid var(--border2)', paddingBottom: '0.5rem' }}>{para.replace('## ', '')}</h2>;
            }
            if (para.startsWith('### ')) {
              return <h3 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text)', margin: '2rem 0 0.75rem' }}>{para.replace('### ', '')}</h3>;
            }
            if (para.startsWith('**') && para.endsWith('**')) {
              return <p key={i} style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>{para.replace(/\*\*/g, '')}</p>;
            }
            if (para.startsWith('- ')) {
              return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{para.replace('- ', '')}</li>;
            }
            if (para.startsWith('| ')) {
              return null; // Skip table rows for simplicity
            }
            // Handle inline links — replace markdown [text](url) with plain text + link for server component
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const parts = [];
            let lastIndex = 0;
            let match;
            while ((match = linkRegex.exec(para)) !== null) {
              if (match.index > lastIndex) parts.push(para.slice(lastIndex, match.index));
              parts.push(<Link key={match.index} href={match[2]} style={{ color: '#d4af37', textDecoration: 'underline' }}>{match[1]}</Link>);
              lastIndex = match.index + match[0].length;
            }
            if (lastIndex < para.length) parts.push(para.slice(lastIndex));
            return <p key={i} style={{ marginBottom: '1.2rem' }}>{parts.length > 0 ? parts : para}</p>;
          })}
        </article>

        {/* Recommended Products Callout */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <div style={{
            margin: '3rem 0',
            padding: '2rem',
            background: 'linear-gradient(135deg, #fffcf0, #faf5e6)',
            border: '1px solid rgba(184, 134, 11, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(184, 134, 11, 0.05)'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              color: '#8b6508',
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>💍</span> Featured Rings in this Category
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              {recommendedProducts.map((p) => (
                <Link
                  key={p._id.toString()}
                  href={`/products/${p.slug}`}
                  style={{
                    textDecoration: 'none',
                    background: '#ffffff',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(184, 134, 11, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease'
                  }}
                  className="reco-card"
                >
                  <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '0.8rem' }}>
                    <img
                      src={p.images?.[0] || p.img || '/placeholder.png'}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <h4 style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#1a1208',
                    margin: '0 0 0.4rem',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {p.name}
                  </h4>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#b8860b',
                    marginTop: 'auto'
                  }}>
                    ₹{p.price?.toLocaleString('en-IN')}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author + Share */}
        <div style={{ margin: '4rem 0', padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#d4af37,#c8a028)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
            ✍️
          </div>
          <div>
            <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.25rem' }}>Anello Editorial Team</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>India's fine jewelry experts — curating insights on diamonds, gold, craftsmanship, and style for over a decade.</span>
          </div>
        </div>

        {/* FAQ Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {postContent.faqs.map((faq, i) => (
              <details key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
                <summary style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer', fontSize: '0.98rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  {faq.q}
                  <span style={{ color: '#d4af37' }}>+</span>
                </summary>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7, fontSize: '0.93rem' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '20px', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '1rem' }}>
            Ready to Find Your Perfect Ring?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Browse Anello's certified diamond, gold & silver rings — all BIS Hallmarked with free Pan-India shipping.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/engagement-rings" style={{ padding: '0.9rem 2rem', background: 'linear-gradient(135deg,#d4af37,#c8a028)', color: '#fff', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>
              💍 Shop Engagement Rings
            </Link>
            <Link href="/diamond-rings" style={{ padding: '0.9rem 2rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', color: 'var(--text)', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>
              Diamond Rings
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
            Related Articles
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {relatedPosts.map(rel => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>📖</span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{rel.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{rel.dateDisplay} · {rel.readTime}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
