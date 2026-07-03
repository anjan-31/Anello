'use client';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

const RING_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export default function AddToCartButtons({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  const validate = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2500);
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    addToCart({ ...product, ringSize: selectedSize });
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    addToCart({ ...product, ringSize: selectedSize });
    router.push('/checkout');
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Size Selector */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)',
            textTransform: 'uppercase', letterSpacing: '1px'
          }}>
            💍 Ring Size
          </span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700, color: '#fff',
            background: '#e91e8c', padding: '2px 8px', borderRadius: '20px'
          }}>
            Required
          </span>
          {selectedSize && (
            <span style={{
              fontSize: '0.8rem', color: '#059669', fontWeight: 700,
              marginLeft: 'auto'
            }}>
              ✓ Size {selectedSize} selected
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {RING_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => { setSelectedSize(size); setSizeError(false); }}
              style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                border: selectedSize === size
                  ? '2.5px solid #d4af37'
                  : sizeError
                    ? '2px solid #e91e8c'
                    : '2px solid var(--border2)',
                background: selectedSize === size
                  ? 'linear-gradient(135deg,#d4af37,#c8a028)'
                  : 'var(--bg)',
                color: selectedSize === size ? '#fff' : 'var(--text)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
                transform: selectedSize === size ? 'scale(1.12)' : 'scale(1)',
                boxShadow: selectedSize === size ? '0 4px 12px rgba(212,175,55,0.4)' : 'none',
              }}
            >
              {size}
            </button>
          ))}
        </div>

        {sizeError && (
          <div style={{
            marginTop: '0.6rem', fontSize: '0.82rem', fontWeight: 600,
            color: '#e91e8c', display: 'flex', alignItems: 'center', gap: '0.3rem',
            animation: 'shake 0.3s ease'
          }}>
            ⚠️ Please select a ring size before proceeding
          </div>
        )}
      </div>

      {/* Buttons */}
      <div
        className="mobile-sticky-cta"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', zIndex: 100 }}
      >
        <button
          onClick={handleBuyNow}
          style={{
            background: 'linear-gradient(135deg,#d4af37,#c8a028)',
            color: '#fff',
            border: 'none',
            padding: '1rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
            opacity: selectedSize ? 1 : 0.85,
            transition: 'opacity 0.2s',
          }}
        >
          💍 Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          style={{
            background: 'var(--bg)',
            border: '2px solid #d4af37',
            color: '#d4af37',
            padding: '1rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            opacity: selectedSize ? 1 : 0.85,
            transition: 'opacity 0.2s',
          }}
        >
          🛒 Add to Cart
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      ` }} />
    </div>
  );
}
