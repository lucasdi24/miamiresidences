import { MetadataRoute } from 'next'
import { searchListings } from '@/lib/bridge'
import { getAllDevelopments } from '@/lib/developments'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://miamiresidence.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/condos`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/homes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/new-developments`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/listings`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/admin`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // City pages
  const cities = ['miami', 'miami-beach', 'sunny-isles-beach', 'bal-harbour', 'coral-gables', 'key-biscayne', 'hollywood', 'hallandale-beach']
  const cityPages: MetadataRoute.Sitemap = cities.map(city => ({
    url: `${baseUrl}/condos/${city}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // All listings (individual property pages)
  const { listings } = await searchListings({ limit: 200, status: 'Active' })
  const listingPages: MetadataRoute.Sitemap = listings.map(l => ({
    url: `${baseUrl}/property/${l.ListingKey}`,
    lastModified: new Date(l.ModificationTimestamp),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Building pages
  const buildings = new Map<string, { city: string; building: string }>()
  for (const l of listings) {
    if (l.BuildingName) {
      const citySlug = l.City.toLowerCase().replace(/\s+/g, '-')
      const buildingSlug = l.BuildingName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      buildings.set(buildingSlug, { city: citySlug, building: buildingSlug })
    }
  }
  const buildingPages: MetadataRoute.Sitemap = Array.from(buildings.values()).map(b => ({
    url: `${baseUrl}/condos/${b.city}/${b.building}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.75,
  }))

  // Development pages
  const developments = await getAllDevelopments()
  const developmentPages: MetadataRoute.Sitemap = developments.map(d => ({
    url: `${baseUrl}/new-developments/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...cityPages, ...developmentPages, ...buildingPages, ...listingPages]
}
