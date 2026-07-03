'use client';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/cloudinary-assets');
        const data = await res.json();
        if (!data.error) setVideos(data);
      } catch (e) {
        console.error('Fetch videos error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Filter logic: 'all' shows everything, else cycle through videos as demo
  const filteredVideos = videos.filter(v => v.url);

  return (
    <div className="videos-page">
      <Navbar />

      <main className="videos-container">
        <header className="videos-header">
          <span className="section-eyebrow">Visual Stories</span>
          <h1 className="section-title">Anello <em>Gallery</em></h1>
          <p className="section-desc">Experience the brilliance and craftsmanship of our fine rings through motion.</p>
        </header>

        {loading ? (
          <div className="loader-wrap">
            <div className="auth-spinner" />
          </div>
        ) : (
          <div className="videos-grid">
            {filteredVideos.length === 0 ? (
              <div className="empty-state">
                <p>No videos found in the gallery yet.</p>
              </div>
            ) : (
              filteredVideos.map((vid) => {
                const optimizedUrl = vid.url.includes('cloudinary.com')
                  ? vid.url.replace('/video/upload/', '/video/upload/f_auto,q_auto/')
                  : vid.url;
                return (
                  <div key={vid.public_id} className="video-card">
                    <div className="video-wrap">
                      <video
                        src={optimizedUrl}
                        className="gallery-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        onLoadedData={(e) => e.target.play()}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      <footer style={{ marginTop: '4rem', padding: '4rem 2rem', background: 'var(--bg2)', textAlign: 'center' }}>
        <p>© 2026 Anello Fine Rings. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .videos-page { background: #fff; min-height: 100vh; }
        .videos-container { max-width: 1400px; margin: 0 auto; padding: 4rem 2rem; }
        .videos-header { text-align: center; margin-bottom: 2.5rem; }
        .section-desc { color: var(--text-muted); max-width: 600px; margin: 1rem auto 0; font-size: 1.1rem; }

        /* ── TAG BAR ── */
        .tag-bar-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          margin-bottom: 3rem;
          padding: 0.5rem 0;
        }
        .tag-bar-wrap::-webkit-scrollbar { display: none; }

        .tag-bar {
          display: flex;
          gap: 0.75rem;
          width: max-content;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          padding: 0.55rem 1.2rem;
          border-radius: 999px;
          border: 1.5px solid #e8d9c5;
          background: #fdfaf7;
          color: #a07850;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }
        .tag-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #c9a96e22, #e8c99a22);
          opacity: 0;
          transition: opacity 0.25s ease;
          border-radius: inherit;
        }
        .tag-pill:hover {
          border-color: #c9a96e;
          color: #7a5c30;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 18px rgba(201,169,110,0.2);
        }
        .tag-pill:hover::before { opacity: 1; }

        .tag-active {
          background: linear-gradient(135deg, #c9a96e, #e8c99a);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 6px 20px rgba(201,169,110,0.45);
          transform: translateY(-2px) scale(1.06);
        }
        .tag-active::before { opacity: 0 !important; }
        .tag-active:hover {
          box-shadow: 0 8px 24px rgba(201,169,110,0.55);
          transform: translateY(-3px) scale(1.07);
        }

        /* ── GRID ── */
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .video-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: transform 0.3s ease;
        }
        .video-card:hover { transform: translateY(-10px); }

        .video-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          background: #fdfaf5;
          animation: pulse 2s infinite ease-in-out;
          overflow: hidden;
        }
        @keyframes pulse {
          0%   { background-color: #fdfaf5; }
          50%  { background-color: #f5eedf; }
          100% { background-color: #fdfaf5; }
        }
        .gallery-video {
          width: 100%;
          height: 106%;
          object-fit: cover;
          object-position: top;
        }
        .video-tag {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .loader-wrap { display: flex; justify-content: center; padding: 5rem; }
        .empty-state { text-align: center; grid-column: 1 / -1; padding: 5rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .videos-container { padding: 2rem 1rem; }
          .videos-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
          .section-title { font-size: 2.2rem; }
          .tag-bar { padding: 0 0.5rem; }
          .tag-pill { font-size: 0.82rem; padding: 0.48rem 1rem; }
        }
      `}</style>
    </div>
  );
}
