import { SimplyRetsListing } from './types'

const SIMPLYRETS_BASE = 'https://api.simplyrets.com'
const AUTH = Buffer.from('simplyrets:simplyrets').toString('base64')

export async function fetchListings(params?: Record<string, string>): Promise<SimplyRetsListing[]> {
  const url = new URL(`${SIMPLYRETS_BASE}/properties`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${AUTH}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) return []
  return res.json()
}

export async function fetchListing(mlsId: string): Promise<SimplyRetsListing | null> {
  const res = await fetch(`${SIMPLYRETS_BASE}/properties/${mlsId}`, {
    headers: { Authorization: `Basic ${AUTH}` },
    next: { revalidate: 300 },
  })
  if (!res.ok) return null
  return res.json()
}

export function formatPrice(price: number, mode: 'sale' | 'rent' = 'sale'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
  return mode === 'rent' ? `${formatted}/mo` : formatted
}

export function sqftToM2(sqft: number): number {
  return Math.round(sqft * 0.092903)
}
