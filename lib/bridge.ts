import { BridgeListing } from './types'

// Bridge API configuration
// When you get your real API key, set BRIDGE_API_KEY in .env.local
// and BRIDGE_DATASET_ID (your MLS dataset code, e.g. "miamire")
const API_KEY = process.env.BRIDGE_API_KEY || ''
const DATASET_ID = process.env.BRIDGE_DATASET_ID || 'miamire'
const BASE_URL = `https://api.bridgedataoutput.com/api/v2/OData/${DATASET_ID}`

// When no API key is set, use mock data from bridge-listings.json
const USE_MOCK = !API_KEY

async function fetchFromBridge(endpoint: string, params: Record<string, string> = {}): Promise<BridgeListing[]> {
  if (USE_MOCK) {
    return fetchMock(params)
  }

  const query = new URLSearchParams(params)
  query.set('access_token', API_KEY)

  const res = await fetch(`${BASE_URL}${endpoint}?${query.toString()}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 300 },
  })

  if (!res.ok) throw new Error(`Bridge API error: ${res.status}`)
  const data = await res.json()
  return data.value || []
}

async function fetchMock(params: Record<string, string> = {}): Promise<BridgeListing[]> {
  const fs = await import('fs')
  const path = await import('path')
  const filePath = path.join(process.cwd(), 'data', 'bridge-listings.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  let listings: BridgeListing[] = JSON.parse(raw)

  // Apply filters (mimicking OData $filter)
  if (params.city) {
    listings = listings.filter(l => l.City.toLowerCase() === params.city!.toLowerCase())
  }
  if (params.neighborhood) {
    // Map neighborhood names to cities + building areas
    const hood = params.neighborhood.toLowerCase()
    listings = listings.filter(l => {
      const city = l.City.toLowerCase()
      const building = (l.BuildingName || '').toLowerCase()
      return city.includes(hood) || building.includes(hood)
    })
  }
  if (params.minPrice) {
    listings = listings.filter(l => l.ListPrice >= Number(params.minPrice))
  }
  if (params.maxPrice) {
    listings = listings.filter(l => l.ListPrice <= Number(params.maxPrice))
  }
  if (params.minBeds) {
    listings = listings.filter(l => l.BedroomsTotal >= Number(params.minBeds))
  }
  if (params.maxBeds) {
    listings = listings.filter(l => l.BedroomsTotal <= Number(params.maxBeds))
  }
  if (params.propertySubType) {
    listings = listings.filter(l => l.PropertySubType === params.propertySubType)
  }
  if (params.status) {
    listings = listings.filter(l => l.StandardStatus === params.status)
  } else {
    // Default: only Active listings
    listings = listings.filter(l => l.StandardStatus === 'Active')
  }
  if (params.waterfront === 'true') {
    listings = listings.filter(l => l.WaterfrontYN)
  }

  // Sort
  const sort = params.sort || 'newest'
  if (sort === 'price-asc') listings.sort((a, b) => a.ListPrice - b.ListPrice)
  else if (sort === 'price-desc') listings.sort((a, b) => b.ListPrice - a.ListPrice)
  else if (sort === 'sqft') listings.sort((a, b) => b.LivingArea - a.LivingArea)
  else listings.sort((a, b) => new Date(b.OnMarketDate).getTime() - new Date(a.OnMarketDate).getTime())

  // Pagination
  const limit = Number(params.limit) || 24
  const offset = Number(params.offset) || 0
  const total = listings.length
  listings = listings.slice(offset, offset + limit)

  // Attach total count for pagination (hacky but works for mock)
  ;(listings as any)._total = total

  return listings
}

// Public API functions

export async function searchListings(filters: {
  city?: string
  neighborhood?: string
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  maxBeds?: number
  propertySubType?: string
  status?: string
  waterfront?: boolean
  sort?: string
  limit?: number
  offset?: number
} = {}): Promise<{ listings: BridgeListing[]; total: number }> {
  const params: Record<string, string> = {}

  if (filters.city) params.city = filters.city
  if (filters.neighborhood) params.neighborhood = filters.neighborhood
  if (filters.minPrice) params.minPrice = String(filters.minPrice)
  if (filters.maxPrice) params.maxPrice = String(filters.maxPrice)
  if (filters.minBeds) params.minBeds = String(filters.minBeds)
  if (filters.maxBeds) params.maxBeds = String(filters.maxBeds)
  if (filters.propertySubType) params.propertySubType = filters.propertySubType
  if (filters.status) params.status = filters.status
  if (filters.waterfront) params.waterfront = 'true'
  if (filters.sort) params.sort = filters.sort
  if (filters.limit) params.limit = String(filters.limit)
  if (filters.offset) params.offset = String(filters.offset)

  if (!USE_MOCK) {
    // Build OData $filter for real Bridge API
    const filterParts: string[] = []
    if (filters.city) filterParts.push(`City eq '${filters.city}'`)
    if (filters.minPrice) filterParts.push(`ListPrice ge ${filters.minPrice}`)
    if (filters.maxPrice) filterParts.push(`ListPrice le ${filters.maxPrice}`)
    if (filters.minBeds) filterParts.push(`BedroomsTotal ge ${filters.minBeds}`)
    if (filters.propertySubType) filterParts.push(`PropertySubType eq '${filters.propertySubType}'`)
    if (filters.status) filterParts.push(`StandardStatus eq '${filters.status}'`)
    else filterParts.push(`StandardStatus eq 'Active'`)
    if (filters.waterfront) filterParts.push(`WaterfrontYN eq true`)

    const odataParams: Record<string, string> = {}
    if (filterParts.length) odataParams['$filter'] = filterParts.join(' and ')
    odataParams['$top'] = String(filters.limit || 24)
    odataParams['$skip'] = String(filters.offset || 0)
    odataParams['$orderby'] = filters.sort === 'price-asc' ? 'ListPrice asc'
      : filters.sort === 'price-desc' ? 'ListPrice desc'
      : 'OnMarketDate desc'
    odataParams['$count'] = 'true'

    const listings = await fetchFromBridge('/Property', odataParams)
    return { listings, total: (listings as any)['@odata.count'] || listings.length }
  }

  const listings = await fetchFromBridge('/Property', params)
  return { listings, total: (listings as any)._total || listings.length }
}

export async function getListing(listingKey: string): Promise<BridgeListing | null> {
  if (USE_MOCK) {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', 'bridge-listings.json')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const listings: BridgeListing[] = JSON.parse(raw)
    return listings.find(l => l.ListingKey === listingKey) || null
  }

  const res = await fetch(`${BASE_URL}/Property('${listingKey}')?access_token=${API_KEY}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 300 },
  })
  if (!res.ok) return null
  return res.json()
}

// Helper to format a Bridge listing address
export function formatAddress(listing: BridgeListing): string {
  const parts = [listing.StreetNumber, listing.StreetName]
  if (listing.UnitNumber) parts.push(`#${listing.UnitNumber}`)
  parts.push(listing.City, listing.StateOrProvince, listing.PostalCode)
  return parts.filter(Boolean).join(' ')
}

// Helper to get primary photo URL
export function getPrimaryPhoto(listing: BridgeListing): string | undefined {
  if (!listing.Media || listing.Media.length === 0) return undefined
  const sorted = [...listing.Media].sort((a, b) => a.Order - b.Order)
  return sorted[0].MediaURL
}

// Helper to format price
export function formatListPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

// Helper to convert sqft to m2
export function sqftToM2(sqft: number): number {
  return Math.round(sqft * 0.0929)
}
