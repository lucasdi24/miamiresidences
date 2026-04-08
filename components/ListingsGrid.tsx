'use client'
import { useState } from 'react'
import ListingCard from './ListingCard'

interface ListingData {
  listingKey: string
  photo?: string
  name: string
  subtitle: string
  price: string
  beds: number
  baths: number
  sqft: number
  lotSize?: number
  href: string
}

interface ListingsGridProps {
  listings: ListingData[]
  total: number
  initialVisible?: number
  loadMoreIncrement?: number
}

export default function ListingsGrid({ listings, total, initialVisible = 24, loadMoreIncrement = 24 }: ListingsGridProps) {
  const [visible, setVisible] = useState(initialVisible)
  const shown = listings.slice(0, visible)
  const hasMore = visible < listings.length

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {shown.map(l => (
          <ListingCard key={l.listingKey} {...l} />
        ))}
      </div>

      {listings.length === 0 && (
        <p className="text-center text-muted py-12">No properties found matching your criteria.</p>
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisible(v => v + loadMoreIncrement)}
            className="btn-outline text-sm inline-flex items-center gap-2"
          >
            Load More Properties
            <span className="text-xs text-muted">({visible} of {listings.length})</span>
          </button>
        </div>
      )}

      {!hasMore && listings.length > initialVisible && (
        <p className="text-center text-xs text-muted mt-6">
          Showing all {listings.length} of {total} properties
        </p>
      )}
    </>
  )
}
