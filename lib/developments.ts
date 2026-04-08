export interface DevelopmentDetail {
  id: string
  slug: string
  name: string
  tagline: string
  heroImage: string
  gallery: string[]
  neighborhood: string
  city: string
  address: string
  developer: string
  architect: string
  interiorDesigner: string
  units: number
  floors: number
  yearBuilt: number
  delivery: string
  startingPrice: number
  pricePerSqFt: number
  residenceSizes: { min: number; max: number }
  bedrooms: { min: number; max: number }
  bathrooms: { min: number; max: number }
  lat: number
  lng: number
  description: string
  longDescription: string
  buildingAmenities: string[]
  residenceFeatures: string[]
  floorPlans: { name: string; beds: number; baths: number; sqft: number; price: string }[]
}

let cachedDevelopments: DevelopmentDetail[] | null = null

async function loadDevelopments(): Promise<DevelopmentDetail[]> {
  if (cachedDevelopments) return cachedDevelopments
  const fs = await import('fs')
  const path = await import('path')
  const filePath = path.join(process.cwd(), 'data', 'developments-detail.json')
  const raw = fs.readFileSync(filePath, 'utf-8')
  cachedDevelopments = JSON.parse(raw)
  return cachedDevelopments!
}

export async function getAllDevelopments(): Promise<DevelopmentDetail[]> {
  return loadDevelopments()
}

export async function getDevelopmentBySlug(slug: string): Promise<DevelopmentDetail | null> {
  const devs = await loadDevelopments()
  return devs.find(d => d.slug === slug) || null
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}
