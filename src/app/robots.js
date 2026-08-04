export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Jangan indeks API internal
    },
    sitemap: 'https://limaskontraktor.com/sitemap.xml',
  }
}