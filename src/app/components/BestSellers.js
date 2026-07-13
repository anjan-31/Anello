'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function BestSellers({ products = [], onProductClick }) {
  const { addToCart } = useCart();
  const [hoveredId, setHoveredId] = useState(null);

  const displayProducts = products.filter(p => p.isBestSeller).slice(0, 3);

  if (displayProducts.length === 0) return null;


  return (
    <section className="bestsellers-section" id="bestsellers">
      <div className="bestsellers-inner">
        
        <div className="bestsellers-badge">
          <span className="bestsellers-star">✦</span> MOST LOVED
        </div>
        
        <h2 className="bestsellers-title">Best Sellers</h2>
        <p className="bestsellers-subtitle">
          Discover our most cherished pieces, beloved by jewellery enthusiasts around the world.
        </p>

        <div className="bestsellers-carousel-container">
          <div className="bestsellers-carousel-track">
            {displayProducts.map((p, idx) => {
              const discountPrice = p.badge && !isNaN(Number(p.badge)) ? Number(p.badge) : null;
              const imgSrc = p.images?.[0] || p.img || '/placeholder.png';
              
              return (
                <div
                  key={`${p._id || p.id}-${idx}`}
                  className="bestsellers-card"
                  onClick={() => onProductClick && onProductClick(p)}
                  onMouseEnter={() => setHoveredId(p._id || p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  {/* Image — uniform square box */}
                  <div suppressHydrationWarning style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    position: 'relative'
                  }}>
                    {p.video ? (
                      <>
                        <video
                          src={p.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'cover',
                            mixBlendMode: 'darken',
                            transition: 'opacity 0.4s ease',
                            opacity: hoveredId === (p._id || p.id) ? 0 : 1
                          }}
                        />
                        <img
                          src={imgSrc}
                          alt={p.name}
                          loading="lazy"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'cover',
                            mixBlendMode: 'darken',
                            transition: 'opacity 0.4s ease',
                            opacity: hoveredId === (p._id || p.id) ? 1 : 0,
                            pointerEvents: 'none'
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          src={imgSrc}
                          alt={p.name}
                          loading="lazy"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'cover',
                            mixBlendMode: 'darken',
                            transition: 'opacity 0.4s ease',
                            opacity: (hoveredId === (p._id || p.id) && p.images?.[1]) ? 0 : 1
                          }}
                        />
                        {p.images?.[1] && (
                          <img
                            src={p.images[1]}
                            alt={`${p.name} secondary view`}
                            loading="lazy"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              display: 'block',
                              objectFit: 'cover',
                              mixBlendMode: 'darken',
                              transition: 'opacity 0.4s ease',
                              opacity: hoveredId === (p._id || p.id) ? 1 : 0,
                              pointerEvents: 'none'
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>

                  <h3 className="bs-name" style={{ marginTop: 'auto' }}>{p.name}</h3>
                  <div className="bs-price-row">
                    {discountPrice && discountPrice < p.price ? (
                      <>
                        <span className="bs-price">₹{discountPrice.toLocaleString('en-IN')}</span>&nbsp;
                        <span className="bs-old">₹{p.price.toLocaleString('en-IN')}</span>
                      </>
                    ) : (
                      <>
                        <span className="bs-price">₹{p.price.toLocaleString('en-IN')}</span>&nbsp;
                        {p.oldPrice && <span className="bs-old">₹{p.oldPrice.toLocaleString('en-IN')}</span>}
                      </>
                    )}
                  </div>

                  <div className="bs-action-row">
                    <button
                      className="bs-buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductClick && onProductClick(p);
                      }}
                    >
                      BUY NOW
                    </button>
                    <button
                      className="bs-add-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bestsellers-controls">
          <Link href="/collections" className="bs-view-all">
            VIEW ALL PRODUCTS
          </Link>
        </div>

      </div>
    </section>
  );
}
