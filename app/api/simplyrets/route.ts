import { NextResponse } from 'next/server'
import { fetchListings } from '@/lib/simplyrets'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params: Record<string, string> = {}
    const allowed = ['minprice', 'maxprice', 'type', 'minbeds', 'limit', 'offset']
    allowed.forEach(k => { const v = searchParams.get(k); if (v) params[k] = v })
    if (!params.limit) params.limit = '20'
    const listings = await fetchListings(params)
    return NextResponse.json(listings)
  } catch { return NextResponse.json({ error: 'Failed to fetch from SimplyRETS' }, { status: 500 }) }
}
