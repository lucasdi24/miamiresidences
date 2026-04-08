interface PropertyCardProps {
  image?: string
  title: string
  unit: string
  price: number
  isRent?: boolean
  beds: number
  baths: number
  sqft: number
}

export default function PropertyCard({ image, title, unit, price, isRent, beds, baths, sqft }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
  return (
    <div className="card group">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm bg-light">No Image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-semibold">{title} <span className="text-muted font-normal">#{unit}</span></span>
          <p className={`text-sm font-bold whitespace-nowrap ${isRent ? 'text-accent' : 'text-gold'}`}>
            {formattedPrice}{isRent && <span className="text-xs font-normal">/mo</span>}
          </p>
        </div>
        <div className="flex gap-4 text-xs text-muted pt-2 border-t border-border">
          <span>{beds} {beds === 1 ? 'Bed' : 'Beds'}</span>
          <span>{baths} {baths === 1 ? 'Bath' : 'Baths'}</span>
          <span>{sqft.toLocaleString()} ft²</span>
        </div>
      </div>
    </div>
  )
}
