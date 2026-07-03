"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [], defaultImg = '/placeholder.png', name = 'Product', video = '' }) {
  // Combine all images: if images array is empty, use defaultImg
  const allImages = images && images.length > 0 ? images : [defaultImg];
  const [activeMedia, setActiveMedia] = useState(allImages[0]);

  return (
    <div>
      <div className="product-detail-image-wrap" style={{ background: 'var(--bg2)', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {video && activeMedia === video ? (
          <video
            src={activeMedia}
            controls
            autoPlay
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '550px', objectFit: 'contain' }}
          />
        ) : (
          <img
            src={activeMedia}
            alt={name}
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '550px', objectFit: 'contain' }}
          />
        )}
      </div>
      {(allImages.length > 1 || video) && (
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveMedia(img)}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: activeMedia === img ? '2px solid #d4af37' : '1px solid var(--border2)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <Image
                src={img}
                alt={`${name} view ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="80px"
              />
            </div>
          ))}
          {video && (
            <div
              onClick={() => setActiveMedia(video)}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: activeMedia === video ? '2px solid #d4af37' : '1px solid var(--border2)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg2)',
                fontSize: '1.5rem',
              }}
            >
              ▶️
            </div>
          )}
        </div>
      )}
    </div>
  );
}
