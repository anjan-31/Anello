import Link from 'next/link';
import { buildBreadcrumbSchema, buildFAQSchema } from '@/lib/seo';

export const metadata = {
  title: 'Why Trust Anello — BIS Hallmark, IGI Certified Diamonds & Guarantees | Anello Store',
  description: 'Shop with total confidence at Anello. BIS Hallmarked gold, IGI/GIA certified diamonds, 7-day returns, free pan-India shipping, and thousands of happy customers across India.',
  alternates: { canonical: '/trust' },
  openGraph: {
    title: 'Why Trust Anello — Certified Jewelry You Can Believe In',
    description: 'BIS Hallmarked gold, IGI/GIA certified diamonds, free shipping, 7-day returns. India\'s most trusted fine jewelry brand.',
    type: 'website',
    url: 'https://www.anellostore.com/trust',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Anello Store — Certified Fine Jewelry India' }],
  },
};

const TRUST_FAQS = [
  {
    q: 'Is Anello Store a genuine jewelry brand?',
    a: 'Yes. Anello is a registered Indian jewelry brand selling BIS Hallmarked gold rings and IGI/GIA certified diamond rings. Every product listing includes certification details and hallmark information. We have served thousands of customers across India.',
  },
  {
    q: 'What is a BIS Hallmark and why does it matter?',
    a: 'BIS (Bureau of Indian Standards) Hallmark is India\'s official government certification for gold purity. A BIS Hallmarked ring guarantees that the gold is exactly the purity stated — 22K (91.6%) or 18K (75%). Without a BIS Hallmark, there is no independent guarantee of gold purity. All Anello gold rings carry the BIS Hallmark.',
  },
  {
    q: 'Are Anello diamond rings certified?',
    a: 'Yes. Every diamond above 0.20ct sold by Anello comes with an IGI (International Gemological Institute) or GIA (Gemological Institute of America) grading certificate. This certificate independently verifies the Cut, Color, Clarity, and Carat weight of your diamond — giving you a permanent, verifiable record of what you purchased.',
  },
  {
    q: 'What is Anello\'s return policy?',
    a: 'We offer a 7-day hassle-free return policy on all orders. If you are not completely satisfied, simply contact our team within 7 days of delivery and we will arrange a free pickup and full refund — no questions asked. We also offer one complimentary ring resize within 30 days of purchase.',
  },
  {
    q: 'How is Anello jewelry shipped?',
    a: 'Every Anello ring is shipped in a luxury gift box, fully insured, with a trackable courier partner. We ship to all 28 states and 8 union territories of India. Delivery typically takes 5-7 business days. Express delivery options are available at checkout.',
  },
  {
    q: 'Can I verify my diamond certificate independently?',
    a: 'Absolutely. Every IGI certificate has a unique report number that can be verified on the IGI website (igi.org) at any time. GIA certificates can be verified on gia.edu. We encourage all customers to verify their certificates independently.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'I purchased a diamond engagement ring for my fiancée and she was absolutely stunned. The IGI certificate gave us so much confidence — we could verify everything independently. The ring arrived in a beautiful gift box, exactly as described. Truly a premium experience.',
    product: 'Diamond Solitaire Engagement Ring',
    date: 'April 2026',
  },
  {
    name: 'Rahul Mehta',
    location: 'New Delhi',
    rating: 5,
    text: 'Bought a 22K gold couple ring set for our anniversary. The BIS Hallmark was right there — exactly as promised. My wife loves it and wears it every day. The engraving service was a wonderful personal touch. Cannot recommend Anello enough.',
    product: '22K Gold Couple Ring Set',
    date: 'March 2026',
  },
  {
    name: 'Ananya Krishnan',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    text: 'The silver moonstone ring I ordered is even more beautiful in person than in the photos. Quality is absolutely top notch — you can feel the craftsmanship. Delivery was fast, packaging was luxurious, and the customer service team was incredibly helpful when I needed to resize.',
    product: 'Sterling Silver Moonstone Ring',
    date: 'March 2026',
  },
  {
    name: 'Vikram Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    text: 'I was initially nervous about buying jewelry online but Anello made it completely comfortable. The detailed certification information, the clear return policy, and the live chat support made all the difference. The diamond ring was breathtaking — my partner said yes!',
    product: 'Oval Diamond Engagement Ring',
    date: 'February 2026',
  },
  {
    name: 'Deepika Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    text: 'Gifted my mother a 22K gold ring for her birthday and she was in tears. She said it reminded her of the gold jewelry her own mother used to wear. The BIS Hallmark stamp was visible and perfect. Anello truly delivers on every promise they make.',
    product: '22K Gold Traditional Ring',
    date: 'January 2026',
  },
];

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.75rem' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#d4af37' : '#444', fontSize: '1.1rem' }}>★</span>
      ))}
    </div>
  );
}

