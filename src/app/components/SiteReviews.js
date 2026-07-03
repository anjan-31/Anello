'use client';
import { useState, useEffect } from 'react';

export default function SiteReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    rating: 5,
    text: '',
    website: ''
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews/site');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return alert('Name and Review are required.');
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setShowModal(false);
        setFormData({ name: '', city: '', rating: 5, text: '', website: '' });
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="section-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>What Our Customers Say</h2>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              background: 'var(--gold-dark)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Write a Review
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first to review!</div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <div key={r._id || i} className="review-card">
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <span key={si} style={{ color: si < r.rating ? 'var(--gold-dark)' : '#ccc' }}>★</span>
                  ))}
                </div>
                <div className="review-text">"{r.text}"</div>
                <div className="review-author">{r.name}</div>
                {r.city && <div className="review-city">{r.city}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--bg)', padding: '2rem', borderRadius: '16px',
            width: '90%', maxWidth: '500px', position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ×
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Write a Review</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Honeypot field */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name *</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border2)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>City (Optional)</label>
                <input 
                  type="text" 
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border2)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Rating</label>
                <select 
                  value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border2)' }}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Review *</label>
                <textarea 
                  required rows={4}
                  value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border2)', resize: 'vertical' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                style={{
                  padding: '12px', background: 'var(--gold-dark)', color: '#fff', border: 'none',
                  borderRadius: '8px', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 'bold',
                  marginTop: '0.5rem'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
