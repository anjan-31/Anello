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

export default function TermsConditions() {
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
          <span className="policy-eyebrow">Legal</span>
          <h1>Terms & <em>Conditions</em></h1>
          <div className="policy-divider"></div>
        </header>

        <section className="policy-content">
          <p className="intro-text">Welcome to Anello. These Terms & Conditions govern your use of our website, products, and services. By accessing or using our portal (jewelskartindia.com), you agree to be bound by these Terms.</p>

          <div className="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By visiting or placing an order on Anello, you agree to these Terms & Conditions, our Privacy Policy, and Refund & Cancellation Policy. If you do not agree with any part of these terms, please do not use our website.</p>
          </div>

          <div className="policy-section">
            <h2>2. Eligibility</h2>
            <p>You must be at least 18 years old or accessing with parental/guardian consent to use this website, purchase products, or place orders.</p>
          </div>

          <div className="policy-section">
            <h2>3. Account Registration</h2>
            <ul>
              <li>To make a purchase, you may be required to create an account by providing accurate and complete information.</li>
              <li>You are responsible for safeguarding your account credentials and for all actions taken under your account.</li>
              <li>JewelsKart India is not liable for any unauthorized use of your account.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>4. Products & Pricing</h2>
            <ul>
              <li>All product descriptions, images, and pricing are displayed for customer convenience.</li>
              <li>We strive for accuracy; however, in rare cases discrepancies might occur. Anello reserves the right to correct errors, inaccuracies, or omissions and to change or update information at any time without prior notice.</li>
              <li>Prices are listed in Indian Rupees (₹) and may change without notice.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>5. Orders & Acceptance</h2>
            <ul>
              <li>When you place an order, you agree to receive electronic communications regarding your order.</li>
              <li>Anello reserves the right to accept or reject orders for any reason, including product availability, pricing errors, or suspicion of fraud.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>6. Payments</h2>
            <ul>
              <li>We accept payments through secure online payment gateways (Credit/Debit Cards, UPI, Net Banking, Wallets).</li>
              <li>By providing payment information, you represent and warrant that you are authorized to use the payment method.</li>
              <li>All payments are processed securely, Anello is not liable for any payment gateway failures beyond our control.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>7. Shipping, Delivery & Risk of Loss</h2>
            <ul>
              <li>Shipping and delivery timelines are estimates only and may vary.</li>
              <li>Risk of loss for products passes to the buyer upon delivery.</li>
              <li>Delivery failures due to incorrect address or unavailability may result in additional charges.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>8. Return & Exchange Policy</h2>
            <p>Returns and exchanges are governed by our Refund & Cancellation Policy, which forms part of these Terms. Customized, engraved, or personalized products are non-returnable.</p>
          </div>

          <div className="policy-section">
            <h2>9. Intellectual Property</h2>
            <p>All content on Anello, including text, graphics, logos, images, software, and trademarks, is the property of Anello or its licensors. You may not reproduce, distribute, modify, display, or otherwise use any content without prior written consent.</p>
          </div>

          <div className="policy-section">
            <h2>10. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the website for unlawful purposes</li>
              <li>Interfere with site security or functionality</li>
              <li>Post harmful or offensive material</li>
              <li>Attempt to disrupt or hack the site</li>
            </ul>
            <p>Violations may result in termination, legal action, or reporting to authorities.</p>
          </div>

          <div className="policy-section">
            <h2>11. Limitation of Liability</h2>
            <ul>
              <li>Anello, its directors, employees, and partners will not be liable for indirect, incidental, or consequential damages arising from your use of the website or products.</li>
              <li>Our liability is limited to the amount paid by you for the product.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Anello and its affiliates from any claims, damages, losses, liabilities, and expenses arising from:</p>
            <ul>
              <li>Your breach of these Terms</li>
              <li>Your misuse of the website or products</li>
              <li>Any violation of applicable laws</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>13. Privacy Policy</h2>
            <p>Your use of the website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.</p>
          </div>

          <div className="policy-section">
            <h2>14. Governing Law & Jurisdiction</h2>
            <p>These Terms are governed by the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in [Pune, Maharashtra].</p>
          </div>

          <div className="policy-section">
            <h2>15. Changes to Terms</h2>
            <p>Anello reserves the right to update or modify these Terms at any time. Changes take effect immediately upon posting on the website. Your continued use of the website after changes constitutes acceptance.</p>
          </div>

          <div className="policy-section contact-box">
            <h2>16. Contact Information</h2>
            <p>If you have questions about these Terms & Conditions, please contact us:</p>
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
