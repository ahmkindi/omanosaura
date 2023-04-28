const nextTranslate = require('next-translate')
const nextVideos = require('next-videos')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  rewrites: () => {
    return [
      {
        source: '/server/:path*',
        destination: 'http://server:8081/:path*',
      },
    ]
  },
  images: {
    domains: [
      'omanosaura.com',
      'localhost',
      'images.unsplash.com',
      'picsum.photos',
      'i.imgur.com',
    ],
  },
}

module.exports = nextTranslate(nextVideos(nextConfig))
