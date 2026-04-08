'use client'
import FavoriteButton from './FavoriteButton'

interface ListingCardProps {
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

export default function ListingCard({ listingKey, photo, name, subtitle, price, beds, baths, sqft, lotSize, href }: ListingCardProps) {
  return (
    <div className="card group relative">
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FavoriteButton listingId={listingKey} className="bg-white/90 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow-soft text-base" />
      </div>
      <a href={href} className="block">
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm bg-light">No Image</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0 flex-1 mr-3">
              <p className="text-sm font-semibold truncate">{name}</p>
              <p className="text-xs text-muted mt-0.5">{subtitle}</p>
            </div>
            <p className="text-sm font-bold text-gold whitespace-nowrap">{price}</p>
          </div>
          <div className="flex gap-4 text-xs text-muted pt-2 border-t border-border">
            <span>{beds} {beds === 1 ? 'Bed' : 'Beds'}</span>
            <span>{baths} {baths === 1 ? 'Bath' : 'Baths'}</span>
            <span>{sqft.toLocaleString()} ft²</span>
            {lotSize && lotSize > 0 && <span>{lotSize.toLocaleString()} ft² lot</span>}
          </div>
        </div>
      </a>
    </div>
  )
}
