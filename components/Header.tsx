'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useFavorites } from './FavoritesProvider'
import SearchAutocomplete from './SearchAutocomplete'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useFavorites()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('buy-condo')
  const [neighborhood, setNeighborhood] = useState('')
  const [beds, setBeds] = useState('')
  const [price, setPrice] = useState('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    let route = '/condos'
    if (searchType === 'buy-home' || searchType === 'rent-home') route = '/homes'
    if (query) params.set('q', query)
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
    router.push(`${route}${qs ? `?${qs}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3.5">
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-1 hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <a href="/" className="flex flex-col">
              <span className="text-lg font-semibold tracking-[0.15em]">MIAMI RESIDENCE</span>
              <span className="text-[9px] text-white/40 tracking-[0.25em] uppercase">Luxury Real Estate</span>
            </a>
            <nav className={`${menuOpen ? 'flex' : 'hidden'} lg:flex absolute lg:relative top-full left-0 w-full lg:w-auto bg-primary lg:bg-transparent flex-col lg:flex-row gap-0 lg:gap-1 p-0 lg:p-0 border-t border-white/10 lg:border-0 z-50`}>
              {[
                { label: 'CONDOS', href: '/condos' },
                { label: 'HOMES', href: '/homes' },
                { label: 'ESTIMATE', href: '/condos' },
                { label: 'NEW DEVELOPMENTS', href: '/new-developments' },
                { label: 'SELL', href: '/condos' },
              ].map(item => (
                <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="text-[11px] font-medium tracking-wider text-white/70 hover:text-white px-3 py-3 lg:py-0 border-b border-white/5 lg:border-0 transition-colors">{item.label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-5">
              <div className="hidden md:block text-right">
                <span className="text-[9px] text-white/40 block uppercase tracking-wider">Call Us</span>
                <span className="text-sm font-medium tracking-wide">305 751-1000</span>
              </div>
              <a href="/favorites" className="relative p-1 hover:opacity-70 transition-opacity" title="My Favorites">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{count}</span>
                )}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="bg-secondary border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap gap-2 items-center">
          <SearchAutocomplete className="flex-1 min-w-[200px]" />
          <select value={searchType} onChange={e => setSearchType(e.target.value)} className="bg-white/95 text-primary px-3 py-2 text-sm rounded-sm">
            <option value="buy-condo">Buy Condo</option>
            <option value="rent-condo">Rent Condo</option>
            <option value="buy-home">Buy Home</option>
            <option value="rent-home">Rent Home</option>
          </select>
          <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="bg-white/95 text-primary px-3 py-2 text-sm rounded-sm hidden md:block">
            <option value="">All Areas</option>
            <option value="Miami">Miami</option>
            <option value="Miami Beach">Miami Beach</option>
            <option value="Sunny Isles Beach">Sunny Isles Beach</option>
            <option value="Bal Harbour">Bal Harbour</option>
            <option value="Coral Gables">Coral Gables</option>
            <option value="Key Biscayne">Key Biscayne</option>
            <option value="Hollywood">Hollywood</option>
            <option value="Hallandale Beach">Hallandale Beach</option>
          </select>
          <select value={beds} onChange={e => setBeds(e.target.value)} className="bg-white/95 text-primary px-3 py-2 text-sm rounded-sm hidden md:block">
            <option value="">Beds</option>
            <option value="0">Studio</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </select>
          <select value={price} onChange={e => setPrice(e.target.value)} className="bg-white/95 text-primary px-3 py-2 text-sm rounded-sm hidden lg:block">
            <option value="">Price</option>
            <option value="200000-500000">$200K - $500K</option>
            <option value="500000-1000000">$500K - $1M</option>
            <option value="1000000-2000000">$1M - $2M</option>
            <option value="2000000-5000000">$2M - $5M</option>
            <option value="5000000-">$5M+</option>
          </select>
          <button type="submit" className="bg-gold text-white px-6 py-2 text-sm font-medium hover:bg-yellow-700 transition-colors rounded-sm">Search</button>
        </div>
      </form>
    </header>
  )
}
