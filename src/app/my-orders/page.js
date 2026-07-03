'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const getFixedUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  if (cleanUrl.startsWith('image/upload') || cleanUrl.startsWith('ge/upload')) {
     const path = cleanUrl.replace('ge/upload', 'image/upload');
     return `https://res.cloudinary.com/dhc6iqrbh/${path}`;
  }
  return url;
};

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review System States
  const [activeReviewProduct, setActiveReviewProduct] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewWebsite, setReviewWebsite] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReviewImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    
    try {
      let imageUrl = '';
      if (reviewImagePreview) {
        // Upload image to Cloudinary via /api/upload
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reviewImagePreview })
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          console.error('Image upload failed');
        }
      }
      
      const reviewRes = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: activeReviewProduct.productId,
          name: reviewName || user?.name || 'Anonymous',
          city: reviewCity,
          rating: reviewRating,
          text: reviewText,
          image: imageUrl,
          website: reviewWebsite
        })
      });
      
      if (reviewRes.ok) {
        alert('Thank you! Your review has been submitted successfully.');
        setReviewModalOpen(false);
        setActiveReviewProduct(null);
        setReviewText('');
        setReviewCity('');
        setReviewImage(null);
        setReviewImagePreview(null);
        setReviewWebsite('');
      } else {
        const err = await reviewRes.json();
        alert(`Failed to submit review: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submit review error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/my-orders?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (authLoading || loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)' }}>Loading your orders...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg2)', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>My Orders</h1>
          <Link href="/" style={{ padding: '0.8rem 1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '50px', color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}>
            ← Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ background: 'var(--card-bg)', padding: '4rem 2rem', textAlign: 'center', borderRadius: '16px', border: '1px solid var(--border2)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>No orders found</h2>
            <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet. Once you do, they will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order._id} style={{ background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border2)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border2)' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Order Placed</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Order ID</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>#{order.orderId || order._id.toString().slice(-8).toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Total</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-dark)' }}>₹{(order.total || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                    
                    <div style={{ flex: '1 1 300px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '1.2rem', borderBottom: idx < order.items.length - 1 ? '1px dashed var(--border2)' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                              {item.image ? (
                                <img src={getFixedUrl(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                item.emoji
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>{item.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Qty: {item.qty} • ₹{(item.price || 0).toLocaleString('en-IN')}
                                {item.ringSize && (
                                  <span style={{
                                    marginLeft: '0.5rem', fontWeight: 700,
                                    color: '#d4af37', fontSize: '0.78rem'
                                  }}>
                                    • 💍 Size {item.ringSize}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setActiveReviewProduct(item);
                              setReviewName(user?.name || '');
                              setReviewRating(5);
                              setReviewText('');
                              setReviewCity('');
                              setReviewImage(null);
                              setReviewImagePreview(null);
                              setReviewModalOpen(true);
                            }}
                            style={{
                              background: 'none', border: '1px solid #d4af37',
                              borderRadius: '20px', padding: '0.4rem 1rem',
                              color: '#d4af37', fontSize: '0.8rem', fontWeight: 600,
                              cursor: 'pointer', transition: 'all 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            className="btn-write-review"
                          >
                            ✍️ Write Review
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ flex: '0 0 250px', background: 'var(--bg2)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border2)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 700 }}>Shipping Details</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
                        {order.addressDetails ? (
                          <>
                            <strong>{order.addressDetails.fullName}</strong><br/>
                            {order.addressDetails.fullAddress}<br/>
                            {order.addressDetails.city}, {order.addressDetails.state} - {order.addressDetails.pincode}<br/>
                            Phone: {order.phone}
                          </>
                        ) : (
                          <>
                            <strong>{order.customerName}</strong><br/>
                            {order.address}<br/>
                            Phone: {order.phone}
                          </>
                        )}
                      </div>
                      
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border2)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem', fontWeight: 700 }}>Order Status</div>
                        <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize', background: order.status === 'processing' ? '#fef3c7' : '#d1fae5', color: order.status === 'processing' ? '#92400e' : '#065f46' }}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── REVIEW MODAL ── */}
      {reviewModalOpen && activeReviewProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 9999, display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)'
        }} onClick={() => setReviewModalOpen(false)}>
          <div style={{
            background: 'var(--card-bg)', width: '100%', maxWidth: '500px',
            borderRadius: '20px', padding: '2rem', position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)', animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)'
          }} onClick={e => e.stopPropagation()}>
            
            <button 
              onClick={() => setReviewModalOpen(false)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'var(--bg2)', border: '1px solid var(--border2)',
                width: '32px', height: '32px', borderRadius: '50%',
                fontSize: '1rem', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', color: 'var(--text)'
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
              Write a Review
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Share your experience with <strong>{activeReviewProduct.name}</strong>
            </p>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Honeypot field */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  value={reviewWebsite}
                  onChange={e => setReviewWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              
              {/* Rating selection (Stars) */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>
                  Rating *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '2rem', padding: 0,
                        color: star <= reviewRating ? '#e91e8c' : 'var(--border)'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & City */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    style={{
                      width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                      border: '1px solid var(--border2)', background: 'var(--bg2)',
                      color: 'var(--text)', outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>
                    Your City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={reviewCity}
                    onChange={e => setReviewCity(e.target.value)}
                    style={{
                      width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                      border: '1px solid var(--border2)', background: 'var(--bg2)',
                      color: 'var(--text)', outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What did you like or dislike about this ring? How was the fit?"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  style={{
                    width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                    border: '1px solid var(--border2)', background: 'var(--bg2)',
                    color: 'var(--text)', outline: 'none', resize: 'vertical',
                    fontSize: '0.9rem', fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Image upload (Optional) */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '0.4rem' }}>
                  Add Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
                />
                {reviewImagePreview && (
                  <div style={{ marginTop: '0.8rem', position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border2)' }}>
                    <img src={reviewImagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => { setReviewImage(null); setReviewImagePreview(null); }}
                      style={{
                        position: 'absolute', top: 2, right: 2,
                        background: 'rgba(0,0,0,0.5)', border: 'none',
                        color: '#fff', borderRadius: '50%', width: '18px',
                        height: '18px', fontSize: '0.7rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  background: 'linear-gradient(135deg,#d4af37,#c8a028)', color: '#fff',
                  border: 'none', padding: '1rem', borderRadius: '12px',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
                  marginTop: '0.5rem', opacity: submittingReview ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                {submittingReview ? (
                  <>
                    <span className="spinner-mini" /> Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .btn-write-review:hover {
          background: #d4af37 !important;
          color: #fff !important;
        }
        .spinner-mini {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
