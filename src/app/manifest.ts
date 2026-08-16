import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'udal - Workout App',
    short_name: 'udal',
    description: 'Your personal Tamil Nadu fat-loss and wellness dashboard.',
    start_url: '/',
    display: 'standalone',
    background_color: '#15152b',
    theme_color: '#15152b',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
