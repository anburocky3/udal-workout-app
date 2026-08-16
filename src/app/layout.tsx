import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PwaRegister } from '@/components/pwa-register'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Udal - Healthy App',
  description:
    'A simple app to track your health and wellness. Track your daily habits, set goals, and see your progress over time.',
  generator: 'udal',
  icons: {
    icon: [
      {
        url: '/icons/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icons/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icons/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icons/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#15152b',
  userScalable: false,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <PwaRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
