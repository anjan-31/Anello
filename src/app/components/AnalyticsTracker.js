'use client';
import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function TrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visitorId, setVisitorId] = useState('');

  useEffect(() => {
    // Generate or retrieve visitor ID
    let vid = localStorage.getItem('anello_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem('anello_visitor_id', vid);
    }
    setVisitorId(vid);
  }, []);

  useEffect(() => {
    if (!visitorId || !pathname) return;

    // We only track standard page_views here. Product views are handled separately 
    // inside the product page to include the productId, but we can also log the page view.
    
    // Check if this is an admin path, we might not want to pollute analytics with admin traffic
    if (pathname.startsWith('/admin')) return;

    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'page_view',
            visitorId,
            url: window.location.href,
            pathname: pathname,
            referrer: document.referrer
          })
        });
      } catch (e) {
        // silently fail, analytics should not break the site
      }
    };

    trackPageView();
  }, [pathname, searchParams, visitorId]);

  return null; // Hidden component
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}
