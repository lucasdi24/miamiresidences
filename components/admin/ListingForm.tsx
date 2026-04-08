'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Listing } from '@/lib/types'

interface ListingFormProps {
  listing?: Listing
  isEdit?: boolean
}

const neighborhoods = ['Aventura', 'Bal Harbour', 'Bay Harbor Islands', 'Boca Raton', 'Brickell', 'Brickell Key', 'Coconut Grove', 'Coral Gables', 'Downtown Miami', 'Edgewater', 'Fisher Island', 'Fort Lauderdale Beach', 'Hallandale Beach', 'Hollywood Beach', 'Key Biscayne', 'Las Olas', 'Miami Beach', 'South Beach', 'Sunny Isles Beach', 'Surfside', 'West Palm Beach']

export default function ListingForm({ listing, isEdit }: ListingFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: listing?.title || '',
    building: listing?.building || '',
    unit: listing?.unit || '',
    neighborhood: listing?.neighborhood || '',
    price: listing?.price || 0,
    priceMode: listing?.priceMode || 'sale',
    type: listing?.type || 'condo',
    beds: listing?.beds || 1,
    baths: listing?.baths || 1,
    sqft: listing?.sqft || 0,
    description: listing?.description || '',
    address: listing?.address || '',
    featured: listing?.featured || false,
  })

  const update = (field: string, value: string | number | boolean) => setForm(p => ({ ...p, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = isEdit ? `/api/listings/${listing?.id}` : '/api/listings'
      const method = isEdit ? 'PUT' : 'POST'
      const body = { ...form, sqftMetric: Math.round(form.sqft * 0.0929), images: listing?.images || [] }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) router.push('/admin/listings')
    } catch { /* ignore */ }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white border border-border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Title *</label>
            <input required value={form.title} onChange={e => update('title', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Neighborhood *</label>
            <select required value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)} className="select-field">
              <option value="">Select...</option>
              {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Building</label>
            <input value={form.building} onChange={e => update('building', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Unit</label>
            <input value={form.unit} onChange={e => update('unit', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Address</label>
            <input value={form.address} onChange={e => update('address', e.target.value)} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)} className="select-field">
              <option value="condo">Condo</option><option value="home">Home</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Mode</label>
            <select value={form.priceMode} onChange={e => update('priceMode', e.target.value)} className="select-field">
              <option value="sale">Sale</option><option value="rent">Rent</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Price ($) *</label>
            <input required type="number" value={form.price} onChange={e => update('price', Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Sqft</label>
            <input type="number" value={form.sqft} onChange={e => update('sqft', Number(e.target.value))} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Beds</label>
            <input type="number" min={0} value={form.beds} onChange={e => update('beds', Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Baths</label>
            <input type="number" min={0} value={form.baths} onChange={e => update('baths', Number(e.target.value))} className="input-field" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="accent-black w-4 h-4" />
              Featured
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Description</label>
          <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)} className="input-field" />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? 'Saving...' : isEdit ? 'Update Listing' : 'Create Listing'}
        </button>
        <button type="button" onClick={() => router.push('/admin/listings')} className="btn-outline text-sm">Cancel</button>
      </div>
    </form>
  )
}
