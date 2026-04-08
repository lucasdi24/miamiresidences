'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DevelopmentsAdmin() {
  const [developments, setDevelopments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/developments')
      .then(r => r.json())
      .then(data => {
        setDevelopments(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = developments.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.neighborhood?.toLowerCase().includes(search.toLowerCase()) ||
    d.developer?.toLowerCase().includes(search.toLowerCase())
  )

  const updateDevelopment = (slug: string, field: string, value: any) => {
    setDevelopments(devs =>
      devs.map(d => d.slug === slug ? { ...d, [field]: value } : d)
    )
  }

  const saveDevelopment = async (slug: string) => {
    setSaving(true)
    const dev = developments.find(d => d.slug === slug)
    if (!dev) return

    await fetch('/api/developments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dev),
    })

    setSaving(false)
    setSaved(true)
    setEditingSlug(null)
    setTimeout(() => setSaved(false), 2000)
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`
    return `$${price}`
  }

  if (loading) return <p className="text-muted">Loading developments...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Developments</h1>
          <p className="text-sm text-muted">{developments.length} new development projects</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-sm">✓ Saved</span>}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search developments by name, location, or developer..."
          className="input-field w-full md:w-96"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{developments.length}</p>
          <p className="text-xs text-muted mt-1">Total Projects</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{developments.filter(d => d.delivery && parseInt(d.delivery) > 2025).length}</p>
          <p className="text-xs text-muted mt-1">Pre-Construction</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{developments.filter(d => d.delivery && parseInt(d.delivery) <= 2025).length}</p>
          <p className="text-xs text-muted mt-1">Delivered / Delivering</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{developments.reduce((sum, d) => sum + (d.units || 0), 0).toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">Total Units</p>
        </div>
      </div>

      {/* Developments Table */}
      <div className="bg-white border border-border rounded-sm">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">All Developments</h2>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((dev) => (
            <div key={dev.slug || dev.id}>
              {editingSlug === dev.slug ? (
                /* Edit Mode */
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{dev.name}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingSlug(null)} className="text-xs text-muted hover:text-primary">Cancel</button>
                      <button onClick={() => saveDevelopment(dev.slug)} disabled={saving} className="btn-primary text-xs py-1 px-4 rounded-sm">
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Name</label>
                      <input
                        type="text"
                        value={dev.name || ''}
                        onChange={e => updateDevelopment(dev.slug, 'name', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Neighborhood</label>
                      <input
                        type="text"
                        value={dev.neighborhood || ''}
                        onChange={e => updateDevelopment(dev.slug, 'neighborhood', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Address</label>
                      <input
                        type="text"
                        value={dev.address || ''}
                        onChange={e => updateDevelopment(dev.slug, 'address', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Developer</label>
                      <input
                        type="text"
                        value={dev.developer || ''}
                        onChange={e => updateDevelopment(dev.slug, 'developer', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Architect</label>
                      <input
                        type="text"
                        value={dev.architect || ''}
                        onChange={e => updateDevelopment(dev.slug, 'architect', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Interior Designer</label>
                      <input
                        type="text"
                        value={dev.interiorDesigner || ''}
                        onChange={e => updateDevelopment(dev.slug, 'interiorDesigner', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Starting Price ($)</label>
                      <input
                        type="number"
                        value={dev.startingPrice || 0}
                        onChange={e => updateDevelopment(dev.slug, 'startingPrice', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Price per Sq Ft ($)</label>
                      <input
                        type="number"
                        value={dev.pricePerSqFt || 0}
                        onChange={e => updateDevelopment(dev.slug, 'pricePerSqFt', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Delivery Year</label>
                      <input
                        type="text"
                        value={dev.delivery || ''}
                        onChange={e => updateDevelopment(dev.slug, 'delivery', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Units</label>
                      <input
                        type="number"
                        value={dev.units || 0}
                        onChange={e => updateDevelopment(dev.slug, 'units', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Floors</label>
                      <input
                        type="number"
                        value={dev.floors || 0}
                        onChange={e => updateDevelopment(dev.slug, 'floors', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted block mb-1">Tagline</label>
                      <input
                        type="text"
                        value={dev.tagline || ''}
                        onChange={e => updateDevelopment(dev.slug, 'tagline', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted block mb-1">Description</label>
                    <textarea
                      value={dev.description || ''}
                      onChange={e => updateDevelopment(dev.slug, 'description', e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted block mb-1">Hero Image URL</label>
                    <input
                      type="text"
                      value={dev.heroImage || ''}
                      onChange={e => updateDevelopment(dev.slug, 'heroImage', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted block mb-1">Building Amenities (comma-separated)</label>
                    <textarea
                      value={dev.buildingAmenities?.join(', ') || ''}
                      onChange={e => updateDevelopment(dev.slug, 'buildingAmenities', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                      rows={2}
                      className="input-field resize-none text-xs"
                    />
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-light/50 transition-colors group"
                  onClick={() => setEditingSlug(dev.slug)}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-16 h-12 bg-gray-200 rounded-sm overflow-hidden shrink-0">
                      {(dev.heroImage || dev.image) && (
                        <img src={dev.heroImage || dev.image} alt={dev.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{dev.name}</p>
                      <p className="text-xs text-muted truncate">{dev.neighborhood} • {dev.developer || 'Developer TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium text-gold">
                        {dev.startingPrice ? formatPrice(dev.startingPrice) : 'Price TBD'}
                      </p>
                      <p className="text-[10px] text-muted">{dev.units} units • {dev.floors} floors</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                      dev.delivery && parseInt(dev.delivery) > 2026 ? 'bg-blue-50 text-blue-700' :
                      dev.delivery && parseInt(dev.delivery) > 2025 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {dev.delivery || 'TBD'}
                    </span>
                    <Link
                      href={`/new-developments/${dev.slug}`}
                      onClick={e => e.stopPropagation()}
                      className="text-xs text-gold hover:underline hidden md:block"
                    >
                      View ↗
                    </Link>
                    <span className="text-xs text-muted group-hover:text-gold transition-colors">Edit →</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted py-8 text-sm">No developments match your search</p>
          )}
        </div>
      </div>
    </div>
  )
}
