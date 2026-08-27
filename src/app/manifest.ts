import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omanosaura — Adventure & Experiences in Oman',
    short_name: 'Omanosaura',
    description:
      'Adventure and experiences across Oman — trips, hikes, camps, and team days.',
    start_url: '/',
    display: 'standalone',
    background_color: '#16324f',
    theme_color: '#16324f',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
