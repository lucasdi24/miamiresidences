import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { Listing } from '@/lib/types'

const DATA_PATH = join(process.cwd(), 'data', 'listings.json')

function readListings(): Listing[] {
  try { return JSON.parse(readFileSync(DATA_PATH, 'utf-8')) } catch { return [] }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const listing = readListings().find(l => l.id === params.id)
    if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(listing)
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const listings = readListings()
    const idx = listings.findIndex(l => l.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    listings[idx] = { ...listings[idx], ...body, id: params.id }
    writeFileSync(DATA_PATH, JSON.stringify(listings, null, 2))
    return NextResponse.json(listings[idx])
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const listings = readListings()
    const idx = listings.findIndex(l => l.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    listings.splice(idx, 1)
    writeFileSync(DATA_PATH, JSON.stringify(listings, null, 2))
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
