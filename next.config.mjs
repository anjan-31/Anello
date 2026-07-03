/** @type {import('next').NextConfig} */

// Polyfill broken Node.js v25 localStorage before Next.js uses it
try {
  const _store = new Map();
  const safeLocalStorage = {
    getItem: (k) => _store.has(k) ? _store.get(k) : null,
    setItem: (k, v) => _store.set(k, String(v)),
    removeItem: (k) => _store.delete(k),
    clear: () => _store.clear(),
    get length() { return _store.size; },
    key: (i) => [..._store.keys()][i] ?? null,
  };
  Object.defineProperty(globalThis, 'localStorage', {
    value: safeLocalStorage,
    writable: true,
    configurable: true,
  });

  const _ss = new Map();
  const safeSessionStorage = {
    getItem: (k) => _ss.has(k) ? _ss.get(k) : null,
    setItem: (k, v) => _ss.set(k, String(v)),
    removeItem: (k) => _ss.delete(k),
    clear: () => _ss.clear(),
    get length() { return _ss.size; },
    key: (i) => [..._ss.keys()][i] ?? null,
  };
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: safeSessionStorage,
    writable: true,
    configurable: true,
  });
} catch (_) {}

const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    qualities: [75, 80, 85],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ]
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/(.*)\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },

    ];
  },
};

export default nextConfig;
