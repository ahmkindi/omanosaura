import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/profile', '/purchases', '/auth'],
      },
    ],
    sitemap: 'https://omanosaura.com/sitemap.xml',
  }
}
