'use client'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFavorites } from './FavoritesProvider'
import SearchAutocomplete from './SearchAutocomplete'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { count } = useFavorites()
  const router = useRouter()

  const [searchType, setSearchType] = useState('buy-condo')
  const [neighborhood, setNeighborhood] = useState('')
  const [beds, setBeds] = useState('')
  const [price, setPrice] = useState('')

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Condos', href: '/condos' },
    { label: 'Homes', href: '/homes' },
    { label: 'New Developments', href: '/new-developments' },
    { label: 'Estimate', href: '/condos' },
    { label: 'Sell', href: '/condos' },
  ]

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    let route = '/condos'
    if (searchType === 'buy-home' || searchType === 'rent-home') route = '/homes'
    if (neighborhood) {
      const citySlug = neighborhood.toLowerCase().replace(/\s+/g, '-')
      route = `/condos/${citySlug}`
    }
    if (beds) params.set('beds', beds)
    if (price) {
      const [min, max] = price.split('-')
      if (min) params.set('minPrice', min)
      if (max) params.set('maxPrice', max)
    }
    if (searchType.startsWith('rent')) params.set('mode', 'rent')
    const qs = params.toString()
    setFiltersOpen(false)
    router.push(`${route}${qs ? `?${qs}` : ''}`)
  }

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Top bar */}
        <div className="bg-primary text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-4 h-14 lg:h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden -ml-2 p-2 hover:bg-white/10 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <a href="/" className="flex flex-col items-center lg:items-start">
                <span className="text-base lg:text-lg font-semibold tracking-[0.15em]">MIAMI RESIDENCE</span>
                <span className="hidden lg:block text-[9px] text-white/40 tracking-[0.25em] uppercase">Luxury Real Estate</span>
              </a>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-[11px] font-medium tracking-wider uppercase text-white/70 hover:text-white px-3 py-2 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-1">
                <div className="hidden md:block text-right mr-3">
                  <span className="text-[9px] text-white/40 block uppercase tracking-wider">Call Us</span>
                  <a href="tel:3057511000" className="text-sm font-medium tracking-wide hover:text-gold transition-colors">305 751-1000</a>
                </div>
                <a
                  href="/favorites"
                  className="relative p-2 hover:bg-white/10 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="My Favorites"
                  aria-label="My Favorites"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {count > 0 && (
                    <span className="absolute top-1 right-1 bg-gold text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold">{count}</span>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar — compact on mobile, full on desktop */}
        <div className="bg-secondary border-t border-white/5">
          <div className="max-w-7xl mx-auto px-3 py-2.5">
            {/* Mobile: single autocomplete + filter button */}
            <div className="lg:hidden flex gap-2">
              <SearchAutocomplete className="flex-1" />
              <button
                onClick={() => setFiltersOpen(true)}
                className="bg-gold text-white px-4 rounded-sm flex items-center gap-1.5 text-sm font-medium min-h-[44px] active:opacity-80"
                aria-label="Open filters"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>

            {/* Desktop: full inline search */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-wrap gap-2 items-center">
              <SearchAutocomplete className="flex-1 min-w-[200px]" />
              <select value={searchType} onChange={e => setSearchType(e.target.value)} className="bg-white/95 text-primary px-3 h-10 text-sm rounded-sm">
                <option value="buy-condo">Buy Condo</option>
                <option value="rent-condo">Rent Condo</option>
                <option value="buy-home">Buy Home</option>
                <option value="rent-home">Rent Home</option>
              </select>
              <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="bg-white/95 text-primary px-3 h-10 text-sm rounded-sm">
                <option value="">All Areas</option>
                <option value="Miami">Miami</option>
                <option value="Miami Beach">Miami Beach</option>
                <option value="Sunny Isles Beach">Sunny Isles Beach</option>
                <option value="Bal Harbour">Bal Harbour</option>
                <option value="Coral Gables">Coral Gables</option>
                <option value="Key Biscayne">Key Biscayne</option>
              </select>
              <select value={beds} onChange={e => setBeds(e.target.value)} className="bg-white/95 text-primary px-3 h-10 text-sm rounded-sm">
                <option value="">Beds</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <select value={price} onChange={e => setPrice(e.target.value)} className="bg-white/95 text-primary px-3 h-10 text-sm rounded-sm">
                <option value="">Price</option>
                <option value="200000-500000">$200K - $500K</option>
                <option value="500000-1000000">$500K - $1M</option>
                <option value="1000000-2000000">$1M - $2M</option>
                <option value="2000000-5000000">$2M - $5M</option>
                <option value="5000000-">$5M+</option>
              </select>
              <button type="submit" className="bg-gold text-white px-6 h-10 text-sm font-medium hover:bg-yellow-700 transition-colors rounded-sm">Search</button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile drawer menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-primary text-white flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
              <span className="text-base font-semibold tracking-[0.15em]">MENU</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 -mr-2 hover:bg-white/10 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3">
              {navLinks.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-5 py-4 text-sm font-medium tracking-wider uppercase text-white/80 hover:bg-white/5 hover:text-gold border-b border-white/5"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/favorites"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-4 text-sm font-medium tracking-wider uppercase text-white/80 hover:bg-white/5 hover:text-gold border-b border-white/5"
              >
                Favorites {count > 0 && <span className="ml-2 text-gold">({count})</span>}
              </a>
            </nav>
            <div className="border-t border-white/10 px-5 py-5 pb-safe">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Call Us</p>
              <a href="tel:3057511000" className="text-lg font-semibold text-white hover:text-gold transition-colors">305 751-1000</a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile filters bottom sheet */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 h-14 border-b border-border">
              <span className="text-base font-semibold">Search Filters</span>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSearch} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Type</label>
                <select value={searchType} onChange={e => setSearchType(e.target.value)} className="select-field">
                  <option value="buy-condo">Buy Condo</option>
                  <option value="rent-condo">Rent Condo</option>
                  <option value="buy-home">Buy Home</option>
                  <option value="rent-home">Rent Home</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Neighborhood</label>
                <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="select-field">
                  <option value="">All Areas</option>
                  <option value="Miami">Miami</option>
                  <option value="Miami Beach">Miami Beach</option>
                  <option value="Sunny Isles Beach">Sunny Isles Beach</option>
                  <option value="Bal Harbour">Bal Harbour</option>
                  <option value="Coral Gables">Coral Gables</option>
                  <option value="Key Biscayne">Key Biscayne</option>
                  <option value="Brickell">Brickell</option>
                  <option value="Aventura">Aventura</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Bedrooms</label>
                <select value={beds} onChange={e => setBeds(e.target.value)} className="select-field">
                  <option value="">Any</option>
                  <option value="0">Studio</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Price Range</label>
                <select value={price} onChange={e => setPrice(e.target.value)} className="select-field">
                  <option value="">Any Price</option>
                  <option value="200000-500000">$200K - $500K</option>
                  <option value="500000-1000000">$500K - $1M</option>
                  <option value="1000000-2000000">$1M - $2M</option>
                  <option value="2000000-5000000">$2M - $5M</option>
                  <option value="5000000-">$5M+</option>
                </select>
              </div>
            </form>
            <div className="border-t border-border p-4 pb-safe">
              <button
                onClick={handleSearch as any}
                className="w-full bg-gold text-white py-4 font-semibold rounded-sm hover:bg-yellow-700 transition-colors min-h-[52px]"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
