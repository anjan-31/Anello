'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchAddressLoading, setFetchAddressLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    fullAddress: '',
    city: '',
    state: '',
    pincode: '',
    website: ''
  });

  useEffect(() => {
    // Load cart from localStorage
    try {
      const storedCart = localStorage.getItem('checkout_cart');
      const storedTotal = localStorage.getItem('checkout_total');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        router.push('/'); // Redirect to home if no cart
      }
      if (storedTotal) setCartTotal(Number(storedTotal));
    } catch (e) {}
  }, [router]);

  useEffect(() => {
    const fetchLastAddress = async () => {
      if (!user) {
        setFetchAddressLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/orders/last-address?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setForm(prev => ({
              ...prev,
              fullName: data.fullName || user.name || '',
              phone: data.phone || '',
              fullAddress: data.fullAddress || '',
              city: data.city || '',
              state: data.state || '',
              pincode: data.pincode || ''
            }));
          } else {
            // Pre-fill name from user object if no past order
            setForm(prev => ({ ...prev, fullName: user.name || '' }));
          }
        }
      } catch (e) {
        console.error('Failed to fetch last address', e);
      } finally {
        setFetchAddressLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        // Must be logged in to checkout
        router.push('/login?redirect=/checkout');
      } else {
        fetchLastAddress();
      }
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (msg, icon = '✅') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const orderData = {
      customerName: form.fullName,
      customerEmail: user.email,
      items: cart.map(i => ({
        productId: i._id || i.id || null,
        name: i.name,
        price: i.price,
        qty: i.qty,
        emoji: i.emoji,
        image: i.images?.[0] || i.img || '',
        ringSize: i.ringSize || null
      })),
      total: cartTotal,
      address: `${form.fullAddress}, ${form.city}, ${form.state} - ${form.pincode}`, // Fallback string
      addressDetails: form, // Structured data
      phone: form.phone,
      paymentMethod: 'COD',
      website: form.website
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        showToast('Order placed successfully! 🎊', '💍');
        localStorage.removeItem('checkout_cart');
        localStorage.removeItem('checkout_total');
        setTimeout(() => {
          router.push('/my-orders');
        }, 1500);
      } else {
        showToast('Failed to place order', '❌');
        setLoading(false);
      }
    } catch (err) {
      showToast('Connection error', '❌');
      setLoading(false);
    }
  };

  if (authLoading || fetchAddressLoading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg)' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg2)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        {/* LEFT COLUMN: Form */}
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border2)' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>Shipping Details</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Please enter your address details below. We currently only offer Cash on Delivery (COD).</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Honeypot field */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                Full Name *
                <input required type="text" name="fullName" value={form.fullName} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                Phone Number *
                <input required type="tel" name="phone" value={form.phone} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
              </label>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
              Full Address (House No, Building, Street, Area) *
              <textarea required name="fullAddress" value={form.fullAddress} onChange={handleChange} rows="3" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', outline: 'none', resize: 'vertical' }} />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                City *
                <input required type="text" name="city" value={form.city} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                State *
                <input required type="text" name="state" value={form.state} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                Pin Code *
                <input required type="text" name="pincode" value={form.pincode} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border2)', background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
              </label>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input type="radio" checked readOnly style={{ accentColor: 'var(--gold)', transform: 'scale(1.2)' }} />
              <div>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.2rem' }}>Cash on Delivery (COD)</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pay at your doorstep when your order arrives.</span>
              </div>
            </div>

            <button type="submit" disabled={loading || cart.length === 0} style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', color: '#fff', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 800, fontSize: '1.1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing...' : 'Confirm Order →'}
            </button>
            <button type="button" onClick={() => router.back()} style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', marginTop: '0.5rem', textDecoration: 'underline' }}>
              Cancel and Return
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '16px', height: 'fit-content', position: 'sticky', top: '2rem', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border2)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border2)', paddingBottom: '1rem' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '40vh', overflowY: 'auto' }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: 'var(--bg2)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  {item.images?.[0] || item.img ? <Image src={item.images?.[0] || item.img} alt={item.name} fill style={{ objectFit: 'contain', padding: '4px' }} /> : <span style={{ fontSize: '2rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{item.emoji}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Qty: {item.qty}{item.ringSize ? <span style={{ marginLeft: '0.5rem', fontWeight: 700, color: '#d4af37' }}>• Size {item.ringSize}</span> : null}
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)' }}>
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border2)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <span>Shipping</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text)', fontSize: '1.2rem', fontWeight: 800, marginTop: '0.5rem', borderTop: '1px dashed var(--border2)', paddingTop: '1rem' }}>
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'var(--card-bg)', border: '1px solid var(--border2)', padding: '1rem 2rem', borderRadius: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 9999, fontWeight: 700, animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <span>{toast.icon}</span> <span style={{ color: 'var(--text)' }}>{toast.msg}</span>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}} />
    </div>
  );
}
