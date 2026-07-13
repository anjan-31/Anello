import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Chatbot from "./components/Chatbot";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Script from "next/script";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-main",
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL("https://www.anelloworld.com"),
  title: {
    default: "Buy Gold, Diamond & Silver Rings Online in India | Anello Store",
    template: "%s | Anello Store",
  },
  description:
    "Shop handcrafted gold, silver & diamond rings online at Anello. BIS Hallmarked jewelry, certified diamonds, free shipping & easy returns across India.",
  keywords: [
    "diamond rings india",
    "gold rings online",
    "engagement rings india",
    "BIS hallmarked rings",
    "buy rings online"
  ],
  alternates: { canonical: "https://www.anelloworld.com/" },
  openGraph: {
    title: "Buy Gold, Diamond & Silver Rings Online in India | Anello Store",
    description:
      "Shop handcrafted gold, silver & diamond rings online at Anello. BIS Hallmarked jewelry, certified diamonds, free shipping & easy returns across India.",
    url: "https://www.anelloworld.com",
    siteName: "Anello Store",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Anello Store — Premium Gold, Diamond & Silver Rings Online India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Gold, Diamond & Silver Rings Online in India | Anello Store",
    description:
      "Shop handcrafted gold, silver & diamond rings online at Anello. BIS Hallmarked jewelry, certified diamonds, free shipping & easy returns.",
    images: ["/logo.png"],
    site: "@anellostore",
    creator: "@anellostore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // TODO: Replace with real token from https://search.google.com/search-console
    // google: "YOUR_ACTUAL_VERIFICATION_TOKEN",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Anello Store",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Mumbai",
    "geo.position": "19.0760;72.8777",
    ICBM: "19.0760, 72.8777",
  },
};

export const viewport = {
  themeColor: "#1a0a00",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  const orgSchema = buildOrganizationSchema();
  const websiteSchema = buildWebSiteSchema();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Theme & PWA */}
        <meta name="theme-color" content="#1a0a00" />
        {/* Favicon */}
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />

        {/* Organization Schema */}
        <script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {/* WebSite Schema — Enables Google Sitelinks Search Box */}
        <script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${cormorant.variable} ${outfit.variable}`} suppressHydrationWarning>
          <AuthProvider>
            <CartProvider>
              <Script
                src="https://accounts.google.com/gsi/client"
                strategy="lazyOnload"
              />
              {children}
              <Chatbot />
              <SpeedInsights />
              <AnalyticsTracker />
              
              {/* Google Analytics 4 */}
              {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-XXXXXXXXXX');
                `}
              </Script> */}

              {/* Meta Pixel */}
              {/* <Script id="meta-pixel" strategy="afterInteractive">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', 'YOUR_PIXEL_ID');
                  fbq('track', 'PageView');
                `}
              </Script> */}
            </CartProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
