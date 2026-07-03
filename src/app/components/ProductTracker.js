'use client';
import { useEffect } from 'react';

export default function ProductTracker({ productId }) {
  useEffect(() => {
    if (!productId) return;

    let visitorId = localStorage.getItem('anello_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('anello_visitor_id', visitorId);
    }

    const trackProductView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'product_view',
            visitorId,
            productId,
            url: window.location.href,
            pathname: window.location.pathname,
            referrer: document.referrer
          })
        });
      } catch (e) {}
    };

    trackProductView();
  }, [productId]);

  return null;
}
