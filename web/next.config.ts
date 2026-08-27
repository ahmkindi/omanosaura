import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'omanosaura.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      // Old admin routes → new /admin area
      { source: '/users', destination: '/admin/users', permanent: true },
      { source: '/purchases/all', destination: '/admin/purchases', permanent: true },
      { source: '/images', destination: '/admin/media', permanent: true },
      { source: '/experiences/create', destination: '/admin/experiences/new', permanent: true },
      { source: '/experiences/:id/edit', destination: '/admin/experiences/:id', permanent: true },
      { source: '/blogs/create', destination: '/admin/blogs/new', permanent: true },
      { source: '/blogs/:id/edit', destination: '/admin/blogs/:id', permanent: true },
    ]
  },
  async rewrites() {
    return [
      // Legacy Thawani success callback path (in-flight sessions at cutover)
      {
        source: '/server/user/purchase/success/:id',
        destination: '/api/purchase/success/:id',
      },
    ]
  },
}

export default withNextIntl(nextConfig)
