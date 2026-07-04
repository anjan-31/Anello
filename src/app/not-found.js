'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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

export default function NotFound() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/collections?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <div className={`${cormorant.variable} ${outfit.variable} not-found-page`}>
      <div className="not-found-container">
        {/* Logo */}
        <Link href="/" className="logo-link">
          <Image 
            src="/logo.png" 
            alt="Anello Fine Rings Logo" 
            width={240} 
            height={80} 
            className="logo-img" 
            priority 
          />
        </Link>

        {/* Error Code Graphic */}
        <div className="error-graphic">
          <span className="digit">4</span>
          <span className="ring-icon">💍</span>
          <span className="digit">4</span>
        </div>

        {/* Header */}
        <h1 className="error-title">Page Not <em>Found</em></h1>
        <p className="error-description">
          The jewelry piece or page you are looking for has been moved, renamed, or is temporarily unavailable. 
          Let us help you find the perfect ring.
        </p>

        {/* Interactive Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input 
            type="text" 
            placeholder='Search "Silver Rings", "Engagement Rings", etc.' 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {/* Quick Links */}
        <div className="quick-links-section">
          <h2>Popular Categories</h2>
          <div className="quick-links">
            <Link href="/collections" className="link-btn">All Collections</Link>
            <Link href="/silver-rings" className="link-btn">Silver Rings</Link>
            <Link href="/engagement-rings" className="link-btn">Engagement Rings</Link>
          </div>
        </div>

        {/* Back Home Button */}
        <Link href="/" className="back-home-btn">
          ← Return to Store
        </Link>
      </div>

      <style jsx>{`
        .not-found-page {
          background: #f8f6f2; /* Warm luxury backdrop */
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1208;
          font-family: var(--font-main), sans-serif;
          padding: 2rem 1.5rem;
        }

        .not-found-container {
          max-width: 600px;
          width: 100%;
          text-align: center;
          background: #ffffff;
          padding: 3.5rem 2.5rem;
          border-radius: 24px;
          border: 1px solid rgba(184, 134, 11, 0.15);
          box-shadow: 0 10px 40px rgba(26, 18, 8, 0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-link {
          margin-bottom: 2rem;
          display: block;
          transition: transform 0.2s ease;
        }
        
        .logo-link:hover {
          transform: scale(1.02);
        }

        .logo-img {
          height: auto;
          object-fit: contain;
        }

        .error-graphic {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
        }

        .digit {
          font-family: var(--font-display), serif;
          font-size: 5.5rem;
          font-weight: 300;
          color: #b8860b;
          line-height: 1;
        }

        .ring-icon {
          font-size: 4.5rem;
          line-height: 1;
          animation: float 3s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        .error-title {
          font-family: var(--font-display), serif;
          font-size: clamp(2rem, 5vw, 2.6rem);
          font-weight: 400;
          margin-bottom: 1rem;
          color: #1a1208;
        }

        .error-title em {
          font-style: italic;
          color: #b8860b;
        }

        .error-description {
          font-size: 0.95rem;
          color: #5c5240;
          line-height: 1.6;
          max-width: 460px;
          margin-bottom: 2.2rem;
        }

        .search-form {
          display: flex;
          width: 100%;
          max-width: 440px;
          margin-bottom: 2.5rem;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.9rem 3.5rem 0.9rem 1.2rem;
          border-radius: 50px;
          border: 1px solid rgba(184, 134, 11, 0.3);
          background: #fdfcf9;
          font-size: 0.92rem;
          color: #1a1208;
          outline: none;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .search-input:focus {
          border-color: #b8860b;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(184, 134, 11, 0.15);
        }

        .search-btn {
          position: absolute;
          right: 4px;
          top: 4px;
          bottom: 4px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #b8860b;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .search-btn:hover {
          background: #8b6508;
        }

        .quick-links-section {
          width: 100%;
          border-top: 1px solid rgba(184, 134, 11, 0.12);
          padding-top: 2rem;
          margin-bottom: 2.5rem;
        }

        .quick-links-section h2 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #8b806b;
          margin-bottom: 1.2rem;
          font-weight: 700;
        }

        .quick-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          justify-content: center;
        }

        .link-btn {
          padding: 0.6rem 1.2rem;
          background: #fdfcf9;
          border: 1px solid rgba(184, 134, 11, 0.15);
          border-radius: 50px;
          color: #5c5240;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .link-btn:hover {
          background: #b8860b;
          color: #ffffff;
          border-color: #b8860b;
        }

        .back-home-btn {
          font-size: 0.95rem;
          color: #b8860b;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .back-home-btn:hover {
          color: #8b6508;
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .not-found-container {
            padding: 2.5rem 1.5rem;
          }
          .digit {
            font-size: 4rem;
          }
          .ring-icon {
            font-size: 3.5rem;
          }
          .error-description {
            margin-bottom: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}
