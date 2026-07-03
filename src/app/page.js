'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from './context/ThemeContext';
import dynamic from 'next/dynamic';
import { useCart } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';

const StylishCollections = dynamic(() => import('./components/StylishCollections'), { ssr: true });
const BestSellers = dynamic(() => import('./components/BestSellers'), { ssr: true });
const SiteReviews = dynamic(() => import('./components/SiteReviews'), { ssr: false });
import { buildFAQSchema } from '@/lib/seo';


const CATEGORIES = [
  { id: 1, img: '/silver_cat_onhand.png', name: 'Silver Rings', count: '320' },
  { id: 2, img: '/gold_cat_ornate.png', name: 'Gold Rings', count: '340' },
  { id: 3, img: '/diamond_cat_onhand.png', name: 'Diamond Rings', count: '480' },
];

const NAV_CATEGORIES = [
  { name: 'Minimalist Rings', href: '/minimalist-rings' },
  { name: 'Couple Rings', href: '/couple-rings' },
  { name: 'Engagement Rings', href: '/engagement-rings' },
  { name: 'Luxury Rings', href: '/luxury-rings' },
];

const PRODUCTS = [
  { id: 1, slug: '18k-white-gold-eternal-diamond-solitaire-ring', img: '/products/1.png', name: '18K White Gold Eternal Diamond Solitaire Ring for Women | Anello', cat: 'Diamond Ring', material: '18K White Gold • 1.2ct Diamond', price: 189999, oldPrice: 249999, rating: 5, reviews: 312, badge: '-24%', isNewArrival: false },
  { id: 2, slug: '22k-classic-yellow-gold-band-for-men', img: '/products/2.png', name: '22K Classic Yellow Gold Band for Men | Anello', cat: 'Gold Ring', material: '22K Yellow Gold • 4mm', price: 28999, oldPrice: 34999, rating: 4.8, reviews: 876, badge: null, isNewArrival: false },
  { id: 3, slug: '18k-rose-gold-twisted-halo-diamond-engagement-ring', img: '/products/3.png', name: '18K Rose Gold Twisted Halo Diamond Engagement Ring | Anello', cat: 'Gold Ring', material: '18K Rose Gold • 0.5ct Diamond', price: 74999, oldPrice: 94999, rating: 4.9, reviews: 241, badge: '-21%', isNewArrival: false },
  { id: 4, slug: 'platinum-princess-cut-trilogy-diamond-bridal-ring', img: '/products/4.png', name: 'Platinum Princess Cut Trilogy Diamond Bridal Ring | Anello', cat: 'Diamond Ring', material: 'Platinum • 1.5ct Total', price: 299999, oldPrice: 379999, rating: 5, reviews: 128, badge: '-21%', isNewArrival: false },
  { id: 5, slug: 'sterling-silver-natural-amethyst-floral-ring', img: '/products/5.png', name: 'Sterling Silver Natural Amethyst Floral Ring | Anello', cat: 'Silver Ring', material: 'Sterling Silver • Natural Amethyst', price: 12499, oldPrice: 16999, rating: 4.6, reviews: 543, badge: null, isNewArrival: true },
  { id: 6, slug: 'matte-black-titanium-band-for-men', img: '/products/6.png', name: 'Matte Black Titanium Band for Men | Anello', cat: 'Silver Ring', material: 'Black Titanium • 6mm Width', price: 8999, oldPrice: 12999, rating: 4.7, reviews: 389, badge: '-31%', isNewArrival: false },
  { id: 7, slug: '18k-gold-natural-emerald-diamond-cluster-ring', img: '/products/7.png', name: '18K Gold Natural Emerald & Diamond Cluster Ring | Anello', cat: 'Gold Ring', material: '18K Gold • Natural Emerald', price: 134999, oldPrice: 169999, rating: 4.8, reviews: 97, badge: null, isNewArrival: true },
  { id: 8, slug: 'sterling-silver-infinity-love-couple-ring-set', img: '/products/8.png', name: 'Sterling Silver Infinity Love Couple Ring Set | Anello', cat: 'Silver Ring', material: 'Sterling Silver • Pair', price: 18999, oldPrice: 24999, rating: 4.9, reviews: 1204, badge: '-24%', isNewArrival: false },
];

