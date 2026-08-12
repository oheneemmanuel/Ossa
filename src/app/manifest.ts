import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Old Science Students Association',
    short_name: 'OSSA',
    description: 'OSSA member dashboard and contributions',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#111C3A',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}