'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StylishCollections({ products = [], onBuyNow, onProductClick }) {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setStartIndex((prev) => prev - (prev % 2));
    }
  }, [isMobile]);

  useEffect(() => {
    if (products.length === 0) return;
    const step = isMobile ? 1 : 2;
    const interval = setInterval(() => {
      setStartIndex((prev) => {
        const nextIndex = prev + step;
        return nextIndex >= products.length ? 0 : nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length, isMobile]);

  const step = isMobile ? 1 : 2;
  const isLoading = products.length === 0;
  const visibleProducts = products.slice(startIndex, startIndex + step);
  const dotsCount = isMobile ? products.length : Math.ceil(products.length / 2);
  const activeDotIndex = isMobile ? startIndex : Math.floor(startIndex / 2);

  return (
    <section className="stylish-section">
      <div className="stylish-inner">



        {/* Columns Container */}
        <div className="stylish-columns">
          {/* Left Side: Arched Image */}
          <div className="stylish-left">
            <div className="stylish-image-arch">
              <Image
                src="/model_with_rings.png"
                alt="Woman wearing diamond solitaire ring — Anello Fine Jewelry"
                fill
                sizes="(max-width: 768px) 50vw, 50vw"
                className="stylish-model-img"
                priority={false}
              />
              <Link href="/collections" className="stylish-shop-btn">
                <span>SHOP</span>
                <span>NOW</span>
              </Link>
            </div>
          </div>

          {/* Right Side: Content and Auto-Slider */}
          <div className="stylish-right">
            <div className="stylish-desktop-header">
              <div className="stylish-badge">
                <span className="stylish-star">✧</span> HANDCRAFTED PERFECTION
              </div>
              <h2 className="stylish-title">Stylish Design Collections</h2>
            </div>

            <div className="stylish-slider">
              {isLoading ? (
                // Skeleton placeholders while DB products load
                Array.from({ length: step }).map((_, i) => (
                  <div key={`skel-${i}`} className="stylish-product-card" style={{ pointerEvents: 'none' }}>
                    <div className="sp-img-wrap">
                      <div
                        className="sp-img-container"
                        style={{
                          background: 'var(--border2, #eee)',
                          borderRadius: '8px',
                          animation: 'skeletonPulse 1.5s ease-in-out infinite',
                        }}
                      />
                    </div>
                    <div style={{ height: '1.1rem', background: 'var(--border2, #eee)', borderRadius: '4px', margin: '0.75rem 0 0.4rem', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                    <div style={{ height: '0.9rem', width: '60%', background: 'var(--border2, #eee)', borderRadius: '4px', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                    <div style={{ height: '2.4rem', background: 'var(--border2, #eee)', borderRadius: '8px', marginTop: '0.75rem', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                  </div>
                ))
              ) : (
                visibleProducts.map((p) => {
                  const discountPrice = p.badge && !isNaN(Number(p.badge)) ? Number(p.badge) : null;
                  return (
                    <div key={p.id || p._id} className="stylish-product-card">
                      <Link href={`/products/${p.slug}`} style={{ display: 'block' }}>
                        <div className="sp-img-wrap">
                          <div className="sp-img-container">
                            <Image
                              src={p.images?.[0] || p.img || '/placeholder.png'}
                              alt={p.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 300px"
                              className="sp-img sp-img-primary"
                              placeholder="empty"
                            />
                            {p.images?.[1] && (
                              <Image
                                src={p.images[1]}
                                alt={`${p.name} alternate view`}
                                fill
                                sizes="(max-width: 768px) 50vw, 300px"
                                className="sp-img sp-img-secondary"
                                placeholder="empty"
                              />
                            )}
                          </div>
                        </div>
                      </Link>
                      <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 className="sp-name" style={{ cursor: 'pointer' }}>{p.name}</h3>
                      </Link>
                      <div className="sp-price-row">
                        {discountPrice && discountPrice < p.price ? (
                          <>
                            <span className="sp-price">₹{discountPrice.toLocaleString('en-IN')}</span>&nbsp;
                            <span className="sp-old">₹{p.price.toLocaleString('en-IN')}</span>
                          </>
                        ) : (
                          <>
                            <span className="sp-price">₹{p.price.toLocaleString('en-IN')}</span>&nbsp;
                            {p.oldPrice && <span className="sp-old">₹{p.oldPrice.toLocaleString('en-IN')}</span>}
                          </>
                        )}
                      </div>
                      <button className="sp-buy-btn" onClick={(e) => { e.stopPropagation(); onBuyNow && onBuyNow(p); }}>BUY NOW</button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="stylish-dots">
              {Array.from({ length: dotsCount }).map((_, idx) => (
                <span
                  key={idx}
                  className={`stylish-dot ${activeDotIndex === idx ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