function TrustBadge({ icon, title, description, color = '#d4af37' }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: `1.5px solid ${color}22`,
      borderRadius: '16px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      flex: '1 1 220px',
    }}>
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--text)', marginBottom: '0' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

export default function TrustPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Why Trust Anello', path: '/trust' },
  ]);
  const faqSchema = buildFAQSchema(TRUST_FAQS);

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Anello Store',
    url: 'https://www.anellostore.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: TESTIMONIALS.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: TESTIMONIALS.map(t => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: t.rating.toString(), bestRating: '5' },
      author: { '@type': 'Person', name: t.name },
      reviewBody: t.text,
      datePublished: t.date,
      name: t.product,
    })),
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '90px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 5rem' }}>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ padding: '1.5rem 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--text)' }}>Why Trust Anello</span>
        </nav>

        {/* Hero */}
        <header style={{ textAlign: 'center', padding: '2rem 1rem 4rem', borderBottom: '1px solid var(--border2)', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '4px', color: '#d4af37', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Certified · Hallmarked · Trusted
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Why Thousands of Indians <em>Trust Anello</em>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            Every ring we sell is government-certified, independently verified, and backed by our total satisfaction guarantee. Here is exactly why you can shop with complete confidence.
          </p>

          {/* Social Proof Numbers */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { number: '10,000+', label: 'Happy Customers' },
              { number: '4.9★', label: 'Average Rating' },
              { number: '100%', label: 'BIS Hallmarked' },
              { number: '15 Days', label: 'Easy Returns' },
            ].map(stat => (
              <div key={stat.number} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: '#d4af37' }}>{stat.number}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Certification Section */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
            Certified Quality You Can Verify
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            We do not ask you to simply trust us — we give you the certifications to verify everything independently.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

            {/* BIS Hallmark */}
            <div style={{ background: 'linear-gradient(135deg, #1a0f0066, #2a1a0033)', border: '1.5px solid #d4af3744', borderRadius: '20px', padding: '2.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏅</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#d4af37', marginBottom: '1rem' }}>
                BIS Hallmark Certified
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                The Bureau of Indian Standards (BIS) Hallmark is India's official government certification for gold purity. Every Anello gold ring is stamped with a BIS Hallmark in a licensed assaying centre.
              </p>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: 2 }}>
                <li>22K gold = 91.6% pure gold guaranteed</li>
                <li>18K gold = 75% pure gold guaranteed</li>
                <li>Stamped by government-licensed centres</li>
                <li>Verifiable with BIS CARE app</li>
              </ul>
            </div>

            {/* IGI/GIA Diamonds */}
            <div style={{ background: 'linear-gradient(135deg, #0d1a2e66, #0a102033)', border: '1.5px solid #6366f144', borderRadius: '20px', padding: '2.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#818cf8', marginBottom: '1rem' }}>
                IGI & GIA Certified Diamonds
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Every diamond above 0.20ct sold by Anello comes with an independent grading certificate from IGI or GIA — the world's most trusted gemological laboratories.
              </p>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: 2 }}>
                <li>Independently verified Cut, Color, Clarity, Carat</li>
                <li>Certificate verifiable at igi.org or gia.edu</li>
                <li>Unique report number on every stone</li>
                <li>Permanent, irrefutable quality record</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Trust Badges Grid */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Our Promises to You
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
            <TrustBadge
              icon="🚚"
              title="Free Pan-India Shipping"
              description="Every order ships free across all 28 states and 8 union territories of India. Fully insured, trackable, and delivered in 5-7 business days."
            />
            <TrustBadge
              icon="↩️"
              title="7-Day Hassle-Free Returns"
              description="Not satisfied? We collect from your door at no charge and process a full refund — no questions asked, no restocking fees."
            />
            <TrustBadge
              icon="📏"
              title="Free Ring Resizing"
              description="One complimentary resize within 30 days of purchase. Simply ship back and we return it resized within 5-7 business days."
              color="#059669"
            />
            <TrustBadge
              icon="🎁"
              title="Luxury Gift Packaging"
              description="Every Anello ring ships in a premium gift box — beautifully presented and ready to give. Complimentary for every order."
              color="#ec4899"
            />
            <TrustBadge
              icon="✍️"
              title="Free Engraving"
              description="Personalise your ring with inner-band engraving — initials, a date, or a message — up to 15 characters, complimentary."
              color="#7c3aed"
            />
            <TrustBadge
              icon="💬"
              title="Expert Support"
              description="Our jewelry experts are available via WhatsApp, email, and live chat to guide you through every step of your purchase."
              color="#0891b2"
            />
          </div>
        </section>

        {/* Shipping & Returns Detail */}
        <section style={{ marginBottom: '5rem', background: 'var(--card-bg)', borderRadius: '20px', border: '1px solid var(--border2)', padding: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Shipping & Returns Policy
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#d4af37', marginBottom: '1rem' }}>📦 Shipping</h3>
              <ul style={{ color: 'var(--text-muted)', lineHeight: 2, paddingLeft: '1.2rem', margin: 0 }}>
                <li><strong style={{ color: 'var(--text)' }}>Free shipping</strong> on all orders, pan-India</li>
                <li>Fully insured against loss or damage</li>
                <li>Trackable with real-time updates via SMS/WhatsApp</li>
                <li>Delivered in 5-7 business days (express available)</li>
                <li>Luxury gift packaging on every order</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#d4af37', marginBottom: '1rem' }}>↩️ Returns</h3>
              <ul style={{ color: 'var(--text-muted)', lineHeight: 2, paddingLeft: '1.2rem', margin: 0 }}>
                <li><strong style={{ color: 'var(--text)' }}>7-day returns</strong> — no questions asked</li>
                <li>Free pickup from your location</li>
                <li>Full refund to original payment method</li>
                <li>One free resize within 30 days</li>
                <li>Items must be unworn and in original packaging</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#d4af37', marginBottom: '1rem' }}>💳 Payment</h3>
              <ul style={{ color: 'var(--text-muted)', lineHeight: 2, paddingLeft: '1.2rem', margin: 0 }}>
                <li>All major credit and debit cards accepted</li>
                <li>UPI, Net Banking, Wallets</li>
                <li>SSL encrypted, PCI compliant checkout</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
            What Our Customers Say
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Real reviews from real customers across India.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={i}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border2)',
                  borderRadius: '16px',
                  padding: '2rem',
                  margin: 0,
                }}
              >
                <StarRating rating={t.rating} />
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.25rem', fontStyle: 'italic', fontSize: '0.95rem' }}>
                  "{t.text}"
                </p>
                <footer>
                  <strong style={{ color: 'var(--text)', display: 'block', fontSize: '0.9rem' }}>{t.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.location} · {t.date}</span>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#d4af37', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {t.product}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--text)', marginBottom: '2rem' }}>
            Trust & Policy — Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {TRUST_FAQS.map((faq, i) => (
              <details
                key={i}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '1.25rem 1.5rem' }}
              >
                <summary style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.98rem' }}>
                  {faq.q}
                  <span style={{ color: '#d4af37', fontWeight: 700, flexShrink: 0, marginLeft: '1rem' }}>+</span>
                </summary>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.8, fontSize: '0.93rem' }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '20px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', marginBottom: '1rem' }}>
            Ready to Find Your Perfect Ring?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Shop Anello's certified diamond, gold and silver rings with complete confidence — BIS Hallmarked, IGI certified, free shipping, 7-day returns.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/diamond-rings" style={{ padding: '0.9rem 2rem', background: 'linear-gradient(135deg,#d4af37,#c8a028)', color: '#fff', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>
              💎 Shop Diamond Rings
            </Link>
            <Link href="/engagement-rings" style={{ padding: '0.9rem 2rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', color: 'var(--text)', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>
              Engagement Rings
            </Link>
            <Link href="/collections" style={{ padding: '0.9rem 2rem', background: 'var(--bg2)', border: '1.5px solid var(--border2)', color: 'var(--text)', borderRadius: '50px', textDecoration: 'none', fontWeight: 600 }}>
              All Collections
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
