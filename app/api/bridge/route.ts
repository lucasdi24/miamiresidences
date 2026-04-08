import { NextRequest, NextResponse } from 'next/server'
import { searchListings } from '@/lib/bridge'

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams

    const { listings, total } = await searchListings({
      city: params.get('city') || undefined,
      neighborhood: params.get('neighborhood') || undefined,
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      minBeds: params.get('minBeds') ? Number(params.get('minBeds')) : undefined,
      maxBeds: params.get('maxBeds') ? Number(params.get('maxBeds')) : undefined,
      propertySubType: params.get('propertySubType') || undefined,
      status: params.get('status') || undefined,
      waterfront: params.get('waterfront') === 'true',
      sort: params.get('sort') || undefined,
      limit: params.get('limit') ? Number(params.get('limit')) : undefined,
      offset: params.get('offset') ? Number(params.get('offset')) : undefined,
    })

    return NextResponse.json({ listings, total, count: listings.length })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}
