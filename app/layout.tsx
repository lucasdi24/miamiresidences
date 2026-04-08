import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FavoritesProvider from '@/components/FavoritesProvider'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FavoritesProvider>
          {children}
          {/* Floating Admin Login Button */}
          <a
            href="/admin"
            className="fixed bottom-6 right-6 z-50 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 hover:scale-110 transition-all duration-200 group"
            title="Admin Panel"
          >
            <span className="text-lg">🔐</span>
            <span className="absolute right-14 bg-black text-white text-xs px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Admin Panel
            </span>
          </a>
        </FavoritesProvider>
      </body>
    </html>
  )
}
