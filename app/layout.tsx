import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FavoritesProvider from '@/components/FavoritesProvider'
import MobileBottomNav from '@/components/MobileBottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Miami Residence - Real Estate Florida | Condos, Homes for Sale and Rent',
    template: '%s | Miami Residence',
  },
  description: 'Miami Beach oceanfront condos for sale and rent. View listings, prices, floor plans. Brickell, South Beach, Sunny Isles, Bal Harbour, Coral Gables.',
  keywords: ['miami real estate', 'miami condos for sale', 'miami homes for sale', 'brickell condos', 'south beach condos', 'sunny isles condos', 'luxury real estate miami', 'oceanfront condos miami'],
  authors: [{ name: 'Miami Residence Realty' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Miami Residence',
    title: 'Miami Residence - Real Estate Florida',
    description: 'Miami Beach oceanfront condos for sale and rent. Luxury real estate in Brickell, South Beach, Sunny Isles, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miami Residence - Real Estate Florida',
    description: 'Miami Beach oceanfront condos for sale and rent.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://miamiresidence.com'),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a1a1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FavoritesProvider>
          {children}
          <MobileBottomNav />
          {/* Discrete admin link — desktop only, top-right corner */}
          <a
            href="/admin"
            className="hidden lg:flex fixed top-3 right-3 z-50 bg-black/80 backdrop-blur text-white w-9 h-9 rounded-full items-center justify-center shadow-lg hover:bg-black hover:scale-105 transition-all duration-200"
            title="Admin Panel"
            aria-label="Admin Panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </a>
        </FavoritesProvider>
      </body>
    </html>
  )
}
