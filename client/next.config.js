const nextTranslate = require('next-translate')
const nextVideos = require('next-videos')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: () => {
    return [
      {
        source: '/server/:path*',
        destination: 'http://server:8081/:path*',
      },
      {
        source: '/fa/:path*',
        destination: 'http://fusionauth:9011/:path*',
      },
    ]
  },
}

module.exports = nextTranslate(nextVideos(nextConfig))
