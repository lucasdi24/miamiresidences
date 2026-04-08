'use client'
import { useEffect, useState } from 'react'
import { Listing } from '@/lib/types'

export default function AdminDashboard() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    fetch('/api/listings').then(r => r.json()).then(setListings).catch(() => {})
  }, [])

  const forSale = listings.filter(l => l.priceMode === 'sale')
  const forRent = listings.filter(l => l.priceMode === 'rent')
  const condos = listings.filter(l => l.type === 'condo')
  const homes = listings.filter(l => l.type === 'home')

  const stats = [
    { label: 'Total Listings', value: listings.length },
    { label: 'For Sale', value: forSale.length },
    { label: 'For Rent', value: forRent.length },
    { label: 'Condos', value: condos.length },
    { label: 'Homes', value: homes.length },
    { label: 'Featured', value: listings.filter(l => l.featured).length },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-border p-4">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <h2 className="text-lg font-bold mb-4">Recent Listings</h2>
      <div className="bg-white border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-light">
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Title</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Type</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Price</th>
              <th className="text-left px-4 py-2 font-medium text-xs uppercase text-muted">Neighborhood</th>
            </tr>
          </thead>
          <tbody>
            {listings.slice(0, 5).map(l => (
              <tr key={l.id} className="border-b border-border hover:bg-light">
                <td className="px-4 py-2">{l.title}</td>
                <td className="px-4 py-2 capitalize">{l.type} / {l.priceMode}</td>
                <td className="px-4 py-2">${l.price.toLocaleString()}{l.priceMode === 'rent' ? '/mo' : ''}</td>
                <td className="px-4 py-2">{l.neighborhood}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
