'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    cart, cartOpen, setCartOpen,
    wishlist, wishlistOpen, setWishlistOpen,
    toast, addToCart, removeFromCart, changeQty, toggleWish,
    cartCount, cartTotal, mounted
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const shopMenuRef = useRef(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [locationText, setLocationText] = useState('Update Delivery Pincode');

  const updateLocation = (text) => {
    setLocationText(text);
    // Only save real detected locations (not fallback messages)
    if (text && text.startsWith('Delivering to:')) {
      localStorage.setItem('anello_delivery_pincode', text);
    }
  };

  const NAV_CATEGORIES = [
    { name: 'Silver Rings', href: '/silver-rings' },
    { name: 'Engagement Rings', href: '/engagement-rings' },
    { name: 'Couple Rings', href: '/couple-rings' },
    { name: 'Minimalist Rings', href: '/minimalist-rings' },
    { name: 'Luxury Rings', href: '/luxury-rings' },
  ];

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data && !data.error && Array.isArray(data)) setDbProducts(data);
      } catch (e) {
        console.error('Fetch products error:', e);
      }
    };
    fetchProds();

    const savedPin = localStorage.getItem('anello_delivery_pincode');
    if (savedPin && savedPin.startsWith('Delivering to:')) {
      setLocationText(savedPin);
    } else {
      // Auto-detect location on page load
      setLocationText('Detecting location...');
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // BigDataCloud — with API key for better accuracy
              const res = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${process.env.NEXT_PUBLIC_BIGDATACLOUD_KEY}`
              );
              const data = await res.json();
              const pincode = data.postcode || data.principalSubdivisionCode || '';
              const city = data.city || data.locality || data.principalSubdivision || '';
              if (city || pincode) {
                updateLocation(`Delivering to: ${city}${pincode ? ' ' + pincode : ''}`.trim());
              } else {
                setLocationText('Update Delivery Pincode');
              }
            } catch {
              setLocationText('Update Delivery Pincode');
            }
          },
          async () => {
            // GPS denied — fallback to IP detection
            try {
              const res = await fetch('https://ipinfo.io/json');
              const data = await res.json();
              if (data?.city && data?.postal) {
                updateLocation(`Delivering to: ${data.city} ${data.postal}`);
              } else if (data?.city) {
                updateLocation(`Delivering to: ${data.city}`);
              } else {
                setLocationText('Update Delivery Pincode');
              }
            } catch {
              setLocationText('Update Delivery Pincode');
            }
          },
          { timeout: 10000 }
        );
      } else {
        // Geolocation not supported — fallback to IP
        (async () => {
          try {
            const res = await fetch('https://ipinfo.io/json');
            const data = await res.json();
            if (data?.city && data?.postal) {
              updateLocation(`Delivering to: ${data.city} ${data.postal}`);
            } else if (data?.city) {
              updateLocation(`Delivering to: ${data.city}`);
            } else {
              setLocationText('Update Delivery Pincode');
            }
          } catch { setLocationText('Update Delivery Pincode'); }
        })();
      }
    }

    const handleOutsideClick = (e) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target)) {
        setShopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/collections?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      showToast('Please login to place an order', '🔐');
      return;
    }
    setCartOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      {/* TOP NAVIGATION BAR */}
      <div className="top-nav-bar hide-mobile">
        <div className="top-nav-inner">
          <Link href="/" className="top-nav-link">HOME</Link>
          <div className="top-nav-dropdown" ref={shopMenuRef}>
            <button className="top-nav-link shop-btn" onClick={() => setShopMenuOpen(!shopMenuOpen)}>
              SHOP <span className="dropdown-arrow">{shopMenuOpen ? '⌃' : '⌄'}</span>
            </button>
            {shopMenuOpen && (
              <div className="shop-dropdown-menu">
                <div className="shop-dropdown-header">ALL PRODUCTS</div>
                <div className="shop-dropdown-list">

                  <Link href="/gold-rings" className="shop-dropdown-item" onClick={() => setShopMenuOpen(false)}>
                    <span>Gold Rings</span>
                  </Link>
                  <Link href="/silver-rings" className="shop-dropdown-item" onClick={() => setShopMenuOpen(false)}>
                    <span>Silver Rings</span>
                  </Link>
                  <Link href="/bestsellers" className="shop-dropdown-item" onClick={() => setShopMenuOpen(false)}>
                    <span>Best Sellers</span>
                  </Link>
                  <Link href="/collections" className="shop-dropdown-item" onClick={() => setShopMenuOpen(false)}>
                    <span>All Rings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link href="/trust" className="top-nav-link">ABOUT US</Link>
          <Link href="#testimonials" className="top-nav-link">TESTIMONIALS</Link>
          <a href="mailto:worldanello@gmail.com" className="top-nav-link">CONTACT US</a>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`nav-overlay ${mobileMenuOpen ? 'show' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <Image src="/logo.png" alt="Anello Fine Rings Logo" width={220} height={85} className="drawer-logo" style={{ objectFit: 'contain', width: 'auto' }} />
          <button className="drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">✕</button>
        </div>

        <div className="nav-categories drawer-nav">
          {NAV_CATEGORIES.map(item => (
            <Link key={item.name} href={item.href} className="nav-cat-item" onClick={() => setMobileMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Guest User Promo Section */}
        {!user && (
          <a href="/login" className="mobile-user-promo" onClick={() => setMobileMenuOpen(false)}>
            <div className="user-avatar-placeholder">👤</div>
            <div className="user-promo-text">
              <span className="user-promo-name">Guest User</span>
              <span className="user-promo-sub"> Tap to Login/Sign up</span>
            </div>
          </a>
        )}
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-inner">
          
          {/* ROW 1: Icons and Logo */}
          <div className="nav-top-row">
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? '✕' : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
              )}
            </button>

            <Link href="/" className="logo-img-link" style={{ flex: 1 }}>
              <Image src="/logo.png" alt="Anello Fine Rings" width={240} height={100} className="logo-img" priority style={{ height: '115px', width: 'auto', marginLeft: '-1rem', objectFit: 'contain' }} />
            </Link>

            <div className="nav-actions">
              {/* Account Icon */}
              <button className="nav-icon-btn" onClick={() => user ? setUserMenuOpen(p => !p) : router.push('/login')} aria-label="Account">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span className="icon-label hide-mobile">ACCOUNT</span>
              </button>

              {/* Wishlist Icon */}
              <button className="nav-icon-btn" onClick={() => setWishlistOpen(true)} aria-label="Wishlist">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                <span className="icon-label hide-mobile">WISHLIST</span>
              </button>

              {/* Cart Icon */}
              <button className="nav-icon-btn nav-cart-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
                <div style={{ position: 'relative' }}>
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                  {mounted && cartCount > 0 && <span className="cart-badge-pink">{cartCount}</span>}
                </div>
                <span className="icon-label hide-mobile">CART</span>
              </button>

            </div>

            {/* Desktop User Account Dropdown */}
            {mounted && userMenuOpen && user && (
              <div className="user-dropdown" style={{ right: '100px', top: '70px', position: 'absolute', zIndex: 2000 }}>
                <div className="user-dropdown-header">
                  <div className="user-dropdown-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div className="user-dropdown-name">{user.name}</div>
                    <div className="user-dropdown-email">{user.email}</div>
                  </div>
                </div>
                <div className="user-dropdown-divider" />
                {user.role === 'admin' && (
                  <button className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); router.push('/admin'); }} style={{ color: 'var(--gold-dark)', fontWeight: 'bold' }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Admin Panel
                  </button>
                )}
                <button className="user-dropdown-item" onClick={() => { setUserMenuOpen(false); router.push('/my-orders'); }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /></svg>
                  My Orders
                </button>
                <div className="user-dropdown-divider" />
                <button className="user-dropdown-item user-dropdown-logout" onClick={() => { logout(); setUserMenuOpen(false); }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* ROW 2: Pincode */}
          <div className="nav-pincode-row" onClick={() => {
            const prevLocation = locationText;
            if ("geolocation" in navigator) {
              setLocationText("Locating...");
              navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                  const data = await res.json();
                  const pincode = data.address?.postcode;
                  const city = data.address?.city || data.address?.town || data.address?.state_district || "";
                  if (pincode) {
                    updateLocation(`Delivering to: ${city ? city + ' ' : ''}${pincode}`);
                  } else {
                    const pin = window.prompt("Could not detect pincode. Enter manually:");
                    if (pin && pin.trim().length > 0) updateLocation(`Delivering to: ${pin.trim()}`);
                    else setLocationText(prevLocation);
                  }
                } catch (err) {
                  const pin = window.prompt("Could not fetch location data. Enter manually:");
                  if (pin && pin.trim().length > 0) updateLocation(`Delivering to: ${pin.trim()}`);
                  else setLocationText(prevLocation);
                }
              }, (error) => {
                const pin = window.prompt("Location access denied. Enter manually:");
                if (pin && pin.trim().length > 0) updateLocation(`Delivering to: ${pin.trim()}`);
                else setLocationText(prevLocation);
              });
            } else {
              const pin = window.prompt("Enter your Delivery Pincode:");
              if (pin && pin.trim().length > 0) updateLocation(`Delivering to: ${pin.trim()}`);
            }
          }}>
            <div className="pincode-content">
              <span className="pincode-label hide-mobile">Where to Deliver?</span>
              <div className="pincode-bottom">
                <svg width="14" height="14" fill="none" stroke="#e87a90" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span className="pincode-text">{locationText}</span>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="pincode-arrow" style={{ flexShrink: 0 }}><polyline points="6 9 12 15 18 9" /></svg>
              </div>
            </div>
          </div>

          {/* ROW 3: Search Bar */}
          <div className="nav-search-row">
            <form onSubmit={(e) => { e.preventDefault(); if (searchVal.trim()) router.push(`/collections?q=${encodeURIComponent(searchVal)}`); }} className="search-form-full">
              <div className="search-bar-giva">
                <input type="text" placeholder='Search "Rings"' value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
                <button type="submit" aria-label="Search" className="search-icon-btn">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* ROW 4: Jewelry Toggle */}
          <div className="nav-toggle-row hide-desktop">
            <div className="jewelry-toggle-group">
              <button className="jewelry-toggle-btn active">Silver Jewellery</button>
            </div>
          </div>

        </div>
      </nav>



      {/* CART SIDEBAR */}
      {mounted && (
        <>
          <div className={`cart-overlay${cartOpen ? ' open' : ''}`} onClick={() => setCartOpen(false)} />
          <div className={`cart-sidebar${cartOpen ? ' open' : ''}`} id="cart-sidebar">
            <div className="cart-header">
              <h3>Your Selection {cartCount > 0 && `(${cartCount})`}</h3>
              <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">💍</div>
                  <p>Your cart is empty</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>Add rings to get started</p>
                  <button className="btn-gold" style={{ marginTop: '1rem', width: '100%', padding: '0.8rem' }} onClick={() => { setCartOpen(false); router.push('/collections'); }}>Explore Collection</button>
                </div>
              ) : cart.map(item => (
                <div key={item.cartKey || item._id || item.id} className="cart-item">
                  <div className="cart-item-img" style={{ position: 'relative', overflow: 'hidden' }}>
                    {item.img ? (
                      <Image src={item.img} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      '💍'
                    )}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-cat">{item.cat}</div>
                    <div className="cart-item-name">{item.name}</div>
                    {item.ringSize && (
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4af37', marginBottom: '0.2rem' }}>
                        💍 Size {item.ringSize}
                      </div>
                    )}
                    <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => changeQty(item.cartKey || item._id || item.id, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.cartKey || item._id || item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item.cartKey || item._id || item.id)}>🗑</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-payment-method" style={{ marginBottom: '1rem', padding: '0.8rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border2)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text)' }}>Payment Method</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text)' }}>
                    <input type="radio" name="payment" value="COD" checked readOnly style={{ accentColor: 'var(--gold)' }} />
                    Cash on Delivery (COD)
                  </label>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay when your order is delivered.</p>
                </div>
                <div className="cart-total">
                  <span>Total</span>
                  <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
                <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCheckout}>
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* WISHLIST SIDEBAR */}
      {mounted && (
        <>
          <div className={`cart-overlay${wishlistOpen ? ' open' : ''}`} onClick={() => setWishlistOpen(false)} />
          <div className={`cart-sidebar${wishlistOpen ? ' open' : ''}`} style={{ left: 0, right: 'auto', transform: wishlistOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
            <div className="cart-header">
              <h3>Your Wishlist ❤️</h3>
              <button className="close-btn" onClick={() => setWishlistOpen(false)}>✕</button>
            </div>
            <div className="cart-items" style={{ padding: '1rem' }}>
              {wishlist.length === 0 ? (
                <div className="cart-empty">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♡</div>
                  <p>Your wishlist is empty</p>
                  <button className="btn-gold" style={{ marginTop: '1rem', width: '100%', padding: '0.8rem' }} onClick={() => { setWishlistOpen(false); router.push('/collections'); }}>Explore Collection</button>
                </div>
              ) : (
                wishlist.map(id => {
                  const p = (dbProducts.length > 0 ? dbProducts : []).find(x => (x._id || x.id) === id);
                  if (!p) return null;
                  return (
                    <div key={id} className="cart-item">
                      <div className="cart-item-img" style={{ fontSize: '1rem', position: 'relative' }}>
                        <Image src={p.img || p.images?.[0] || '/placeholder.png'} alt={p.name} fill sizes="80px" style={{ objectFit: 'cover', borderRadius: '8px' }} />
                      </div>
                      <div className="cart-item-info">
                        <div className="cart-item-cat">{p.cat}</div>
                        <div className="cart-item-name">{p.name}</div>
                        <div className="cart-item-price">₹{p.price.toLocaleString('en-IN')}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button className="add-cart" onClick={() => { addToCart(p); toggleWish(id); }} style={{ width: '32px', height: '32px' }}>+</button>
                        <button className="remove-item" onClick={() => toggleWish(id)}>×</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* TOAST ALERTS */}
      {mounted && toast && (
        <div className="toast show">
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}