const galleryAltText = [
  '18K Rose Gold Diamond Halo Ring', 'Classic Platinum Solitaire Ring', 'Vintage Yellow Gold Bridal Ring',
  'Sterling Silver Couple Band', 'Natural Emerald Cut Diamond Ring', 'Mens Tungsten Carbide Band',
  'Rose Gold Infinity Promise Ring', 'Cushion Cut Moissanite Engagement Ring', 'Stackable Gold Eternity Band'
];

function Stars({ r }) {
  return <span className="stars">{'★'.repeat(Math.floor(r))}{'☆'.repeat(5 - Math.floor(r))}</span>;
}

function InstaVideo({ src, id, hasLink }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly set muted properties
    video.muted = true;
    video.defaultMuted = true;
    
    // Force load
    video.load();

    // Use IntersectionObserver to play when visible, pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((err) => {
              console.log("Autoplay failed or blocked:", err);
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 } // Play when at least 30% is visible
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className="insta-video"
      loop
      muted
      playsInline
      preload="none"
      onClick={(e) => {
        if (hasLink) return;
        if (e.target.paused) {
          e.target.play().catch(() => { });
        } else {
          e.target.pause();
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const {
    cart, cartOpen, setCartOpen,
    wishlist, wishlistOpen, setWishlistOpen,
    toast, showToast, addToCart, removeFromCart, changeQty, toggleWish,
    cartCount, cartTotal, mounted: cartMounted
  } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const [ringType, setRingType] = useState('all');
  const [homeVideos, setHomeVideos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dbProducts, setDbProducts] = useState(PRODUCTS);
  const [dbProductsLoaded, setDbProductsLoaded] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const desktopHero = ['/diamond-rings-hero.webp', '/gold-rings-banner.webp', '/silver-rings-banner.webp'];
  const mobileHero = ['/diamond-rings-hero.webp', '/gold-rings-banner.webp', '/silver-rings-banner.webp'];
  const heroImages = isMobile ? mobileHero : desktopHero;

  const [promoSliderIdx, setPromoSliderIdx] = useState(0);
  const pcPromoImages = ['/PC1.webp', '/PC2.png', '/PC3.webp', '/PC4.webp'];
  const mobilePromoImages = ['/PC1.webp', '/PC2.png', '/PC3.webp', '/PC4.webp'];
  const currentPromoImages = isMobile ? mobilePromoImages : pcPromoImages;

  const handleCheckout = () => {
    setCartOpen(false);
    router.push('/checkout');
  };

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const announcements = [
    "Pan India Free Shipping!",
    "Free Shipping & Packing on Orders Above ₹10,000!"
  ];

  useEffect(() => {
    setMounted(true);
    const fetchProds = async () => {
      try {
        // Fetch only featured products for homepage (faster)
        const res = await fetch('/api/products?onlyHome=true&limit=50', {
          next: { revalidate: 60 } // Cache for 60 seconds
        });
        const data = await res.json();
        if (data && !data.error && Array.isArray(data)) setDbProducts(data);
      } catch (e) { console.error('Fetch products error:', e); } finally { setDbProductsLoaded(true); }
    };
    fetchProds();

    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/home-videos');
        const data = await res.json();
        if (data && !data.error && Array.isArray(data)) {
          setHomeVideos(data.sort((a, b) => a.slot - b.slot));
        }
      } catch (e) { console.error('Fetch home videos error:', e); }
    };
    fetchVideos();

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    const timer = setInterval(() => {
      setAnnouncementIdx(prev => (prev + 1) % announcements.length);
    }, 5000);

    const heroTimer = setInterval(() => {
      setHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 4000); // 4 seconds interval

    const promoTimer = setInterval(() => {
      setPromoSliderIdx(prev => (prev + 1) % currentPromoImages.length);
    }, 4000);

    // Welcome popup — show only if not logged in and not dismissed this session
    if (!user && !sessionStorage.getItem('welcome_dismissed')) {
      const popupTimer = setTimeout(() => setShowWelcomePopup(true), 1200);
      return () => {
        clearInterval(timer);
        clearInterval(heroTimer);
        clearInterval(promoTimer);
        window.removeEventListener('resize', handleResize);
        clearTimeout(popupTimer);
      };
    }

    return () => {
      clearInterval(timer);
      clearInterval(heroTimer);
      clearInterval(promoTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile, announcements.length, heroImages.length, currentPromoImages.length, user]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: 'Anello',
    image: 'https://www.anelloworld.com/logo.png',
    description: 'Discover our curated collection of handcrafted fine rings — engagement rings, wedding bands, diamond & gemstone rings. BIS Hallmarked.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'MH',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.0760,
      longitude: 72.8777
    },
    url: 'https://www.anelloworld.com',
    priceRange: '₹₹₹',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      {/* HERO */}
      <section className="hero">
        <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
          Buy Premium Diamond, Gold & Silver Rings Online in India
        </h1>
        <div className="hero-slider" onClick={() => router.push('/collections')} style={{ cursor: 'pointer' }}>
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`hero-slide ${idx === heroIdx ? 'active' : ''} ${idx % 2 === 0 ? 'zoom-in' : 'zoom-out'}`}
            >
              <Image 
                src={img} 
                alt={
                  img.includes('diamond-rings-hero.webp')
                    ? 'Handcrafted diamond rings collection — Anello Fine Jewelry India'
                    : img.includes('gold-rings-banner.webp')
                    ? '18K gold rings for women — BIS Hallmarked jewelry'
                    : img.includes('silver-rings-banner.webp')
                    ? 'Sterling silver rings online India — Anello Store'
                    : `Hero Image ${idx + 1}`
                } 
                fill 
                priority={idx === 0} 
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
        <div className="hero-line" />
        <div className="hero-content">
          {/* Text and stats have been removed to show only the banner image */}
        </div>
      </section>

      {/* STYLISH COLLECTIONS - AUTOSLIDER SECTION */}
      <StylishCollections 
        products={dbProducts.filter(p => p.isStylish).length > 0 ? dbProducts.filter(p => p.isStylish) : (dbProductsLoaded && dbProducts.length > 0 ? dbProducts.slice(0, 4) : [])} 
        onBuyNow={(p) => { addToCart(p); setCartOpen(true); }}
        onProductClick={(p) => router.push(`/products/${p.slug}`)}
      />

      {/* INSTAGRAM GALLERY */}
      <section className="insta-section" id="categories">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="section-eyebrow" style={{ fontSize: '1rem', letterSpacing: '4px' }}>Explore</span>
          <h2 className="section-title" style={{ fontSize: '3rem', margin: '0.4rem 0 1.2rem', lineHeight: 1.15 }}>
            Shop by <em>Vibe</em>
          </h2>
        </div>

        <div className="insta-scroll">
          {homeVideos.filter(v => v.url).map((p) => {
            const hasLink = !!p.link;
            const cardContent = (
              <div className="insta-media-wrap">
                <InstaVideo src={p.url} id={p.slot || p.id} hasLink={hasLink} />
              </div>
            );
            return (
              <div
                key={p.slot || p.id || p.url}
                className={`insta-item${hasLink ? ' clickable' : ''}`}
                style={{ gap: 0 }}
              >
                {hasLink ? (
                  <Link href={p.link} style={{ display: 'block', width: '100%', height: '100%' }}>
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem', background: 'var(--bg2)', borderTop: '1px solid var(--border2)', borderBottom: '1px solid var(--border2)' }}>
        <div className="section-inner">
          <div className="features-grid">
            {[
              { icon: '🔏', title: 'BIS Hallmarked', desc: 'All gold & silver pieces are government certified' },
              { icon: '🚚', title: 'Free Shipping', desc: 'Complimentary delivery across India on all orders' },
              { icon: '💎', title: 'Certified Diamonds', desc: 'GIA / IGI certified natural diamonds only' },
              { icon: '🎧', title: '24/7 Support', desc: 'Always here to help you with any queries' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>







      <BestSellers products={dbProducts} onProductClick={(p) => router.push(`/products/${p.slug}`)} />

      {/* PRODUCTS */}
      <section className="section" id="products" style={{ background: 'var(--bg2)' }}>
        <div className="section-inner">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow" style={{ textAlign: 'left', display: 'block' }}>Bestsellers</span>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Featured <em>Rings</em></h2>
            </div>
            <a href="/collections" className="see-all">View All →</a>
          </div>
          <div className="products-grid">
            {!dbProductsLoaded ? (
              // Skeleton cards while loading
              Array.from({ length: 8 }).map((_, i) => (
                <div key={`feat-skel-${i}`} className="product-card" style={{ pointerEvents: 'none' }}>
                  <div className="product-img">
                    <div className="product-img-container" style={{ background: 'var(--border2, #eee)', animation: 'skeletonPulse 1.5s ease-in-out infinite', borderRadius: '8px' }} />
                  </div>
                  <div className="product-info">
                    <div style={{ height: '0.7rem', width: '40%', background: 'var(--border2, #eee)', borderRadius: '4px', marginBottom: '0.5rem', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                    <div style={{ height: '1rem', background: 'var(--border2, #eee)', borderRadius: '4px', marginBottom: '0.4rem', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                    <div style={{ height: '0.8rem', width: '70%', background: 'var(--border2, #eee)', borderRadius: '4px', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                  </div>
                </div>
              ))
            ) : (
              dbProducts
              .filter(p => ringType === 'all' || p.cat.toLowerCase().includes(ringType))
              .map(p => (
                <div key={p._id || p.id} className="product-card" onClick={() => router.push(`/products/${p.slug}`)}>
                  <div className="product-img">
                    <div className="product-img-container">
                      <Image
                        src={p.img || p.images?.[0] || '/placeholder.png'}
                        alt={p.name} fill
                        className="product-img-primary"
                        style={{ objectFit: 'contain', padding: '12px', mixBlendMode: isDarkMode ? 'normal' : 'darken' }}
                        sizes="300px" priority={false}
                      />
                      {p.images?.[1] && (
                        <Image
                          src={p.images[1]}
                          alt={`${p.name} alternate view`} fill
                          className="product-img-secondary"
                          style={{ objectFit: 'contain', padding: '12px', mixBlendMode: isDarkMode ? 'normal' : 'darken' }}
                          sizes="300px" priority={false}
                        />
                      )}
                    </div>
                    {/* % OFF badge — auto calculated */}
                    {(() => {
                      const discountPrice = p.badge && !isNaN(Number(p.badge)) ? Number(p.badge) : null;
                      if (discountPrice && discountPrice < p.price) {
                        const pct = Math.round(((p.price - discountPrice) / p.price) * 100);
                        return <span className="product-badge">{pct}% OFF</span>;
                      }
                      if (p.badge && isNaN(Number(p.badge))) return <span className="product-badge">{p.badge}</span>;
                      if (p.isNewArrival) return <span className="product-badge new">NEW</span>;
                      return null;
                    })()}
                    {mounted && (
                      <button className={`product-wish${wishlist.includes(p._id || p.id) ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWish(p._id || p.id); }} aria-label="Wishlist">
                        <svg width="22" height="22" fill={wishlist.includes(p._id || p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-cat">{p.cat}</div>
                    <Link href={`/products/${p.slug}`} className="product-name" style={{ textDecoration: 'none', display: 'block' }} onClick={(e) => e.stopPropagation()}>{p.name}</Link>
                    <div className="product-material">{p.material}</div>

                    <div className="product-footer">
                      <div>
                        {/* Price logic: if badge is numeric discount price */}
                        {(() => {
                          const discountPrice = p.badge && !isNaN(Number(p.badge)) ? Number(p.badge) : null;
                          if (discountPrice && discountPrice < p.price) {
                            return (
                              <>
                                <span className="price-current">₹{discountPrice.toLocaleString('en-IN')}</span>&nbsp;
                                <span className="price-old">₹{p.price.toLocaleString('en-IN')}</span>
                              </>
                            );
                          }
                          return (
                            <>
                              <span className="price-current">₹{p.price.toLocaleString('en-IN')}</span>&nbsp;
                              {p.oldPrice && <span className="price-old">₹{p.oldPrice.toLocaleString('en-IN')}</span>}
                            </>
                          );
                        })()}
                      </div>
                      <button className="add-cart" onClick={(e) => { e.stopPropagation(); addToCart(p); }} id={`add-${p._id || p.id}`} aria-label="Add to cart">+</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SPLIT LAYOUT: PROMO SLIDER & EXCLUSIVE RINGS */}
      <section className="promo-and-exclusive-section" style={{ backgroundColor: 'var(--bg2)', padding: isMobile ? '0' : '2rem 1.5rem' }}>
        <div style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
          gap: isMobile ? '2rem' : '3rem',
          alignItems: 'stretch'
        }}>
           
           {/* LEFT: SLIDER */}
           <div className="slider-wrapper" style={{ 
              borderRadius: isMobile ? '0' : '16px',
              overflow: 'hidden',
              boxShadow: isMobile ? 'none' : 'var(--shadow-card)',
              display: 'grid',
              alignSelf: 'center'
           }}>
             {currentPromoImages.map((imgSrc, idx) => (
                <Link
                  href="/collections"
                  key={imgSrc}
                  style={{
                    display: 'block',
                    gridArea: '1 / 1',
                    opacity: idx === promoSliderIdx ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    zIndex: idx === promoSliderIdx ? 1 : 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt={
                      imgSrc.includes('PC1.webp')
                        ? 'Shop gold rings collection — Up to 30% off at Anello'
                        : imgSrc.includes('PC2.png')
                        ? 'Exclusive diamond rings collection — Certified fine jewelry'
                        : imgSrc.includes('PC3.webp')
                        ? 'Sterling silver couple bands — Free shipping India'
                        : imgSrc.includes('PC4.webp')
                        ? 'Special edition anniversary rings — BIS Hallmarked'
                        : `Promo Banner ${idx + 1}`
                    }
                    width={1000}
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx === 0}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </Link>
             ))}
           </div>

           {/* RIGHT: EXCLUSIVE RINGS */}
           <div className="exclusive-wrapper" style={{ padding: isMobile ? '1rem' : '0' }}>
             <div className="section-header-row" style={{ marginBottom: '1rem', padding: '0' }}>
               <div>
                 <span className="section-eyebrow" style={{ textAlign: 'left', display: 'block' }}>Handpicked for you</span>
                 <h2 className="section-title" style={{ textAlign: 'left', fontSize: '1.8rem' }}><em>Exclusive</em> Rings</h2>
               </div>
               <Link href="/collections" className="see-all">View All →</Link>
             </div>
              <div className="products-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', padding: '0' }}>
                 {!dbProductsLoaded ? (
                   Array.from({ length: 4 }).map((_, i) => (
                     <div key={`exc-skel-${i}`} className="product-card" style={{ margin: '0', height: '100%', pointerEvents: 'none' }}>
                       <div className="product-img" style={{ background: 'var(--border2, #eee)', animation: 'skeletonPulse 1.5s ease-in-out infinite', borderRadius: '8px' }} />
                       <div className="product-info">
                         <div style={{ height: '0.8rem', background: 'var(--border2, #eee)', borderRadius: '4px', marginBottom: '0.5rem', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                         <div style={{ height: '0.7rem', width: '60%', background: 'var(--border2, #eee)', borderRadius: '4px', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
                       </div>
                     </div>
                   ))
                 ) : (() => {
                    const exclusive = dbProducts.filter(p => p.isExclusive || p.isNewArrival);
                    const itemsToShow = exclusive.length > 0 ? exclusive.slice(0, 4) : dbProducts.slice(4, 8);
                  return itemsToShow.map(p => (
                    <div key={`exc-${p._id || p.id}`} className="product-card" onClick={() => router.push(`/products/${p.slug}`)} style={{ margin: '0', height: '100%' }}>
                      <div className="product-img">
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Image src={p.img || p.images?.[0] || '/placeholder.png'} alt={p.name} fill style={{ objectFit: 'contain', padding: '12px', mixBlendMode: isDarkMode ? 'normal' : 'darken' }} sizes="150px" priority={false} quality={80} loading="lazy" />
                        </div>
                        {(() => {
                          const discountPrice = p.badge && !isNaN(Number(p.badge)) ? Number(p.badge) : null;
                          if (discountPrice && discountPrice < p.price) {
                            const pct = Math.round(((p.price - discountPrice) / p.price) * 100);
                            return <span className="product-badge">{pct}% OFF</span>;
                          }
                          if (p.badge && isNaN(Number(p.badge))) return <span className="product-badge">{p.badge}</span>;
                          if (p.isNewArrival) return <span className="product-badge new">NEW</span>;
                          return null;
                        })()}
                        {mounted && (
                          <button className={`product-wish${wishlist.includes(p._id || p.id) ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWish(p._id || p.id); }} aria-label="Wishlist">
                            <svg width="22" height="22" fill={wishlist.includes(p._id || p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                          </button>
                        )}
                      </div>
                      <div className="product-info">
                        <div className="product-cat">{p.cat}</div>
                        <Link href={`/products/${p.slug}`} className="product-name" style={{ textDecoration: 'none', display: 'block' }} onClick={(e) => e.stopPropagation()}>{p.name}</Link>

                        <div className="product-footer">
                          <div>
                            {(() => {
                              const discountPrice = p.badge && !isNaN(Number(p.badge)) ? Number(p.badge) : null;
                              if (discountPrice && discountPrice < p.price) {
                                return (
                                  <>
                                    <span className="price-current">₹{discountPrice.toLocaleString('en-IN')}</span>&nbsp;
                                    <span className="price-old">₹{p.price.toLocaleString('en-IN')}</span>
                                  </>
                                );
                              }
                              return (
                                <>
                                  <span className="price-current">₹{p.price.toLocaleString('en-IN')}</span>&nbsp;
                                  {p.oldPrice && <span className="price-old">₹{p.oldPrice.toLocaleString('en-IN')}</span>}
                                </>
                              );
                            })()}
                          </div>
                          <button className="add-cart" onClick={(e) => { e.stopPropagation(); addToCart(p); }} id={`add-exc-${p._id || p.id}`} aria-label="Add to cart">+</button>
                        </div>
                      </div>
                    </div>
                  ));
                 })()}
              </div>
           </div>

        </div>
      </section>

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-content">
              <div className="modal-gallery">
                <Image src={selectedProduct.img || selectedProduct.images?.[0] || '/placeholder.png'} alt={selectedProduct.name} width={500} height={500} />
              </div>
              <div className="modal-details">
                <div className="modal-cat">{selectedProduct.cat}</div>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="modal-price-row">
                  {(() => {
                    const discountPrice = selectedProduct.badge && !isNaN(Number(selectedProduct.badge)) ? Number(selectedProduct.badge) : null;
                    if (discountPrice && discountPrice < selectedProduct.price) {
                      const pct = Math.round(((selectedProduct.price - discountPrice) / selectedProduct.price) * 100);
                      return (
                        <>
                          <span className="modal-price">₹{discountPrice.toLocaleString('en-IN')}</span>&nbsp;
                          <span className="modal-price-old">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                          <span className="modal-badge">{pct}% OFF</span>
                        </>
                      );
                    }
                    return (
                      <>
                        <span className="modal-price">₹{selectedProduct.price.toLocaleString('en-IN')}</span>&nbsp;
                        {selectedProduct.oldPrice && <span className="modal-price-old">₹{selectedProduct.oldPrice.toLocaleString('en-IN')}</span>}
                        {selectedProduct.badge && isNaN(Number(selectedProduct.badge)) && <span className="modal-badge">{selectedProduct.badge} OFF</span>}
                      </>
                    );
                  })()}
                </div>
                <div className="modal-stars"><Stars r={selectedProduct.rating || 5} /> <span>({selectedProduct.reviews || 0} Reviews)</span></div>

                <div className="modal-section">
                  <h3>About this Ring</h3>
                  {selectedProduct.material && <p>{selectedProduct.material}</p>}
                  <p>A masterpiece of craftsmanship, this {selectedProduct.cat} is designed to be cherished for a lifetime. Every detail is meticulously finished to ensure maximum brilliance and comfort.</p>
                </div>

                <div className="modal-specs">
                  <div className="spec-item"><strong>Metal</strong> <span>{selectedProduct.cat.split(' ')[0]}</span></div>
                  <div className="spec-item"><strong>Purity</strong> <span>{(selectedProduct.material || '18K / 22K').split('•')[0]}</span></div>
                  <div className="spec-item"><strong>Certification</strong> <span>BIS Hallmarked</span></div>
                </div>

                <div className="modal-actions">
                  <button className="btn-primary modal-buy-btn" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Add to Cart</button>
                  <button className="btn-outline modal-wish-btn" onClick={() => toggleWish(selectedProduct._id || selectedProduct.id)}>
                    <svg width="30" height="30" fill={wishlist.includes(selectedProduct._id || selectedProduct.id) ? 'var(--danger)' : 'none'} stroke={wishlist.includes(selectedProduct._id || selectedProduct.id) ? 'var(--danger)' : 'currentColor'} strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WISHLIST SIDEBAR */}
      <div className={`cart-overlay ${wishlistOpen ? 'open' : ''}`} onClick={() => setWishlistOpen(false)} />
      <div className={`cart-sidebar ${wishlistOpen ? 'open' : ''}`} style={{ left: 0, right: 'auto', transform: wishlistOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="cart-header">
          <h3>Your Wishlist</h3>
          <button className="close-btn" onClick={() => setWishlistOpen(false)}>×</button>
        </div>
        <div className="cart-items">
          {wishlist.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">♡</div>
              <p>Your wishlist is empty</p>
              <button className="btn-primary" onClick={() => setWishlistOpen(false)}>Shop Now</button>
            </div>
          ) : (
            wishlist.map(id => {
              const p = dbProducts.find(x => (x._id || x.id) === id);
              if (!p) return null;
              return (
                <div key={id} className="cart-item">
                  <div className="cart-item-img" style={{ fontSize: '1rem', position: 'relative' }}>
                    <Image src={p.img || p.images?.[0] || '/placeholder.png'} alt={p.name} fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover', borderRadius: '8px' }} />
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

      {/* ── TESTIMONIALS SECTION ── */}
      <SiteReviews />


      {/* ── HOMEPAGE FAQ SECTION ── */}
      <section style={{ padding: '5rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '4px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Help Center</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)' }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { q: 'Are all Anello rings BIS Hallmarked?', a: 'Yes. Every gold and silver ring at Anello carries the BIS Hallmark — the Bureau of Indian Standards certification of metal purity. Our gold is independently tested and stamped before it leaves our workshop.' },
            { q: 'Do you offer free shipping across India?', a: 'Yes. We offer complimentary Pan-India shipping on all orders, including to all 28 states and 8 union territories. No minimum order value.' },
            { q: 'What is your return and exchange policy?', a: 'We offer a 7-day hassle-free return and exchange policy. If you are not completely satisfied with your purchase, return it in original condition for a full refund or exchange.' },
            { q: 'Are the diamonds certified?', a: 'Yes. All diamond rings at Anello come with IGI or GIA certification verifying the Cut, Color, Clarity, and Carat weight of every diamond.' },
            { q: 'How do I find my ring size?', a: 'Visit our Ring Size Guide for a complete measurement method and Indian size chart. You can also contact our team via WhatsApp for personalised guidance.' },
          ].map((faq, i) => (
            <details key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '1.2rem 1.5rem' }}>
              <summary style={{ fontWeight: 600, color: 'var(--text)', cursor: 'pointer', fontSize: '0.98rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>+</span>
              </summary>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7, fontSize: '0.93rem' }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── BLOG LINKS ── */}
      <section style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '4px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>The Anello Journal</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)', marginBottom: '3rem' }}>Expert Jewelry Guides</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {[
              { href: '/blog/best-engagement-rings-for-women', label: '💍 Best Engagement Rings for Women' },
              { href: '/blog/diamond-shapes-explained', label: '💎 Diamond Shapes Explained' },
              { href: '/blog/ring-size-guide-india', label: '📏 Ring Size Guide India' },
              { href: '/blog/gold-vs-platinum-rings', label: '⚖️ Gold vs Platinum Rings' },
              { href: '/blog/how-to-choose-a-proposal-ring', label: '💝 How to Choose a Proposal Ring' },
              { href: '/blog/minimalist-jewelry-trends-2026', label: '✨ Minimalist Jewelry Trends 2026' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '0.75rem 1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border2)',
                borderRadius: '50px', textDecoration: 'none', color: 'var(--text)', fontWeight: 500, fontSize: '0.88rem',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/blog" style={{ padding: '0.9rem 2.5rem', background: 'linear-gradient(135deg,var(--gold-dark),var(--gold))', color: '#fff', borderRadius: '50px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>
            Read All Articles →
          </Link>
        </div>
      </section>


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
                </div>
              ) : cart.map(item => (
                <div key={item._id || item.id} className="cart-item">
                  <div className="cart-item-img" style={{ position: 'relative', overflow: 'hidden' }}>
                    {item.img || item.images?.[0] ? (
                      <Image src={item.img || item.images[0]} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      item.emoji || '💍'
                    )}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-cat">{item.cat}</div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => changeQty(item._id || item.id, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item._id || item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeFromCart(item._id || item.id)}>🗑</button>
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

      {/* TOAST */}
      {mounted && toast && (
        <div className="toast show">
          <span>{toast.icon}</span>
          <span>{toast.msg}</span>
        </div>
      )}
      {/* SEO Section (Bottom of Page) */}
      <section className="seo-section" style={{ padding: '4rem 2rem', background: 'var(--bg2)', borderTop: '1px solid var(--border2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text)' }}>
            Buy Premium Diamond, Gold & Silver Rings Online in India
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Welcome to Anello Store, India's premier destination for handcrafted fine jewelry. Whether you are looking for the perfect <strong>diamond engagement ring</strong>, a traditional <strong>22K gold wedding band</strong>, or minimalist <strong>sterling silver rings</strong> for daily wear, our curated collections offer unmatched elegance and quality. Every ring in our catalog is meticulously crafted by master artisans and comes with a 100% authenticity guarantee.
          </p>
          
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text)' }}>
            BIS Hallmarked & IGI/GIA Certified Jewelry
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Trust and transparency are at the core of the Anello experience. All our gold jewelry (18K and 22K) carries the government-mandated <strong>BIS Hallmark</strong>, ensuring absolute metal purity. Furthermore, every diamond ring features conflict-free stones graded and certified by international laboratories like <strong>IGI</strong> and <strong>GIA</strong>. Enjoy 0% making charges on select gold rings, free insured Pan-India shipping, and a hassle-free 7-day return policy.
          </p>
          
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text)' }}>
            Explore Our Curated Ring Collections
          </h3>
          <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1.5rem' }}>
            <li><strong>Diamond Solitaires:</strong> Timeless, elegant single-stone rings perfect for proposals.</li>
            <li><strong>Couple Rings:</strong> Matching "His and Her" sets in platinum, gold, and silver.</li>
            <li><strong>Gemstone Rings:</strong> Natural rubies, emeralds, and sapphires set in intricate designs.</li>
            <li><strong>Stackable Minimalist Rings:</strong> Delicate bands designed to be worn together for a modern look.</li>
          </ul>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema([
          { q: 'Is it safe to buy jewelry online in India?', a: 'Yes, Anello provides fully insured shipping via premium courier partners. Every package is tamper-proof and requires OTP verification on delivery.' },
          { q: 'Are Anello diamonds certified?', a: 'Absolutely. Every diamond ring sold by Anello comes with an original certification from IGI or GIA.' },
          { q: 'What is your return policy?', a: 'We offer a no-questions-asked 7-day return and exchange policy on all non-customized rings.' }
        ])) }} />
      </section>

      <Footer />

      {/* WELCOME POPUP — for non-logged-in users */}
      {mounted && showWelcomePopup && !user && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeInOverlay 0.35s ease'
        }}
          onClick={() => { setShowWelcomePopup(false); sessionStorage.setItem('welcome_dismissed', '1'); }}
        >
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '24px',
            padding: isMobile ? '2rem 1.5rem' : '2.8rem 3rem',
            maxWidth: '440px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
            border: '1px solid var(--border)',
            animation: 'popupIn 0.4s cubic-bezier(0.16,1,0.3,1)',
            textAlign: 'center',
          }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button onClick={() => { setShowWelcomePopup(false); sessionStorage.setItem('welcome_dismissed', '1'); }}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'var(--bg2)', border: '1px solid var(--border2)',
                borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem',
                transition: 'background 0.2s, color 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,134,11,0.12)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >✕</button>

            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Image src="/logo.png" alt="Anello Logo" width={120} height={60} style={{ objectFit: 'contain', height: '60px', width: 'auto' }} />
            </div>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '4px',
              color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '0.6rem'
            }}>Welcome to Anello</div>
            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '1.9rem', fontWeight: 800,
              color: 'var(--text)', margin: '0 0 0.6rem', lineHeight: 1.2
            }}>Discover Fine Rings <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Crafted for You</em></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
              Sign in to save your wishlist, track orders, and get exclusive member offers.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/login"
                onClick={() => { setShowWelcomePopup(false); sessionStorage.setItem('welcome_dismissed', '1'); }}
                className="btn-gold"
                style={{ width: '100%', justifyContent: 'center', borderRadius: '12px', padding: '0.85rem', fontSize: '0.95rem', textDecoration: 'none' }}>
                Sign In to My Account
              </Link>
              <Link href="/register"
                onClick={() => { setShowWelcomePopup(false); sessionStorage.setItem('welcome_dismissed', '1'); }}
                style={{
                  display: 'block', width: '100%', padding: '0.85rem',
                  border: '1.5px solid var(--gold)', borderRadius: '12px',
                  color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem',
                  textDecoration: 'none', transition: 'background 0.2s',
                  background: 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,134,11,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Create Free Account
              </Link>
              <button onClick={() => { setShowWelcomePopup(false); sessionStorage.setItem('welcome_dismissed', '1'); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', paddingTop: '0.2rem', textDecoration: 'underline' }}>
                Continue browsing as guest
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOverlay { from { opacity:0; } to { opacity:1; } }
        @keyframes popupIn { from { opacity:0; transform: scale(0.9) translateY(30px); } to { opacity:1; transform: scale(1) translateY(0); } }
      `}</style>
    </>
  );
}
