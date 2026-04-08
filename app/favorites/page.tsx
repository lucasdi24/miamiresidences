'use client'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import FavoriteButton from '@/components/FavoriteButton'
import { useFavorites } from '@/components/FavoritesProvider'

interface FavListing {
  ListingKey: string
  BuildingName: string | null
  StreetNumber: string
  StreetName: string
  UnitNumber: string | null
  City: string
  ListPrice: number
  BedroomsTotal: number
  BathroomsTotalInteger: number
  LivingArea: number
  Media: { MediaURL: string; Order: number }[]
}

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [listings, setListings] = useState<FavListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (favorites.length === 0) {
      setListings([])
      setLoading(false)
      return
    }
    // Fetch all listings and filter by favorites
    fetch('/api/bridge?limit=200')
      .then(r => r.json())
      .then(data => {
        const favListings = (data.listings || []).filter((l: FavListing) =>
          favorites.includes(l.ListingKey)
        )
        setListings(favListings)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [favorites])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 min-w-0 px-4 py-8">
            <nav className="text-xs text-muted mb-4">
              <a href="/" className="hover:text-black">🏠 Home</a>
              <span className="mx-1">/</span>
              <span className="text-black">My Favorites</span>
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">❤️ My Favorite Properties</h1>
            <p className="text-sm text-accent mb-6">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </p>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 animate-pulse">⏳</div>
                <p className="text-muted">Loading your favorites...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 border border-border bg-light">
                <div className="text-4xl mb-3">🤍</div>
                <h2 className="font-bold text-lg mb-2">No favorites yet</h2>
                <p className="text-sm text-muted mb-4">Click the heart icon on any property to save it here.</p>
                <a href="/condos" className="btn-primary text-sm inline-block">Browse Condos</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map(listing => {
                  const photo = listing.Media?.sort((a, b) => a.Order - b.Order)[0]?.MediaURL
                  return (
                    <div key={listing.ListingKey} className="border border-border bg-white group relative">
                      <div className="absolute top-2 right-2 z-10">
                        <FavoriteButton listingId={listing.ListingKey} />
                      </div>
                      <a href={`/property/${listing.ListingKey}`} className="block">
                        <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                          {photo ? (
                            <img src={photo} alt={listing.BuildingName || listing.StreetName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-sm">📷</div>
                          )}
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="text-sm font-medium">{listing.BuildingName || listing.StreetName}{listing.UnitNumber ? ` #${listing.UnitNumber}` : ''}</p>
                              <p className="text-xs text-muted">{listing.City}, FL</p>
                            </div>
                            <p className="text-sm font-bold whitespace-nowrap">{formatPrice(listing.ListPrice)}</p>
                          </div>
                          <div className="flex gap-3 text-xs text-muted">
                            <span>🛏️ {listing.BedroomsTotal}</span>
                            <span>🚿 {listing.BathroomsTotalInteger}</span>
                            <span>📐 {listing.LivingArea.toLocaleString()} ft²</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
