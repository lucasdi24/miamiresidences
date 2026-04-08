'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import { Listing } from '@/lib/types'

function ListingsContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    searchParams.forEach((v, k) => params.set(k, v))
    fetch(`/api/listings?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setListings(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [searchParams])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🏠 Properties</h1>
        <p className="text-sm text-muted">{listings.length} result{listings.length !== 1 ? 's' : ''}</p>
      </div>
      {loading ? (
        <p className="text-center text-muted py-12">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="text-center text-muted py-12">No listings found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(l => (
            <ListingCard
              key={l.id}
              listingKey={l.id}
              photo={l.images?.[0]}
              name={l.building || l.title}
              subtitle={l.neighborhood}
              price={formatPrice(l.price)}
              beds={l.beds}
              baths={l.baths}
              sqft={l.sqft}
              href={`/listings/${l.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ListingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-light">
        <Suspense fallback={<p className="text-center text-muted py-12">Loading...</p>}>
          <ListingsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
