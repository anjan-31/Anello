import Image from 'next/image';
import Link from 'next/link';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductGallery from '../../components/ProductGallery';
import AddToCartButtons from '../../components/AddToCartButtons';
import ProductTracker from '../../components/ProductTracker';
import {
  generateProductMeta,
  buildProductSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
} from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findOne({ slug: id }).lean();
  if (!product) return { title: 'Product Not Found | Anello' };
  return generateProductMeta(product);
}



function TrustRow() {
  const items = [
    { icon: '🏅', text: 'BIS Hallmarked' },
    { icon: '💎', text: 'IGI/GIA Certified' },
    { icon: '🚚', text: 'Free Shipping' },
    { icon: '🔒', text: 'Secure Checkout' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', margin: '1.5rem 0' }}>
      {items.map(item => (
        <div key={item.text} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.4rem 0.9rem', background: 'var(--bg2)',
          border: '1px solid var(--border2)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-muted)',
        }}>
          {item.icon} {item.text}
        </div>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findOne({ slug: id }).lean();
  if (!product) notFound();

  // Fetch related products for internal linking SEO
  const relatedProducts = await Product.find({ 
    cat: product.cat, 
    slug: { $ne: product.slug } 
  }).limit(4).lean();

  const productSchema = buildProductSchema(product);

  // Fix catSlug: map singular/shorthand category names to proper plural slugs
  const catSlugMap = {
    'silver ring': 'silver-rings',
    'gold ring': 'gold-rings',
    'diamond ring': 'diamond-rings',
    'engagement ring': 'engagement-rings',
    'couple ring': 'couple-rings',
    'bridal ring': 'bridal-rings',
    'minimalist ring': 'minimalist-rings',
    'luxury ring': 'luxury-rings',
  };
  const catSlug = catSlugMap[product.cat?.toLowerCase()] || product.cat?.toLowerCase()?.replace(/ /g, '-') || 'collections';

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: product.cat, path: `/${catSlug}` },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  const productFaqs = [
    {
      q: `Is the ${product.name} BIS Hallmarked?`,
      a: `Yes. All Anello rings — including the ${product.name} — are BIS Hallmarked by a licensed assaying centre, guaranteeing the purity of the metal as labelled.`,
    },
    {
      q: 'Does this ring come with a certificate?',
      a: product.cat?.toLowerCase()?.includes('diamond')
        ? 'Yes. This ring includes an IGI or GIA diamond grading certificate verifying the Cut, Color, Clarity, and Carat weight of every diamond.'
        : 'Yes. This ring comes with a purity certificate and BIS Hallmark documentation.',
    },
    {
      q: 'Can I get this ring resized?',
      a: 'Anello offers one complimentary resize within 30 days of purchase. Simply return the ring with your order details and we will resize it free of charge.',
    },
    {
      q: 'What is the return policy?',
      a: 'We offer a 7-day hassle-free return policy. If you are not completely satisfied, return the ring in its original condition for a full refund or exchange.',
    },
    {
      q: 'How long will shipping take?',
      a: 'Standard Pan-India delivery takes 3-7 business days. Express 1-2 day delivery is available in metro cities for a nominal charge.',
    },
  ];

  const faqSchema = buildFAQSchema(productFaqs);

  const sampleReviews = [
    { name: 'Priya Sharma', city: 'Mumbai', rating: 5, date: '2026-03-15', text: `The ${product.name} is absolutely stunning. The craftsmanship is impeccable and it arrived beautifully packed with the certificate.` },
    { name: 'Ananya Reddy', city: 'Hyderabad', rating: 5, date: '2026-02-28', text: 'Ordered as an anniversary gift. My partner was speechless! The quality is far beyond what I expected at this price point.' },
    { name: 'Kavya Nair', city: 'Bengaluru', rating: 4, date: '2026-01-10', text: 'Gorgeous ring. Delivery was quick and the packaging was luxurious. Very happy with the purchase.' },
  ];

  const metalInfo = product.material?.split('•');
  const metal = metalInfo?.[0]?.trim() || 'Premium Metal';
  const stone = metalInfo?.[1]?.trim() || null;

  const catLabel = product.cat;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ProductTracker productId={product._id?.toString()} />

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .product-page-container {
            padding: 0 1rem 8rem !important;
          }
          .product-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .product-detail-image-wrap img {
            padding: 0.5rem !important;
          }
          .product-info-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .related-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .related-card {
            padding: 0.5rem !important;
            border-radius: 12px !important;
          }
          .related-card .product-img-container {
            height: 140px !important;
            border-radius: 8px !important;
            margin-bottom: 0.5rem !important;
          }
          .related-card .related-cat {
            font-size: 0.6rem !important;
            letter-spacing: 0.5px !important;
            margin-bottom: 0.25rem !important;
          }
          .related-card .related-name {
            font-size: 0.8rem !important;
            margin-bottom: 0.25rem !important;
            line-height: 1.3 !important;
          }
          .related-card .related-price {
            font-size: 0.95rem !important;
          }
        }
        @media (max-width: 480px) {
          .product-detail-specs {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}} />

      <Header />

      <div className="product-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem' }}>

        {/* ── Breadcrumb ── */}
        <nav aria-label="breadcrumb" style={{ padding: '1.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <Link href={`/${catSlug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{catLabel}</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </nav>

        {/* ── Main Product Grid ── */}
        <div className="product-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

          {/* Image Gallery */}
          <ProductGallery images={product.images} defaultImg={product.img} name={product.name} video={product.video} />

          {/* Details */}
          <div>
            {/* Category + badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Link href={`/${catSlug}`} style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '2px', textDecoration: 'none', fontWeight: 700 }}>
                {catLabel}
              </Link>
              {product.isNewArrival && (
                <span style={{ background: '#059669', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px' }}>NEW ARRIVAL</span>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--text)', lineHeight: 1.2, marginBottom: '1rem' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)' }}>
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.oldPrice && (
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.oldPrice?.toLocaleString('en-IN')}
                </span>
              )}
              {(() => {
                // Auto-calculate real discount % from oldPrice
                if (product.oldPrice && product.price && product.oldPrice > product.price) {
                  const pct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
                  return (
                    <span style={{ background: 'linear-gradient(135deg,#e91e8c,#c2185b)', color: '#fff', padding: '5px 13px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, boxShadow: '0 2px 8px rgba(233,30,140,0.35)', letterSpacing: '0.3px' }}>
                      🔥 {pct}% OFF
                    </span>
                  );
                }
                // If badge is a custom non-numeric label (not "NEW"), show it
                if (product.badge && isNaN(Number(product.badge)) && product.badge.toUpperCase() !== 'NEW') {
                  return (
                    <span style={{ background: '#e91e8c', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {product.badge}
                    </span>
                  );
                }
                return null;
              })()}
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.98rem' }}>
              {product.description ||
                `A masterpiece of Indian fine jewelry craftsmanship, this ${catLabel?.toLowerCase() || 'ring'} is made with ${metal}${stone ? `, featuring a stunning ${stone}` : ''}. Every curve and facet is meticulously finished by master artisans, resulting in a ring that is as comfortable to wear as it is beautiful to behold. Ideal as an engagement ring, anniversary gift, or a personal statement of luxury.`}
            </p>

            {/* Specs */}
            <div className="product-detail-specs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Metal', value: metal },
                ...(stone ? [{ label: 'Stone', value: stone }] : []),
                { label: 'Shipping', value: 'Free Pan-India' },
              ].map(spec => (
                <div key={spec.label} style={{ padding: '0.8rem', background: 'var(--bg2)', borderRadius: '10px', border: '1px solid var(--border2)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>{spec.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{spec.value}</div>
                </div>
              ))}
            </div>

            <AddToCartButtons product={{
              _id: product._id?.toString(),
              id: product._id?.toString(),
              name: product.name,
              price: product.price,
              img: product.images?.[0] || product.img || '/placeholder.png',
              images: product.images || [],
              cat: product.cat,
              slug: product.slug,
            }} />

            <TrustRow />
          </div>
        </div>

        {/* ── Full Description ── */}
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Product Details & Craftsmanship
          </h2>
          <div className="product-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '1rem' }}>Metal & Purity</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                This {catLabel?.toLowerCase() || 'ring'} is crafted in {metal}. All Anello metals are BIS Hallmarked — stamped and certified by a government-approved assaying centre. You receive exactly the purity you pay for, no exceptions.
              </p>
            </div>
            {stone && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '1rem' }}>Gemstone Details</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  The centrepiece features a {stone}. Every stone is individually selected by Anello gemologists for exceptional colour, clarity, and cut performance. Diamond stones come with IGI or GIA certification.
                </p>
              </div>
            )}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '1rem' }}>Craftsmanship</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Each Anello ring is handcrafted by artisans who have dedicated years to mastering their craft. From the initial wax model to the final polishing, every step is carried out by hand, ensuring a level of quality and consistency that machines cannot replicate.
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', marginBottom: '1rem' }}>Styling & Wearability</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                The <strong>{product.name}</strong> is designed not just for special occasions, but for comfortable daily wear. Its smooth inner profile prevents snagging on fabrics, while its robust setting protects the precious stones during everyday activities. Whether paired with formal evening wear or elevating a casual outfit, this {catLabel?.toLowerCase() || 'ring'} serves as the ultimate versatile accessory. Layer it with our minimalist bands or wear it as a standalone statement piece.
              </p>
            </div>
          </div>
        </section>



        {/* ── Policies & Terms Accordion ── */}
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border2)' }} aria-label="Store Policies">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Store Policies & Terms
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <details style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer', fontSize: '0.98rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                🔄 Return & Refund Policy
                <span style={{ color: '#d4af37' }}>+</span>
              </summary>
              <div style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7, fontSize: '0.93rem' }}>
                <p>We accept returns/replacements within <strong>7 days of delivery</strong> under our 7-Day Hassle-Free Return & Exchange Policy in the following cases:</p>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <li>The product received is damaged or defective.</li>
                  <li>The product received is incorrect or different from what was ordered.</li>
                </ul>
                <p><strong>Return Conditions:</strong> Products must be in original condition, unused, with original packaging and tags intact. Customized or engraved items are non-returnable.</p>
                <p><strong>Refunds:</strong> Approved refunds are processed to the original mode of payment within 7–10 business days.</p>
              </div>
            </details>

            <details style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer', fontSize: '0.98rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                ⚖️ Terms & Conditions (T&C)
                <span style={{ color: '#d4af37' }}>+</span>
              </summary>
              <div style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7, fontSize: '0.93rem' }}>
                <p>By purchasing from Anello Fine Rings, you agree to the following terms:</p>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  <li><strong>Purity Guarantee:</strong> All gold, silver, and diamond rings are guaranteed as per their BIS Hallmark certification.</li>
                  <li><strong>Price & Payment:</strong> Prices are subject to gold and gemstone market fluctuations. Full payment is required at checkout.</li>
                  <li><strong>Warranty:</strong> Anello offers a 1-year warranty covering manufacturing defects. Standard wear-and-tear or damage from misuse is not covered.</li>
                </ul>
              </div>
            </details>

            <details style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer', fontSize: '0.98rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                🚚 Shipping & Delivery Policy
                <span style={{ color: '#d4af37' }}>+</span>
              </summary>
              <div style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7, fontSize: '0.93rem' }}>
                <p><strong>Free Pan-India Shipping:</strong> We provide free insured shipping on all orders across India.</p>
                <p><strong>Delivery Timelines:</strong> Standard delivery takes 3-7 business days. Express shipping is available for major metros.</p>
                <p><strong>Tracking:</strong> A tracking ID will be sent via SMS/Email once the order is dispatched.</p>
              </div>
            </details>

          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border2)' }} aria-label="Product FAQs">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {productFaqs.map((faq, i) => (
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

        {/* ── Related Products (Internal Linking) ── */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border2)' }} aria-label="Related Products">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '2rem' }}>
              Related {catLabel}s
            </h2>
            <div className="related-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
              {relatedProducts.map(p => (
                <Link key={p._id || p.id} href={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s', padding: '1rem' }} className="related-card product-card">
                    <div className="product-img-container" style={{ position: 'relative', height: '200px', marginBottom: '1rem', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
                      <Image
                        src={p.images?.[0] || p.img || '/placeholder.png'}
                        alt={p.name}
                        fill
                        className="product-img-primary"
                        style={{ objectFit: 'cover' }}
                        sizes="250px"
                      />
                      {p.images?.[1] && (
                        <Image
                          src={p.images[1]}
                          alt={`${p.name} alternate view`}
                          fill
                          className="product-img-secondary"
                          style={{ objectFit: 'cover' }}
                          sizes="250px"
                        />
                      )}
                    </div>
                    <div className="related-cat" style={{ fontSize: '0.75rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>{p.cat}</div>
                    <h3 className="related-name" style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>
                    <div className="related-price" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>₹{p.price?.toLocaleString('en-IN')}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Internal Links ── */}
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border2)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text)', marginBottom: '1.5rem' }}>
            Continue Exploring
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link href={`/${catSlug}`} style={{ padding: '0.7rem 1.5rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', borderRadius: '50px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              ← All {catLabel}
            </Link>
            <Link href="/diamond-rings" style={{ padding: '0.7rem 1.5rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', borderRadius: '50px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Diamond Rings
            </Link>
            <Link href="/gold-rings" style={{ padding: '0.7rem 1.5rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', borderRadius: '50px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Gold Rings
            </Link>
            <Link href="/engagement-rings" style={{ padding: '0.7rem 1.5rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', borderRadius: '50px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Engagement Rings
            </Link>
            <Link href="/blog/how-to-choose-a-proposal-ring" style={{ padding: '0.7rem 1.5rem', background: 'var(--bg2)', border: '1.5px solid #d4af37', borderRadius: '50px', color: '#d4af37', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              Proposal Ring Guide →
            </Link>
            <Link href="/blog/diamond-buying-guide" style={{ padding: '0.7rem 1.5rem', background: 'linear-gradient(135deg,#d4af37,#c8a028)', color: '#fff', borderRadius: '50px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, border: 'none' }}>
              Diamond Buying Guide →
            </Link>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
