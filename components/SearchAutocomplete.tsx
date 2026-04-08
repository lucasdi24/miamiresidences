'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Suggestion {
  label: string
  type: 'city' | 'building' | 'development'
  href: string
}

const allSuggestions: Suggestion[] = [
  // Cities
  { label: 'Miami', type: 'city', href: '/condos/miami' },
  { label: 'Miami Beach', type: 'city', href: '/condos/miami-beach' },
  { label: 'Sunny Isles Beach', type: 'city', href: '/condos/sunny-isles-beach' },
  { label: 'Bal Harbour', type: 'city', href: '/condos/bal-harbour' },
  { label: 'Coral Gables', type: 'city', href: '/condos/coral-gables' },
  { label: 'Key Biscayne', type: 'city', href: '/condos/key-biscayne' },
  { label: 'Hollywood', type: 'city', href: '/condos/hollywood' },
  { label: 'Hallandale Beach', type: 'city', href: '/condos/hallandale-beach' },
  { label: 'Brickell', type: 'city', href: '/condos/miami' },
  { label: 'South Beach', type: 'city', href: '/condos/miami-beach' },
  { label: 'Edgewater', type: 'city', href: '/condos/miami' },
  { label: 'Downtown Miami', type: 'city', href: '/condos/miami' },
  { label: 'Coconut Grove', type: 'city', href: '/homes' },
  { label: 'Aventura', type: 'city', href: '/condos/miami' },
  // Buildings
  { label: 'Acqualina', type: 'building', href: '/condos/sunny-isles-beach/acqualina' },
  { label: 'Porsche Design Tower', type: 'building', href: '/condos/sunny-isles-beach/porsche-design-tower' },
  { label: 'Jade Beach', type: 'building', href: '/condos/sunny-isles-beach/jade-beach' },
  { label: 'Jade Ocean', type: 'building', href: '/condos/sunny-isles-beach/jade-ocean' },
  { label: 'Regalia', type: 'building', href: '/condos/sunny-isles-beach/regalia' },
  { label: 'Icon Brickell', type: 'building', href: '/condos/miami/icon-brickell' },
  { label: 'Brickell City Centre', type: 'building', href: '/condos/miami/brickell-city-centre' },
  { label: 'Four Seasons', type: 'building', href: '/condos/miami/four-seasons' },
  { label: 'Faena House', type: 'building', href: '/condos/miami-beach/faena-house' },
  { label: 'Continuum', type: 'building', href: '/condos/miami-beach/continuum-north' },
  { label: 'Setai', type: 'building', href: '/condos/miami-beach/setai' },
  { label: 'Apogee', type: 'building', href: '/condos/miami-beach/apogee' },
  { label: 'Oceana Bal Harbour', type: 'building', href: '/condos/bal-harbour/oceana-bal-harbour' },
  { label: 'Ritz Carlton', type: 'building', href: '/condos/bal-harbour/ritz-carlton' },
  { label: 'One Thousand Museum', type: 'building', href: '/condos/miami/one-thousand-museum' },
  { label: 'Aston Martin Residences', type: 'building', href: '/condos/miami/aston-martin-residences' },
  { label: 'Paramount WorldCenter', type: 'building', href: '/condos/miami/paramount-worldcenter' },
  { label: 'Missoni Baia', type: 'building', href: '/condos/miami/missoni-baia' },
  { label: 'UNA Residences', type: 'building', href: '/condos/miami/una-residences' },
  { label: 'Trump Towers', type: 'building', href: '/condos/sunny-isles-beach/trump-towers' },
  { label: 'W South Beach', type: 'building', href: '/condos/miami-beach/w-south-beach' },
  { label: 'Marina Palms', type: 'building', href: '/condos/miami/marina-palms' },
  // Developments
  { label: 'Bentley Residences', type: 'development', href: '/new-developments/bentley-residences' },
  { label: 'Dolce & Gabbana Residences', type: 'development', href: '/new-developments/dolce-gabbana-residences' },
  { label: 'Mercedes-Benz Places', type: 'development', href: '/new-developments/mercedes-benz-places' },
  { label: 'Waldorf Astoria Miami', type: 'development', href: '/new-developments/waldorf-astoria-miami' },
  { label: 'Cipriani Residences', type: 'development', href: '/new-developments/cipriani-residences-miami' },
  { label: 'Baccarat Residences', type: 'development', href: '/new-developments/baccarat-residences-miami' },
  { label: 'St. Regis Residences', type: 'development', href: '/new-developments/st-regis-residences-miami' },
  { label: 'Aria Reserve', type: 'development', href: '/new-developments/aria-reserve' },
  { label: 'Six Fisher Island', type: 'development', href: '/new-developments/six-fisher-island' },
  { label: 'Mandarin Oriental Residences', type: 'development', href: '/new-developments/mandarin-oriental-residences' },
  { label: 'E11EVEN Hotel & Residences', type: 'development', href: '/new-developments/e11even-residences' },
  { label: 'Casa Bella by B&B Italia', type: 'development', href: '/new-developments/casa-bella-residences' },
  { label: 'Rivage Bal Harbour', type: 'development', href: '/new-developments/rivage-bal-harbour' },
  { label: 'Shell Bay Residences', type: 'development', href: '/new-developments/shell-bay-residences' },
  { label: 'Villa Miami', type: 'development', href: '/new-developments/villa-miami' },
]

const typeLabels: Record<string, string> = {
  city: 'Area',
  building: 'Building',
  development: 'New Development',
}

const typeColors: Record<string, string> = {
  city: 'bg-blue-50 text-blue-700',
  building: 'bg-gray-100 text-gray-600',
  development: 'bg-gold-light text-gold',
}

export default function SearchAutocomplete({ className = '' }: { className?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.length >= 1
    ? allSuggestions.filter(s =>
        s.label.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  const showDropdown = focused && filtered.length > 0

  const handleSelect = useCallback((suggestion: Suggestion) => {
    setQuery(suggestion.label)
    setFocused(false)
    router.push(suggestion.href)
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(filtered[activeIndex])
    } else if (e.key === 'Escape') {
      setFocused(false)
    }
  }

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search by city, building, or development..."
        className="w-full bg-white/95 text-primary px-4 py-2 text-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
        autoComplete="off"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-sm shadow-card-hover z-50 overflow-hidden">
          {filtered.map((s, i) => (
            <button
              key={`${s.type}-${s.label}`}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                i === activeIndex ? 'bg-light' : 'hover:bg-light'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-muted text-sm">
                  {s.type === 'city' ? '📍' : s.type === 'building' ? '🏢' : '🏗️'}
                </span>
                <span className="text-sm text-primary truncate">{s.label}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${typeColors[s.type]}`}>
                {typeLabels[s.type]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
