import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Best Sellers - Anello',
  description: 'Discover our most cherished pieces, beloved by jewellery enthusiasts around the world.',
};

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

export default async function BestSellersPage() {
  await connectDB();
  const products = await Product.find({ isBestSeller: true }).lean();

  return (
    <div style={{ background: '#fffde7', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        <nav aria-label="breadcrumb" style={{ padding: '1.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--text)' }}>Best Sellers</span>
        </nav>

        <header className="cat-hero-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div className="cat-hero-left" style={{ flex: 'none', maxWidth: '800px' }}>
            <p className="cat-hero-eyebrow">Anello Collection</p>
            <h1 className="cat-hero-title">Best Sellers</h1>
            <p className="cat-hero-desc">Discover our most cherished pieces, beloved by jewellery enthusiasts around the world.</p>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <TrustBadge icon="🏅" label="BIS Hallmarked" sub="Government certified purity" />
          <TrustBadge icon="💎" label="IGI/GIA Certified" sub="Lab certified diamonds" />
          <TrustBadge icon="🚚" label="Free Pan-India Shipping" sub="On all orders" />
          <TrustBadge icon="↩️" label="7-Day Returns" sub="Hassle-free & easy" />
          <TrustBadge icon="0️⃣" label="0% Making Charges" sub="On select designs" />
        </div>

        <section aria-label={`Best Sellers Products`}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Our Best Sellers
          </h2>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.2rem' }}>No best sellers found. Browse our full <Link href="/collections" style={{ color: '#d4af37' }}>collection</Link>.</p>
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
      </div>
      <Footer />
    </div>
  );
}
