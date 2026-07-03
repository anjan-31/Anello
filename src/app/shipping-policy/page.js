'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Outfit, Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-main",
});

export default function ShippingPolicy() {
  return (
    <div className={`${cormorant.variable} ${outfit.variable} policy-page`}>
      <nav className="policy-nav">
        <div className="policy-nav-inner">
          <Link href="/">
            <Image src="/logo.png" alt="Anello" width={350} height={130} className="policy-logo" style={{ height: '130px', width: 'auto', objectFit: 'contain' }} priority />
          </Link>
          <Link href="/" className="back-home">← Back to Store</Link>
        </div>
      </nav>

      <main className="policy-container">
        <header className="policy-header">
          <span className="policy-eyebrow">Customer Care</span>
          <h1>Shipping <em>Policy</em></h1>
          <div className="policy-divider"></div>
        </header>

        <section className="policy-content">
          <p className="intro-text">
            At Anello, we ensure that your precious purchases reach you safely and promptly. 
            Please review our shipping guidelines, packaging features, and delivery timelines.
          </p>

          <div className="policy-section">
            <h2>1. Free Pan-India Shipping</h2>
            <ul>
              <li>We are proud to offer **100% Free Shipping** on all orders across India.</li>
              <li>No minimum order value is required to qualify for free delivery.</li>
              <li>We service over 26,000+ pincodes through our verified courier partners.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>2. Fully Insured Transit</h2>
            <ul>
              <li>Every shipment dispatched by Anello is **fully insured** during transit.</li>
              <li>Your order is protected against any damage, loss, or theft during shipping until it is successfully delivered to your doorstep.</li>
              <li>We require a signature and/or OTP validation upon delivery to ensure the parcel reaches the rightful recipient.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Delivery Timelines</h2>
            <p>Our turnaround times differ based on product availability and design complexity:</p>
            <ul>
              <li><strong>Ready-to-Ship Rings:</strong> Shipped within 24–48 hours. Delivery takes 3–5 business days depending on destination.</li>
              <li><strong>Customized & Made-to-Order Rings:</strong> Requires custom casting and hallmarking. Shipped within 7–10 business days. Total delivery is around 10–14 business days.</li>
              <li><strong>Metro Cities:</strong> Usually delivered within 3–4 business days post dispatch.</li>
              <li><strong>Non-Metro Cities & Rural Locations:</strong> Delivered within 5–7 business days post dispatch.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>4. Secure Packaging</h2>
            <ul>
              <li>All jewelry is packed in tamper-proof, durable, and discreet boxes to ensure maximum security.</li>
              <li>Inside the shipping box, your rings are cradled in a luxurious velvet Anello display case.</li>
              <li>Every parcel includes the official BIS Hallmark or IGI Diamond certification cards along with your tax invoice.</li>
              <li>We advise customers not to accept any packages that show signs of tampering, opening, or severe crushing.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>5. Order Tracking</h2>
            <ul>
              <li>Once your order is handed over to our logistics partner, you will receive a tracking link via email and SMS.</li>
              <li>You can monitor the live updates of your shipment using the tracking ID provided by courier partners like Delhivery or BlueDart.</li>
            </ul>
          </div>

          <div className="policy-section contact-box">
            <h2>6. Help & Support</h2>
            <p>If you experience any delays or have questions regarding your shipment, please contact our support team:</p>
            <div className="contact-details">
              <p><strong>Email:</strong> <a href="mailto:worldanello@gmail.com">worldanello@gmail.com</a></p>
              <p><strong>Phone:</strong> <a href="tel:+919545457711">+91 95454 57711</a></p>
              <p><strong>Working Hours:</strong> Monday – Saturday (10:00 AM – 6:00 PM)</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="policy-footer">
        <div className="policy-footer-inner">
          <p>© 2026 Anello Fine Rings. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .policy-page {
          background: var(--bg);
          min-height: 100vh;
          color: var(--text);
          font-family: var(--font);
        }
        .policy-nav {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border2);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .policy-nav-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .back-home {
          color: var(--gold-dark);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .back-home:hover {
          color: var(--gold);
        }
        .policy-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }
        .policy-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .policy-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1rem;
          display: block;
        }
        .policy-header h1 {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 400;
          line-height: 1.2;
        }
        .policy-header h1 em {
          font-style: italic;
          color: var(--gold);
        }
        .policy-divider {
          width: 60px;
          height: 1px;
          background: var(--gold);
          margin: 2rem auto;
          opacity: 0.3;
        }
        .intro-text {
          font-size: 1.1rem;
          color: var(--text-muted);
          text-align: center;
          margin-bottom: 4rem;
          line-height: 1.6;
        }
        .policy-section {
          margin-bottom: 3rem;
        }
        .policy-section h2 {
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--text);
          margin-bottom: 1.2rem;
          border-left: 3px solid var(--gold);
          padding-left: 1.2rem;
        }
        .policy-section h3 {
          font-size: 1.1rem;
          margin: 1.5rem 0 1rem;
          color: var(--gold-dark);
        }
        .policy-section p {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .policy-section ul {
          list-style: none;
          padding: 0;
        }
        .policy-section ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.8rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .policy-section ul li::before {
          content: '✧';
          position: absolute;
          left: 0;
          color: var(--gold);
          font-size: 0.8rem;
        }
        .contact-box {
          background: var(--bg2);
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid var(--border2);
        }
        .contact-details {
          margin-top: 1.5rem;
        }
        .contact-details p {
          margin-bottom: 0.5rem;
        }
        .contact-details a {
          color: var(--gold-dark);
          text-decoration: none;
          font-weight: 600;
        }
        .policy-footer {
          border-top: 1px solid var(--border2);
          padding: 2rem;
          text-align: center;
          background: var(--bg2);
        }
        .policy-footer p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        @media (max-width: 600px) {
          .policy-container { padding: 3rem 1.5rem; }
          .policy-header h1 { font-size: 2.2rem; }
          .policy-section h2 { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
