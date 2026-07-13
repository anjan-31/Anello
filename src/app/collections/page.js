'use client';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductGallery from '../components/ProductGallery';

const PRICE_RANGES = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 – ₹50,000', min: 15000, max: 50000 },
  { label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: Infinity },
];
const CATEGORIES = ['Silver Ring'];
const SORT_OPTIONS = ['Popular', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Discount'];

function Stars({ r = 5, count = 0 }) {
  if (!count) return null;
  return <span style={{ color: '#e91e8c', fontSize: '0.8rem' }}>{'★'.repeat(Math.floor(r))}{'☆'.repeat(5 - Math.floor(r))}</span>;
}

function StarRating({ rating = 5, reviews = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ color: '#e91e8c', fontSize: '1.2rem' }}>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        {rating}/5 ({reviews.toLocaleString()} verified reviews)
      </span>
    </div>
  );
}

function CollectionsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sortBy, setSortBy] = useState('Popular');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { user } = useAuth();
  const router = useRouter();
  const {
    cart, cartOpen, setCartOpen,
    wishlist, wishlistOpen, setWishlistOpen,
    addToCart, toggleWish, mounted, showToast
  } = useCart();

  const [heroIdx, setHeroIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const desktopHero = ['/diamond-rings-hero.webp', '/gold-rings-banner.webp', '/silver-rings-banner.webp'];
  const mobileHero = ['/diamond-rings-hero.webp', '/gold-rings-banner.webp', '/silver-rings-banner.webp'];
  const heroImages = isMobile ? mobileHero : desktopHero;

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setProducts(d); })
      .catch(() => {})
      .finally(() => setLoading(false));

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const heroTimer = setInterval(() => {
      setHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 4500);

    return () => {
      clearInterval(heroTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('q') : '';

  // Sync URL search query parameter 'q'
  useEffect(() => {
    if (query) {
      setSearch(query);
    } else {
      setSearch('');
    }
  }, [query]);

  const toggleCat = (c) => setSelectedCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const togglePrice = (i) => setSelectedPrices(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const getDiscountPrice = (p) => p.badge && !isNaN(Number(p.badge)) && Number(p.badge) < p.price ? Number(p.badge) : null;
  const getDisplayPrice = (p) => getDiscountPrice(p) ?? p.price;
  const getPct = (p) => { const d = getDiscountPrice(p); return d ? Math.round(((p.price - d) / p.price) * 100) : 0; };

  let filtered = products.filter(p => {
    const dp = getDisplayPrice(p);
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCats.length === 0 || selectedCats.includes(p.cat);
    const matchPrice = selectedPrices.length === 0 || selectedPrices.some(i => dp >= PRICE_RANGES[i].min && dp <= PRICE_RANGES[i].max);
    const matchDiscount = !onlyDiscount || getDiscountPrice(p) !== null;
    return matchSearch && matchCat && matchPrice && matchDiscount;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return getDisplayPrice(a) - getDisplayPrice(b);
    if (sortBy === 'Price: High to Low') return getDisplayPrice(b) - getDisplayPrice(a);
    if (sortBy === 'Discount') return getPct(b) - getPct(a);
    return 0;
  });

  const clearFilters = () => { setSelectedCats([]); setSelectedPrices([]); setOnlyDiscount(false); setSearch(''); };
  const activeFilters = selectedCats.length + selectedPrices.length + (onlyDiscount ? 1 : 0);

  return (
    <div className="cp-page">
      <Header />


      {/* HERO */}
      <section className="hero">
        <div className="hero-slider" onClick={() => router.push('/collections')} style={{ cursor: 'pointer' }}>
          {heroImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`hero-slide ${idx === heroIdx ? 'active' : ''} ${idx % 2 === 0 ? 'zoom-in' : 'zoom-out'}`} 
              style={{ backgroundImage: `url(${img})` }} 
            />
          ))}
        </div>
        <div className="hero-line" />
        <div className="hero-content">
          {/* Text and stats removed to match homepage */}
        </div>
      </section>

      {/* ── TOOLBAR ── */}
      <div className="cp-toolbar-wrap" id="shop">
        <div className="cp-toolbar">
          <div className="cp-search-wrap">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className="cp-search" placeholder="Search rings, gold, diamond…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="cp-search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <button className="cp-filter-btn-mobile" onClick={() => setSidebarOpen(true)}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filters {activeFilters > 0 && <span className="cp-filter-count">{activeFilters}</span>}
            </button>
            <div className="cp-sort-wrap">
              <span className="cp-sort-label">Sort:</span>
              <select className="cp-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
        {activeFilters > 0 && (
          <div className="cp-active-filters">
            {selectedCats.map(c => <span key={c} className="cp-filter-pill">{c} <button onClick={() => toggleCat(c)}>✕</button></span>)}
            {selectedPrices.map(i => <span key={i} className="cp-filter-pill">{PRICE_RANGES[i].label} <button onClick={() => togglePrice(i)}>✕</button></span>)}
            {onlyDiscount && <span className="cp-filter-pill">On Sale <button onClick={() => setOnlyDiscount(false)}>✕</button></span>}
            <button className="cp-clear-all" onClick={clearFilters}>Clear All</button>
          </div>
        )}
      </div>

      <div className="cp-body">
        {/* Sidebar */}
        <aside className={`cp-sidebar ${sidebarOpen ? 'open' : ''}`} id="filters">
          <div className="cp-sidebar-head">
            <span>Filters</span>
            <button className="cp-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          {activeFilters > 0 && <button className="cp-sidebar-clear" onClick={clearFilters}>Clear All Filters</button>}

          <div className="cp-filter-group">
            <div className="cp-filter-title">Category</div>
            {CATEGORIES.map(c => (
              <label key={c} className="cp-filter-item">
                <input type="checkbox" checked={selectedCats.includes(c)} onChange={() => toggleCat(c)} />
                <span>{c}</span>
                <span className="cp-filter-count-badge">{products.filter(p => p.cat === c).length}</span>
              </label>
            ))}
          </div>

          <div className="cp-filter-group">
            <div className="cp-filter-title">Price Range</div>
            {PRICE_RANGES.map((r, i) => (
              <label key={i} className="cp-filter-item">
                <input type="checkbox" checked={selectedPrices.includes(i)} onChange={() => togglePrice(i)} />
                <span>{r.label}</span>
              </label>
            ))}
          </div>

          <div className="cp-filter-group">
            <div className="cp-filter-title">Offers</div>
            <label className="cp-filter-item">
              <input type="checkbox" checked={onlyDiscount} onChange={() => setOnlyDiscount(p => !p)} />
              <span>On Sale / Discount</span>
            </label>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && <div className="cp-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Grid */}
        <main className="cp-main">
          {loading ? (
            <div className="cp-loading">
              <div className="cp-spinner" />
              <p>Loading collection…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="cp-empty">
              <div className="cp-empty-icon">💍</div>
              <h3>No rings found</h3>
              <p>Try adjusting your filters or search term.</p>
              <button className="cp-btn-pink" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="cp-grid">
              {filtered.map(p => {
                const discountPrice = getDiscountPrice(p);
                const pct = getPct(p);
                const isWished = wishlist.includes(p._id || p.id);
                return (
                  <div key={p._id || p.id} className="cp-card" onClick={() => router.push(`/products/${p.slug}`)}>
                    {/* Badge */}
                    {pct > 0 && <span className="cp-badge">{pct}% OFF</span>}
                    {p.isNewArrival && !pct && <span className="cp-badge cp-badge-new">NEW</span>}

                    {/* Image */}
                    <div className="cp-img-wrap">
                      <div className="cp-img-container">
                        <Image
                          src={p.img || p.images?.[0] || '/placeholder.png'}
                          alt={p.name} fill
                          className="cp-img-primary"
                          style={{ objectFit: 'cover', mixBlendMode: 'darken' }}
                          sizes="(max-width:768px) 50vw, 25vw"
                        />
                        {p.images?.[1] && (
                          <Image
                            src={p.images[1]}
                            alt={`${p.name} alternate view`} fill
                            className="cp-img-secondary"
                            style={{ objectFit: 'cover', mixBlendMode: 'darken' }}
                            sizes="(max-width:768px) 50vw, 25vw"
                          />
                        )}
                      </div>
                      {/* Wishlist */}
                      <button className={`cp-wish ${isWished ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWish(p._id || p.id); }}>
                        <svg width="18" height="18" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      </button>
                      {/* Quick add overlay */}
                      <div className="cp-card-overlay">
                        <button className="cp-quick-add" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>+ Add to Cart</button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="cp-card-info">
                      <div className="cp-card-cat">{p.cat}</div>
                      <div className="cp-card-name">{p.name}</div>
                      <div className="cp-stars-row">
                        <Stars r={p.rating || 5} count={p.reviews || 0} />
                        {(p.reviews > 0) && <span className="cp-reviews">({p.reviews})</span>}
                      </div>
                      <div className="cp-price-row">
                        {discountPrice ? (
                          <>
                            <span className="cp-price-sale">₹{discountPrice.toLocaleString('en-IN')}</span>&nbsp;
                            <span className="cp-price-mrp">₹{p.price.toLocaleString('en-IN')}</span>
                          </>
                        ) : (
                          <span className="cp-price-sale">₹{p.price.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>



      <Footer />

      <style jsx>{`
        /* ─── PINK THEME ─── */
        :root {
          --pink: #e91e8c;
          --pink-light: #f8a8d4;
          --pink-soft: #fce4f3;
          --pink-dark: #c0176e;
          --pink-bg: #fce4ec;
          --pink-border: rgba(233,30,140,0.15);
        }

        .cp-page { min-height:100vh; background:var(--bg); font-family:'Inter',sans-serif; }

        /* Page Title Section - aesthetic & animated */
        .cp-page-title-section { text-align:center; padding:5rem 2rem 4rem; background:var(--bg); position:relative; overflow:hidden; border-bottom: 1px solid var(--border2); }
        .cp-page-title-section::before { content:''; position:absolute; top:-50%; left:50%; transform:translateX(-50%); width:800px; height:800px; background:radial-gradient(circle, rgba(233,30,140,0.1) 0%, transparent 60%); z-index:0; pointer-events:none; }
        .cp-title-content { position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; }
        .section-eyebrow { font-size:0.8rem; font-weight:700; letter-spacing:5px; color:#d4af37; text-transform:uppercase; margin-bottom:1.2rem; display:inline-block; animation:fadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1); text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3); }
        
        .cp-title { font-size:clamp(3.5rem, 8vw, 5.5rem); font-weight:900; color:var(--text); margin:0; line-height:1.1; letter-spacing:-2px; animation:fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .cp-title-word { display:inline-block; }
        .cp-title-word.highlight { background:linear-gradient(135deg, #e91e8c, #ff6b81, #e91e8c); background-size: 200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; font-style:italic; margin-left:16px; padding-right:15px; animation: shimmerText 3s linear infinite; }
        
        .cp-title-divider { width:80px; height:4px; background:linear-gradient(90deg, transparent, #e91e8c, transparent); margin:2rem 0; border-radius:4px; animation:scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; box-shadow: 0 0 15px rgba(233, 30, 140, 0.5); }
        
        .cp-subtitle { font-size:1rem; font-weight:600; color:#e91e8c; background:var(--card-bg); padding:8px 24px; border-radius:30px; border:1px solid rgba(233,30,140,0.15); animation:fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; box-shadow: 0 4px 15px rgba(233, 30, 140, 0.05); }

        @keyframes fadeDown { from{opacity:0; transform:translateY(-30px);} to{opacity:1; transform:translateY(0);} }
        @keyframes fadeUp { from{opacity:0; transform:translateY(30px);} to{opacity:1; transform:translateY(0);} }
        @keyframes scaleIn { from{opacity:0; transform:scaleX(0);} to{opacity:1; transform:scaleX(1);} }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        @keyframes shimmerText { to { background-position: 200% center; } }

        /* Toolbar wrapper */
        .cp-toolbar-wrap { max-width:1400px; margin:0 auto; padding:3rem 2rem 1rem; }
        .cp-filter-btn-mobile { display:none; align-items:center; gap:0.5rem; background:var(--card-bg); border:1.5px solid #e91e8c; color:#e91e8c; border-radius:10px; padding:0.5rem 1rem; font-size:0.85rem; font-weight:600; cursor:pointer; }
        @media(max-width:900px){ .cp-filter-btn-mobile{ display:flex; } }
        .cp-filter-count { background:#e91e8c; color:#fff; font-size:0.65rem; font-weight:800; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; }

        /* Toolbar */
        .cp-toolbar { display:flex; gap:1rem; align-items:center; padding-bottom:0.8rem; flex-wrap:wrap; }
        .cp-search-wrap { flex:1; min-width:220px; display:flex; align-items:center; background:var(--card-bg); border:1.5px solid var(--border2); border-radius:50px; padding:0 1rem; gap:0.5rem; transition:border-color 0.2s,box-shadow 0.2s; }
        .cp-search-wrap:focus-within { border-color:#e91e8c; box-shadow:0 0 0 3px rgba(233,30,140,0.1); }
        .cp-search-wrap svg { color:#e91e8c; flex-shrink:0; }
        .cp-search { flex:1; border:none; outline:none; font-size:0.88rem; padding:0.6rem 0; background:none; color:var(--text); }
        .cp-search::placeholder { color:var(--text-muted); }
        .cp-search-clear { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1rem; padding:4px; transition:color 0.2s; }
        .cp-search-clear:hover { color:#e91e8c; }
        .cp-sort-wrap { display:flex; align-items:center; gap:0.5rem; }
        .cp-sort-label { font-size:0.78rem; font-weight:600; color:#e91e8c; white-space:nowrap; }
        .cp-sort-select { border:1.5px solid var(--border2); border-radius:10px; padding:0.5rem 0.8rem; font-size:0.82rem; color:var(--text); background:var(--card-bg); outline:none; cursor:pointer; transition:border-color 0.2s; }
        .cp-sort-select:focus { border-color:#e91e8c; }

        /* Active filters */
        .cp-active-filters { display:flex; flex-wrap:wrap; gap:0.5rem; padding-bottom:0.8rem; align-items:center; }
        .cp-filter-pill { display:flex; align-items:center; gap:0.4rem; background:var(--bg2); border:1px solid rgba(233,30,140,0.3); border-radius:20px; padding:3px 10px; font-size:0.75rem; color:#e91e8c; font-weight:600; }
        .cp-filter-pill button { background:none; border:none; color:#e91e8c; cursor:pointer; font-size:0.8rem; padding:0; line-height:1; }
        .cp-clear-all { background:none; border:none; color:#e91e8c; font-size:0.78rem; font-weight:700; cursor:pointer; text-decoration:underline; }

        /* Body layout */
        .cp-body { display:flex; max-width:1400px; margin:0 auto; padding:1.5rem 2rem 3rem; gap:2rem; position:relative; }
        @media(max-width:600px){ .cp-body{ padding:1rem; } }

        /* Sidebar */
        .cp-sidebar { width:240px; flex-shrink:0; background:var(--card-bg); border-radius:16px; border:1px solid var(--border2); box-shadow:var(--shadow-card); padding:1.2rem; height:fit-content; position:sticky; top:160px; }
        @media(max-width:900px){
          .cp-sidebar { position:fixed; top:75px; left:0; height:calc(100vh - 75px); z-index:500; transform:translateX(-100%); transition:transform 0.35s cubic-bezier(0.165,0.84,0.44,1); border-radius:0; overflow-y:auto; }
          .cp-sidebar.open { transform:translateX(0); }
        }
        .cp-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:499; }
        .cp-sidebar-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
        .cp-sidebar-head span { font-weight:800; font-size:1rem; background:linear-gradient(135deg,#e91e8c,#f06292); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .cp-sidebar-close { background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--text-muted); display:none; }
        @media(max-width:900px){ .cp-sidebar-close{ display:block; } }
        .cp-sidebar-clear { width:100%; background:var(--bg2); border:none; color:#e91e8c; font-weight:700; font-size:0.8rem; border-radius:8px; padding:0.5rem; cursor:pointer; margin-bottom:1rem; transition:background 0.2s; }
        .cp-sidebar-clear:hover { background:var(--border2); }

        .cp-filter-group { margin-bottom:1.4rem; padding-bottom:1.4rem; border-bottom:1px solid var(--border2); }
        .cp-filter-group:last-child { border-bottom:none; margin-bottom:0; }
        .cp-filter-title { font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:#e91e8c; margin-bottom:0.8rem; }
        .cp-filter-item { display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem; cursor:pointer; font-size:0.85rem; color:var(--text-muted); transition:color 0.2s; }
        .cp-filter-item:hover { color:#e91e8c; }
        .cp-filter-item input[type="checkbox"] { accent-color:#e91e8c; width:15px; height:15px; flex-shrink:0; cursor:pointer; }
        .cp-filter-item span:first-of-type { flex:1; }
        .cp-filter-count-badge { font-size:0.68rem; color:#fff; background:#e91e8c; border-radius:10px; padding:1px 6px; font-weight:700; }

        /* Main */
        .cp-main { flex:1; min-width:0; }
        .cp-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:6rem 2rem; gap:1rem; color:#e91e8c; }
        .cp-spinner { width:40px; height:40px; border:4px solid rgba(233,30,140,0.2); border-top-color:#e91e8c; border-radius:50%; animation:cpSpin 0.8s linear infinite; }
        @keyframes cpSpin { to{ transform:rotate(360deg); } }
        .cp-empty { text-align:center; padding:5rem 2rem; }
        .cp-empty-icon { font-size:4rem; margin-bottom:1rem; }
        .cp-empty h3 { font-size:1.4rem; color:var(--text); margin-bottom:0.5rem; }
        .cp-empty p { color:#e91e8c; opacity:0.7; margin-bottom:1.5rem; }
        .cp-btn-pink { background:linear-gradient(135deg,#e91e8c,#f06292); color:#fff; border:none; padding:0.7rem 2rem; border-radius:50px; font-weight:700; cursor:pointer; font-size:0.9rem; transition:opacity 0.2s,transform 0.2s; }
        .cp-btn-pink:hover { opacity:0.9; transform:translateY(-1px); }

        /* Grid */
        .cp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1.2rem; }
        @media(max-width:600px){ .cp-grid{ grid-template-columns:1fr 1fr; gap:0.8rem; } }

        /* Card */
        .cp-card { background:var(--card-bg); border-radius:16px; border:1px solid var(--border2); box-shadow:var(--shadow-card); overflow:hidden; position:relative; transition:transform 0.3s,box-shadow 0.3s,border-color 0.3s; cursor:pointer; }
        .cp-card:hover { transform:translateY(-6px); box-shadow:0 12px 40px rgba(233,30,140,0.15); border-color:rgba(233,30,140,0.3); }

        .cp-badge { position:absolute; top:10px; left:10px; z-index:2; background:linear-gradient(135deg,#e91e8c,#c0176e); color:#fff; font-size:0.65rem; font-weight:800; padding:3px 9px; border-radius:20px; letter-spacing:0.5px; box-shadow:0 2px 8px rgba(233,30,140,0.35); }
        .cp-badge-new { background:linear-gradient(135deg,#059669,#34d399); }

        .cp-img-wrap { position:relative; height:200px; background:var(--bg2); overflow:hidden; }
        @media(max-width:600px){ .cp-img-wrap{ height:160px; } }

        .cp-wish { position:absolute; top:10px; right:10px; z-index:2; background:var(--bg); border:1px solid var(--border2); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-muted); transition:all 0.2s; opacity:0; }
        .cp-card:hover .cp-wish { opacity:1; }
        .cp-wish.active { color:#e91e8c; opacity:1; border-color:#e91e8c; }
        .cp-wish:hover { color:#e91e8c; border-color:#e91e8c; transform:scale(1.1); }

        .cp-card-overlay { position:absolute; inset:0; background:rgba(233,30,140,0.08); display:flex; align-items:flex-end; justify-content:center; padding-bottom:1rem; opacity:0; transition:opacity 0.25s; }
        .cp-card:hover .cp-card-overlay { opacity:1; }
        .cp-quick-add { background:linear-gradient(135deg,#e91e8c,#f06292); color:#fff; border:none; border-radius:50px; padding:0.5rem 1.4rem; font-weight:700; font-size:0.8rem; cursor:pointer; box-shadow:0 4px 15px rgba(233,30,140,0.35); transition:transform 0.2s; }
        .cp-quick-add:hover { transform:scale(1.05); }

        .cp-card-info { padding:1rem; }
        .cp-card-cat { font-size:0.68rem; letter-spacing:2px; text-transform:uppercase; color:#e91e8c; margin-bottom:0.3rem; font-weight:600; }
        .cp-card-name { font-size:0.9rem; font-weight:700; color:var(--text); margin-bottom:0.4rem; line-height:1.3; }
        .cp-stars-row { display:flex; align-items:center; gap:0.3rem; margin-bottom:0.6rem; }
        .cp-reviews { font-size:0.72rem; color:var(--text-muted); }
        .cp-price-row { display:flex; align-items:center; justify-content:space-between; }
        .cp-price-sale { font-size:1.05rem; font-weight:800; color:var(--text); }
        .cp-price-mrp { font-size:0.78rem; color:var(--text-muted); text-decoration:line-through; margin-left:0.4rem; }
        .cp-add-btn { background:linear-gradient(135deg,#e91e8c,#f06292); border:none; color:#fff; width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:1.1rem; font-weight:700; display:flex; align-items:center; justify-content:center; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 2px 8px rgba(233,30,140,0.3); }
        .cp-add-btn:hover { transform:scale(1.1); box-shadow:0 4px 14px rgba(233,30,140,0.45); }

        /* Modal */
        .cp-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:9999; display:flex; align-items:center; justify-content:center; padding:1rem; backdrop-filter:blur(4px); }
        .cp-modal { background:var(--card-bg); width:100%; max-width:1050px; border-radius:24px; position:relative; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.4); animation:modalIn 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes modalIn { from{opacity:0; transform:scale(0.95) translateY(20px);} to{opacity:1; transform:scale(1) translateY(0);} }
        .cp-modal-close { position:absolute; top:1.2rem; right:1.2rem; background:var(--bg2); border:1px solid var(--border2); width:38px; height:38px; border-radius:50%; font-size:1.2rem; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:50; transition:all 0.2s; color:var(--text); }
        .cp-modal-close:hover { background:rgba(212,175,55,0.1); color:#d4af37; transform:rotate(90deg); }
        .cp-modal-scroll-container { max-height:85vh; overflow-y:auto; }
        .cp-modal-grid { display:grid; grid-template-columns:1.15fr 0.85fr; gap:3rem; padding:2rem 2.5rem; }
        .cp-modal-info { display:flex; flex-direction:column; justify-content:flex-start; }
        .cp-modal-btn-buy { background:linear-gradient(135deg,#d4af37,#c8a028); color:#fff; border:none; padding:1rem; border-radius:12px; font-weight:700; font-size:1rem; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 4px 15px rgba(212,175,55,0.3); }
        .cp-modal-btn-buy:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(212,175,55,0.45); }
        .cp-modal-btn-cart { background:var(--bg); color:#d4af37; border:2px solid #d4af37; padding:1rem; border-radius:12px; font-weight:700; font-size:1rem; cursor:pointer; transition:all 0.2s; }
        .cp-modal-btn-cart:hover { background:rgba(212,175,55,0.05); transform:translateY(-2px); }
        .cp-modal-policy-details { transition:all 0.2s ease-in-out; }
        .cp-modal-policy-details[open] { border-color:rgba(212,175,55,0.3) !important; box-shadow:0 4px 15px rgba(212,175,55,0.05); }
        .cp-modal-policy-details summary::-webkit-details-marker { display:none; }
        .cp-modal-policy-plus { transition:transform 0.2s; }
        .cp-modal-policy-details[open] .cp-modal-policy-plus { transform:rotate(45deg); }
        @media(max-width:768px){
          .cp-modal-grid { grid-template-columns:1fr; gap:2rem; padding:1.2rem; }
          .cp-modal { width:95%; max-height:90vh; border-radius:20px; }
          .cp-modal-scroll-container { max-height:90vh; }
          .cp-modal-policies-section { padding:0 1.2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="cp-loading"><div className="cp-spinner" /><p>Loading collection…</p></div>}>
      <CollectionsContent />
    </Suspense>
  );
}
