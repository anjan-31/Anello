import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { notFound, redirect } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  CATEGORY_CONFIG,
  generateCategoryMeta,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildItemListSchema,
  buildCollectionPageSchema,
} from '@/lib/seo';

// All valid category slugs
const VALID_SLUGS = Object.keys(CATEGORY_CONFIG);

const HERO_IMAGES = {
  'diamond-rings': '/diamond_cat_onhand.png',
  'gold-rings': '/gold_cat_ornate.png',
  'silver-rings': '/silver_cat_onhand.png',
};

export async function generateMetadata({ params }) {
  const { category } = await params;
  const normalized = category.replace(/_/g, '-');
  if (!VALID_SLUGS.includes(normalized)) return { title: 'Not Found' };
  return generateCategoryMeta(normalized);
}

function TrustBadge({ icon, label, sub }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      padding: '1.5rem 1rem', background: 'var(--card-bg)',
      border: '1px solid var(--border2)', borderRadius: '12px', textAlign: 'center', flex: 1,
    }}>
      <span style={{ fontSize: '2rem' }}>{icon}</span>
      <strong style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 700 }}>{label}</strong>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</span>
    </div>
  );
}

export default async function CategoryPage({ params }) {
  const { category: catSlug } = await params;

  // Auto-redirect underscore typos to correct hyphenated category slugs
  const normalizedSlug = catSlug.replace(/_/g, '-');
  if (normalizedSlug !== catSlug && VALID_SLUGS.includes(normalizedSlug)) {
    redirect(`/${normalizedSlug}`);
  }

  const config = CATEGORY_CONFIG[normalizedSlug];

  // Allow unknown slugs to fall through to DB-filtered pages
  if (!config) notFound();

  const heroImg = HERO_IMAGES[normalizedSlug] || '/placeholder.png';

  await connectDB();
  const query = config.filterStr
    ? { cat: { $regex: config.filterStr, $options: 'i' } }
    : {};
  const products = await Product.find(query).lean();

  const categoryTitle = normalizedSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: categoryTitle, path: `/${catSlug}` },
  ]);
  const faqSchema = buildFAQSchema(config.faqs);
  const itemListSchema = buildItemListSchema(products, categoryTitle, catSlug);
  const collectionPageSchema = buildCollectionPageSchema(catSlug, config, products);

  // Parse markdown-style headings in SEO content
  const contentParagraphs = config.content.trim().split('\n').filter(l => l.trim());

  return (
    <div style={{ background: '#fffde7', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />

      <Header />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 4rem' }}>

        {/* ── Breadcrumb ── */}
        <nav aria-label="breadcrumb" style={{ padding: '1.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--text)' }}>{categoryTitle}</span>
        </nav>

        {/* ── Hero Split Layout ── */}
        <header className="cat-hero-header">
          <div className="cat-hero-left">
            <p className="cat-hero-eyebrow">Anello Collection</p>
            <h1 className="cat-hero-title">{config.h1}</h1>
            <p className="cat-hero-desc">{config.intro}</p>
            <div className="cat-hero-btns">
              <Link href="/collections" className="cat-btn-primary">
                View All Collections →
              </Link>
              <Link href="/blog" className="cat-btn-secondary">
                Jewelry Guides
              </Link>
            </div>
          </div>
          <div className="cat-hero-right">
            <div className="cat-hero-img-wrap">
              <Image src={heroImg} alt={categoryTitle} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="cat-hero-img" />
            </div>
          </div>
        </header>

        {/* ── Trust Badges ── */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <TrustBadge icon="🏅" label="BIS Hallmarked" sub="Government certified purity" />
          <TrustBadge icon="💎" label="IGI/GIA Certified" sub="Lab certified diamonds" />
          <TrustBadge icon="🚚" label="Free Pan-India Shipping" sub="On all orders" />
          <TrustBadge icon="↩️" label="7-Day Returns" sub="Hassle-free & easy" />
          <TrustBadge icon="0️⃣" label="0% Making Charges" sub="On select designs" />
        </div>

        {/* ── Product Grid ── */}
        <section aria-label={`${categoryTitle} Products`}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Our {categoryTitle} Collection
          </h2>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.2rem' }}>More designs coming soon. Browse our full <Link href="/collections" style={{ color: '#d4af37' }}>collection</Link>.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1.5rem' }}>
              {products.map(p => (
                <Link
                  href={`/products/${p.slug}`}
                  key={p._id.toString()}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  aria-label={`View ${p.name}`}
                >
                  <article className="cat-product-card">
                    <div className="cat-img-zone" style={{ position: 'relative', height: '260px', overflow: 'hidden', background: 'var(--card-bg)' }}>
                      <div className="cat-img-container">
                        <Image
                          src={p.images?.[0] || p.img || '/placeholder.png'}
                          alt={p.name}
                          fill
                          className="cat-img-primary"
                          style={{ objectFit: 'cover', padding: '0' }}
                          sizes="(max-width:640px) 50vw, (max-width:1200px) 33vw, 260px"
                          loading="lazy"
                        />
                        {p.images?.[1] && (
                          <Image
                            src={p.images[1]}
                            alt={`${p.name} alternate view`}
                            fill
                            className="cat-img-secondary"
                            style={{ objectFit: 'cover', padding: '0' }}
                            sizes="(max-width:640px) 50vw, (max-width:1200px) 33vw, 260px"
                            loading="lazy"
                          />
                        )}
                      </div>
                      {p.badge && (
                        <span style={{ position: 'absolute', top: 10, left: 10, background: '#e91e8c', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '3px 9px', borderRadius: '20px' }}>
                          {p.badge}
                        </span>
                      )}
                      {p.isNewArrival && !p.badge && (
                        <span style={{ position: 'absolute', top: 10, left: 10, background: '#059669', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '3px 9px', borderRadius: '20px' }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.68rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>{p.cat}</div>
                      <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.4rem', lineHeight: 1.3 }}>{p.name}</h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>₹{p.price?.toLocaleString('en-IN')}</span>
                        {p.oldPrice && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.oldPrice?.toLocaleString('en-IN')}</span>}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── SEO Content ── */}
        <section style={{ marginTop: '5rem', maxWidth: '900px' }} aria-label="About this collection">
          <div style={{ borderLeft: '3px solid #d4af37', paddingLeft: '1.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '1rem' }}>
              About Our {categoryTitle}
            </h2>
          </div>
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.9, fontSize: '1rem' }}>
            {contentParagraphs.map((para, i) => {
              if (para.startsWith('## ')) {
                return <h2 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text)', margin: '2.5rem 0 1rem' }}>{para.replace('## ', '')}</h2>;
              }
              if (para.startsWith('### ')) {
                return <h3 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', margin: '2rem 0 0.8rem' }}>{para.replace('### ', '')}</h3>;
              }
              return <p key={i} style={{ marginBottom: '1rem' }}>{para}</p>;
            })}
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section style={{ marginTop: '4rem', maxWidth: '800px' }} aria-label="Frequently Asked Questions">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {config.faqs.map((faq, i) => (
              <details
                key={i}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}
              >
                <summary style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer', fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <span style={{ color: '#d4af37', fontWeight: 700 }}>+</span>
                </summary>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7, fontSize: '0.95rem' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Related Categories ── */}
        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
            Explore More Collections
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {VALID_SLUGS.filter(s => s !== catSlug).map(slug => {
              const label = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  style={{
                    padding: '0.6rem 1.4rem', borderRadius: '50px',
                    border: '1.5px solid var(--border2)', color: 'var(--text-muted)',
                    textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {label}
                </Link>
              );
            })}
            <Link href="/blog/diamond-buying-guide" style={{ padding: '0.6rem 1.4rem', borderRadius: '50px', border: '1.5px solid #d4af37', color: '#d4af37', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
              Diamond Buying Guide →
            </Link>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
