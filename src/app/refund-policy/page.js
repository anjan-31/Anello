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

export default function RefundPolicy() {
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
          <h1>Refund & <em>Cancellation</em> Policy</h1>
          <div className="policy-divider"></div>
        </header>

        <section className="policy-content">
          <p className="intro-text">At Anello, customer satisfaction is our priority. Please read our Refund & Cancellation Policy carefully before making a purchase.</p>

          <div className="policy-section">
            <h2>1. Order Cancellation</h2>
            <ul>
              <li>Orders can be cancelled only before they are dispatched from our warehouse.</li>
              <li>Once an order has been shipped or dispatched, it cannot be cancelled.</li>
              <li>To cancel an order, customers must contact us immediately via our official email or customer support number with order details.</li>
              <li>If the cancellation request is approved, the refund will be processed as per our refund policy.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>2. Returns & Exchanges</h2>
            <p>We accept returns only in the following cases:</p>
            <ul>
              <li>The product received is damaged</li>
              <li>The product is defective</li>
              <li>The product received is incorrect or different from what was ordered</li>
            </ul>
            <h3>Return Conditions</h3>
            <ul>
              <li>Customers must notify us within 7 days of delivery by email or WhatsApp with clear photos/videos of the product.</li>
              <li>Products must be returned in original condition, unused, unworn, and with original packaging, tags, and invoice intact.</li>
              <li>Customized, engraved, made-to-order, or personalized jewellery items are non-returnable and non-refundable.</li>
              <li>Any product showing signs of use, wear, or tampering will not be eligible for return.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Refund Policy</h2>
            <ul>
              <li>Once the returned product is received and inspected by our team, the refund will be approved or rejected.</li>
              <li>Approved refunds will be processed within 7–10 business days.</li>
              <li>Refunds will be credited to the original mode of payment only (UPI, Card, Net Banking, etc.).</li>
              <li>Shipping charges are non-refundable, unless the return is due to a Anello error (damaged/incorrect item).</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>4. Replacement Policy</h2>
            <ul>
              <li>In case of damaged or incorrect products, we may offer a replacement instead of a refund, subject to product availability.</li>
              <li>Replacement products will be shipped only after the returned item is received and verified.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>5. Non-Refundable Items</h2>
            <p>The following items are not eligible for refund or return:</p>
            <ul>
              <li>Customized or personalized jewellery</li>
              <li>Items bought under sale, discount, or promotional offers</li>
              <li>Products returned without original packaging or proof of purchase</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>6. Shipping Damage</h2>
            <ul>
              <li>If your product arrives damaged, please share unboxing photos or videos within 7 days of delivery.</li>
              <li>Claims without proper proof may not be accepted.</li>
            </ul>
          </div>

          <div className="policy-section contact-box">
            <h2>7. Contact Information</h2>
            <p>For cancellation, return, or refund requests, please contact us:</p>
            <div className="contact-details">
              <p><strong>Email:</strong> <a href="mailto:worldanello@gmail.com">worldanello@gmail.com</a></p>
              <p><strong>Customer Support:</strong> <a href="tel:+919545457711">+91 95454 57711</a></p>
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
