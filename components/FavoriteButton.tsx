'use client'
import { useFavorites } from './FavoritesProvider'

export default function FavoriteButton({ listingId, className = '' }: { listingId: string; className?: string }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const fav = isFavorite(listingId)

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(listingId) }}
      className={`transition-transform hover:scale-110 ${className}`}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {fav ? '❤️' : '🤍'}
    </button>
  )
}
