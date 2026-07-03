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

export default function PrivacyPolicy() {
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
          <span className="policy-eyebrow">Legal Compliance</span>
          <h1>Privacy <em>Policy</em></h1>
          <div className="policy-divider"></div>
        </header>

        <section className="policy-content">
          <p className="intro-text">
            At Anello, we value your trust and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data in compliance with the IT Act 2000.
          </p>

          <div className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>To process your orders and provide a seamless shopping experience, we collect the following personal information:</p>
            <ul>
              <li><strong>Name:</strong> For identity verification and addressing your orders.</li>
              <li><strong>Email Address:</strong> For sending order confirmations, OTPs for password recovery, and invoice details.</li>
              <li><strong>Phone Number:</strong> For delivery updates, courier coordination, and support queries.</li>
              <li><strong>Delivery Address:</strong> To deliver your handcrafted rings to your doorstep.</li>
              <li><strong>Pincode:</strong> To verify serviceability and estimate shipping delivery dates.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>2. How We Use Your Data</h2>
            <p>Your personal information is strictly used for the following purposes:</p>
            <ul>
              <li>Order validation, packaging, and fulfillment.</li>
              <li>Secured shipping and delivering products directly to your location.</li>
              <li>Sending automated OTPs for secure login and account recovery.</li>
              <li>Providing active customer service and addressing your inquiries.</li>
              <li>Sharing vital shipping updates or status notifications.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>3. Third-Party Data Sharing</h2>
            <p>We do NOT sell, lease, or rent your personal information to third parties. We share data only with trusted partners necessary for order shipping:</p>
            <ul>
              <li><strong>Logistics Partners:</strong> We share your name, address, phone number, and pincode with verified delivery partners (such as Delhivery, BlueDart, or India Post) solely for shipping and logistics purposes.</li>
              <li><strong>Regulatory Bodies:</strong> We may share details if required by Indian law or to protect our legal rights in connection with fraudulent activities.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>4. Cookie Usage</h2>
            <p>Our website utilizes cookies to enhance your browsing experience, remember your preferences, and maintain checkout session details:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Used to track items added to your shopping cart and remember authentication states.</li>
              <li><strong>Performance Cookies:</strong> Help us study traffic patterns to optimize layout performance.</li>
              <li>You can choose to disable cookies through your browser settings, but it may affect certain functionalities of the store.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2>5. User Rights & Data Deletion</h2>
            <p>You have full ownership of your personal information. Under applicable laws, you have the following rights:</p>
            <ul>
              <li>Right to access or update your registered name, email, and shipping details inside your account portal.</li>
              <li>Right to request the complete erasure of your personal data from our databases.</li>
              <li>To request account deletion or data removal, please email us directly with your account details. Requests are verified and processed within 30 days.</li>
            </ul>
          </div>

          <div className="policy-section contact-box">
            <h2>6. Contact for Privacy Queries</h2>
            <p>For data deletion requests, privacy queries, or security questions, please contact our grievance officer:</p>
            <div className="contact-details">
              <p><strong>Email:</strong> <a href="mailto:worldanello@gmail.com">worldanello@gmail.com</a></p>
              <p><strong>Support:</strong> <a href="tel:+919545457711">+91 95454 57711</a></p>
              <p><strong>Registered Address:</strong> Anello Fine Jewelry, India</p>
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
