'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Listing } from '@/lib/types'

export default function ListingDetail() {
  const params = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/listings/${params.id}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setListing(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>
  if (!listing) return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center"><p className="text-muted">Listing not found</p></div>
      <Footer />
    </div>
  )

  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.price)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Image */}
          <div className="aspect-[16/9] bg-gray-200 mb-6 overflow-hidden">
            {listing.images && listing.images.length > 0 ? (
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">📷 No Image Available</div>
            )}
          </div>
          {/* Details */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{listing.title}</h1>
              {listing.building && <p className="text-muted text-sm mb-1">{listing.building} {listing.unit ? `#${listing.unit}` : ''}</p>}
              <p className="text-sm text-accent mb-4">{listing.address}</p>
              <p className="text-sm leading-relaxed text-accent">{listing.description}</p>
            </div>
            <div className="md:w-72 shrink-0">
              <div className="bg-light border border-border p-6">
                <p className="text-3xl font-bold mb-1">{price}{listing.priceMode === 'rent' ? <span className="text-lg font-normal text-muted">/mo</span> : ''}</p>
                <p className="text-xs text-muted uppercase tracking-wider mb-4">For {listing.priceMode}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted">🏠 Type</span><span className="capitalize font-medium">{listing.type}</span></div>
                  <div className="flex justify-between"><span className="text-muted">🛏️ Bedrooms</span><span className="font-medium">{listing.beds}</span></div>
                  <div className="flex justify-between"><span className="text-muted">🚿 Bathrooms</span><span className="font-medium">{listing.baths}</span></div>
                  <div className="flex justify-between"><span className="text-muted">📐 Area</span><span className="font-medium">{listing.sqft.toLocaleString()} ft&sup2; ({listing.sqftMetric} m&sup2;)</span></div>
                  <div className="flex justify-between"><span className="text-muted">📍 Neighborhood</span><span className="font-medium">{listing.neighborhood}</span></div>
                </div>
                <hr className="border-border my-4" />
                <button className="btn-primary w-full text-sm">📞 Contact Agent</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
