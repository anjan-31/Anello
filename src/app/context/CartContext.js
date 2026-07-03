'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedCart = localStorage.getItem('checkout_cart');
      if (storedCart) setCart(JSON.parse(storedCart));
      
      const storedWishlist = localStorage.getItem('checkout_wishlist') || localStorage.getItem('wishlist');
      if (storedWishlist) {
        try {
          const parsed = JSON.parse(storedWishlist);
          // If it's an array of product IDs, convert to object items or handle gracefully
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
          }
        } catch (_) {}
      }
    } catch (e) {
      console.error('Failed to load cart/wishlist:', e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('checkout_cart', JSON.stringify(cart));
        const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
        localStorage.setItem('checkout_total', total);
      } catch (e) {
        console.error('Failed to save cart:', e);
      }
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('checkout_wishlist', JSON.stringify(wishlist));
      } catch (e) {
        console.error('Failed to save wishlist:', e);
      }
    }
  }, [wishlist, mounted]);

  const showToast = (msg, icon = '✅') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 2500);
  };

  const addToCart = (p) => {
    const pId = p._id || p.id;
    const ringSize = p.ringSize || null;
    // Unique key: product id + ring size
    const cartKey = ringSize ? `${pId}_size${ringSize}` : pId;
    setCart(prev => {
      const ex = prev.find(i => i.cartKey === cartKey);
      if (ex) return prev.map(i => i.cartKey === cartKey ? { ...i, qty: i.qty + 1 } : i);
      const item = {
        id: pId,
        _id: pId,
        cartKey,
        name: p.name,
        price: p.price,
        img: p.img || p.images?.[0] || '/placeholder.png',
        images: p.images || [],
        cat: p.cat,
        qty: 1,
        ringSize: ringSize,
      };
      return [...prev, item];
    });
    const sizeText = ringSize ? ` (Size ${ringSize})` : '';
    showToast(`${p.name}${sizeText} added to cart`, '💍');
    setCartOpen(true);
  };

  const removeFromCart = (cartKeyOrId) => {
    setCart(prev => prev.filter(i => (i.cartKey || i.id) !== cartKeyOrId));
  };

  const changeQty = (cartKeyOrId, delta) => {
    setCart(prev => prev.map(i => (i.cartKey || i.id) === cartKeyOrId ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const toggleWish = (id) => {
    const has = wishlist.includes(id);
    if (has) {
      setWishlist(prev => prev.filter(x => x !== id));
      showToast('Removed from wishlist', '❤️');
    } else {
      setWishlist(prev => [...prev, id]);
      showToast('Saved to wishlist', '❤️');
      setWishlistOpen(true);
    }
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, setCart, cartOpen, setCartOpen,
      wishlist, setWishlist, wishlistOpen, setWishlistOpen,
      toast, showToast, addToCart, removeFromCart, changeQty, toggleWish,
      cartCount, cartTotal, mounted
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
