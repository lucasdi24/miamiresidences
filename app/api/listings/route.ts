import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Listing } from '@/lib/types'

const DATA_PATH = join(process.cwd(), 'data', 'listings.json')

function readListings(): Listing[] {
  try { return JSON.parse(readFileSync(DATA_PATH, 'utf-8')) } catch { return [] }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let listings = readListings()
    const type = searchParams.get('type')
    const mode = searchParams.get('mode')
    const neighborhood = searchParams.get('neighborhood')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const beds = searchParams.get('beds')
    const sort = searchParams.get('sort')
    if (type) listings = listings.filter(l => l.type === type)
    if (mode) listings = listings.filter(l => l.priceMode === mode)
    if (neighborhood) listings = listings.filter(l => l.neighborhood.toLowerCase() === neighborhood.toLowerCase())
    if (minPrice) listings = listings.filter(l => l.price >= Number(minPrice))
    if (maxPrice) listings = listings.filter(l => l.price <= Number(maxPrice))
    if (beds) listings = listings.filter(l => l.beds >= Number(beds))
    if (sort === 'newest') listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (sort === 'price-asc') listings.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') listings.sort((a, b) => b.price - a.price)
    return NextResponse.json(listings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const listings = readListings()
    const newListing: Listing = { ...body, id: `l${Date.now()}`, createdAt: new Date().toISOString() }
    listings.push(newListing)
    writeFileSync(DATA_PATH, JSON.stringify(listings, null, 2))
    return NextResponse.json(newListing, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}
