'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSearch() {
  const router = useRouter()
  const [tab, setTab] = useState<'condos' | 'homes'>('condos')
  const [subTab, setSubTab] = useState<'buy' | 'rent' | 'estimate'>('buy')
  const [neighborhood, setNeighborhood] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [waterfront, setWaterfront] = useState(false)
  const [estimateAddress, setEstimateAddress] = useState('')

  const neighborhoods = ['Aventura', 'Bal Harbour', 'Brickell', 'Coconut Grove', 'Coral Gables', 'Downtown Miami', 'Edgewater', 'Hallandale Beach', 'Hollywood Beach', 'Key Biscayne', 'Miami Beach', 'South Beach', 'Sunny Isles Beach', 'Surfside']

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    const base = tab === 'homes' ? '/homes' : '/condos'
    if (neighborhood) {
      const citySlug = neighborhood.toLowerCase().replace(/\s+/g, '-')
      const route = `/condos/${citySlug}`
      if (bedrooms) params.set('beds', bedrooms)
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
      if (waterfront) params.set('waterfront', 'true')
      const qs = params.toString()
      router.push(`${route}${qs ? `?${qs}` : ''}`)
      return
    }
    if (bedrooms) params.set('beds', bedrooms)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (waterfront) params.set('waterfront', 'true')
    if (subTab === 'rent') params.set('mode', 'rent')
    const qs = params.toString()
    router.push(`${base}${qs ? `?${qs}` : ''}`)
  }

  const handleEstimate = (e: FormEvent) => {
    e.preventDefault()
    if (estimateAddress) router.push(`/condos?q=${encodeURIComponent(estimateAddress)}`)
  }

  return (
    <section className="relative bg-primary overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/miami-skyline-hero/1920/600"
          alt="Miami Skyline"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/90" />
      </div>

      <div className="relative max-w-3xl mx-auto pt-8 pb-10 md:pt-12 md:pb-14 px-4">
        <div className="text-center mb-6 md:mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium mb-3">Miami Residence Realty</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-2 leading-tight">
            Find Your Dream Home<br />in Miami
          </h1>
          <p className="text-xs md:text-sm text-white/60 max-w-lg mx-auto px-4">
            Luxury condos, waterfront homes, and exclusive new developments
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            {(['condos', 'homes'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 px-4 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200 min-h-[48px] ${
                  tab === t
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-primary bg-light active:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sub tabs */}
          <div className="flex border-b border-border">
            {(['buy', 'rent', 'estimate'] as const).map(st => (
              <button
                key={st}
                onClick={() => setSubTab(st)}
                className={`flex-1 px-4 py-3 text-xs capitalize transition-all duration-200 min-h-[44px] ${
                  subTab === st
                    ? 'font-semibold text-primary border-b-2 border-gold'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search form */}
          <div className="p-4 md:p-6">
            {subTab !== 'estimate' ? (
              <form onSubmit={handleSearch} className="space-y-3">
                <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="select-field">
                  <option value="">All Neighborhoods</option>
                  {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <select value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="select-field">
                  <option value="">Bedrooms</option>
                  <option value="0">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" inputMode="numeric" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min Price" className="input-field" />
                  <input type="number" inputMode="numeric" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max Price" className="input-field" />
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 py-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-muted hover:text-primary transition-colors min-h-[32px]">
                    <input type="checkbox" className="accent-gold w-4 h-4" />
                    3D Tour
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-muted hover:text-primary transition-colors min-h-[32px]">
                    <input type="checkbox" className="accent-gold w-4 h-4" />
                    Furnished
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-muted hover:text-primary transition-colors min-h-[32px]">
                    <input type="checkbox" checked={waterfront} onChange={e => setWaterfront(e.target.checked)} className="accent-gold w-4 h-4" />
                    Waterfront
                  </label>
                </div>
                <button type="submit" className="w-full bg-gold text-white py-4 font-semibold uppercase tracking-wider text-sm hover:bg-yellow-700 transition-colors rounded-sm min-h-[52px] active:scale-[0.99]">
                  Search Properties
                </button>
              </form>
            ) : (
              <form onSubmit={handleEstimate} className="space-y-3">
                <p className="text-sm text-accent">Get an instant estimate of your property&apos;s market value</p>
                <input
                  type="text"
                  value={estimateAddress}
                  onChange={e => setEstimateAddress(e.target.value)}
                  placeholder="Enter condo address or building name..."
                  className="input-field"
                  required
                />
                <button type="submit" className="w-full bg-gold text-white py-4 font-semibold uppercase tracking-wider text-sm hover:bg-yellow-700 transition-colors rounded-sm min-h-[52px]">
                  Get Estimate
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6 md:mt-8">
          {[
            { value: '2,500+', label: 'Listings' },
            { value: '85+', label: 'Neighborhoods' },
            { value: '15', label: 'Developments' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-lg md:text-xl font-semibold text-white">{stat.value}</p>
              <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-[0.15em] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
