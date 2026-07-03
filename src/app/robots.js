export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/editor', '/videos', '/login', '/register', '/my-orders'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: [
      'https://www.anelloworld.com/sitemap.xml',
      'https://www.anelloworld.com/image-sitemap.xml',
    ],
    host: 'https://www.anelloworld.com',
  };
}
