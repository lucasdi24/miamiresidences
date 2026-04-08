import { NextRequest, NextResponse } from 'next/server'
import { getListing } from '@/lib/bridge'

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const listing = await getListing(params.key)
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    return NextResponse.json(listing)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 })
  }
}
