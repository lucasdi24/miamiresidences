'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Listing } from '@/lib/types'

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/listings').then(r => r.json()).then(data => { setListings(data); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listings</h1>
        <Link href="/admin/listings/new" className="btn-primary text-sm">+ New Listing</Link>
      </div>
      <div className="bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-light">
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Title</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Building</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Type</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Price</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Neighborhood</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Featured</th>
              <th className="text-right px-4 py-2 font-medium text-xs uppercase text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted">Loading...</td></tr>
            ) : listings.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted">No listings yet</td></tr>
            ) : listings.map(l => (
              <tr key={l.id} className="border-b border-border hover:bg-light">
                <td className="px-4 py-2 font-medium">{l.title}</td>
                <td className="px-4 py-2 text-muted">{l.building || '—'} {l.unit ? `#${l.unit}` : ''}</td>
                <td className="px-4 py-2">
                  <span className="text-xs px-2 py-0.5 bg-light border border-border">{l.type}</span>
                  <span className="text-xs px-2 py-0.5 bg-light border border-border ml-1">{l.priceMode}</span>
                </td>
                <td className="px-4 py-2">${l.price.toLocaleString()}{l.priceMode === 'rent' ? '/mo' : ''}</td>
                <td className="px-4 py-2">{l.neighborhood}</td>
                <td className="px-4 py-2">{l.featured ? '★' : '—'}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/listings/${l.id}/edit`} className="text-xs text-accent hover:text-black mr-3">Edit</Link>
                  <button onClick={() => handleDelete(l.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
