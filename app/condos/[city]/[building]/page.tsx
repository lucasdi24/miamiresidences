import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { searchListings, formatListPrice, getPrimaryPhoto, formatAddress, sqftToM2 } from '@/lib/bridge'
import { BridgeListing } from '@/lib/types'

type Props = { params: { city: string; building: string } }

const cityMap: Record<string, string> = {
  'miami': 'Miami',
  'miami-beach': 'Miami Beach',
  'sunny-isles-beach': 'Sunny Isles Beach',
  'bal-harbour': 'Bal Harbour',
  'coral-gables': 'Coral Gables',
  'key-biscayne': 'Key Biscayne',
  'hollywood': 'Hollywood',
  'hallandale-beach': 'Hallandale Beach',
}

function slugToBuilding(slug: string, listings: BridgeListing[]): string | null {
  const match = listings.find(l =>
    l.BuildingName && l.BuildingName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  )
  return match?.BuildingName || null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityName = cityMap[params.city]
  if (!cityName) return { title: 'Not Found' }

  const { listings } = await searchListings({ city: cityName, limit: 200 })
  const buildingName = slugToBuilding(params.building, listings)
  if (!buildingName) return { title: 'Not Found' }

  return {
    title: `${buildingName} Condos for Sale | ${cityName} | Miami Residence`,
    description: `View all available condos for sale at ${buildingName} in ${cityName}, FL. Photos, floor plans, prices, and amenities. Updated daily.`,
    alternates: { canonical: `/condos/${params.city}/${params.building}` },
  }
}

export default async function BuildingPage({ params }: Props) {
  const cityName = cityMap[params.city]
  if (!cityName) notFound()

  const { listings: allListings } = await searchListings({ city: cityName, limit: 200 })
  const buildingName = slugToBuilding(params.building, allListings)
  if (!buildingName) notFound()

  const listings = allListings.filter(l => l.BuildingName === buildingName)
    .sort((a, b) => a.ListPrice - b.ListPrice)

  const avgPrice = listings.length > 0
    ? Math.round(listings.reduce((s, l) => s + l.ListPrice, 0) / listings.length)
    : 0
  const avgSqft = listings.length > 0
    ? Math.round(listings.reduce((s, l) => s + l.LivingArea, 0) / listings.length)
    : 0

  // Schema.org for the building
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: buildingName,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    numberOfAvailableAccommodation: listings.length,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted mb-4">
            <a href="/" className="hover:text-black">🏠 Home</a>
            <span className="mx-1">/</span>
            <a href="/condos" className="hover:text-black">Condos</a>
            <span className="mx-1">/</span>
            <a href={`/condos/${params.city}`} className="hover:text-black">{cityName}</a>
            <span className="mx-1">/</span>
            <span className="text-black">{buildingName}</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">🏢 {buildingName}</h1>
          <p className="text-sm text-muted mb-6">📍 {cityName}, Florida</p>

          {/* Building Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-light border border-border mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold">{listings.length}</p>
              <p className="text-xs text-muted">Units for Sale</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{avgPrice > 0 ? formatListPrice(avgPrice) : 'N/A'}</p>
              <p className="text-xs text-muted">Avg. Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{avgSqft > 0 ? avgSqft.toLocaleString() : 'N/A'}</p>
              <p className="text-xs text-muted">Avg. Sq Ft</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{listings.length > 0 ? formatListPrice(Math.min(...listings.map(l => l.ListPrice))) : 'N/A'}</p>
              <p className="text-xs text-muted">Starting Price</p>
            </div>
          </div>

          {/* Listings */}
          <h2 className="text-lg font-bold mb-4">Available Units at {buildingName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.map(listing => {
              const photo = getPrimaryPhoto(listing)
              return (
                <a key={listing.ListingKey} href={`/property/${listing.ListingKey}`} className="border border-border bg-white group block">
                  <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                    {photo ? (
                      <img src={photo} alt={`${buildingName} #${listing.UnitNumber}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted text-sm">📷</div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-medium">Unit #{listing.UnitNumber}</p>
                        <p className="text-xs text-muted">{listing.LivingArea.toLocaleString()} ft² ({sqftToM2(listing.LivingArea)} m²)</p>
                      </div>
                      <p className="text-sm font-bold">{formatListPrice(listing.ListPrice)}</p>
                    </div>
                    <div className="flex gap-3 text-xs text-muted">
                      <span>🛏️ {listing.BedroomsTotal} Beds</span>
                      <span>🚿 {listing.BathroomsTotalInteger} Baths</span>
                      <span className={`px-1.5 py-0.5 text-[10px] ${listing.StandardStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {listing.StandardStatus}
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {listings.length === 0 && (
            <p className="text-center text-muted py-12">No units currently available at {buildingName}.</p>
          )}

          {/* SEO */}
          <div className="mt-12 max-w-3xl">
            <h2 className="text-lg font-bold mb-3">About {buildingName}</h2>
            <p className="text-sm text-accent leading-relaxed">
              {buildingName} is a premier condominium in {cityName}, Florida. Currently there are {listings.length} unit{listings.length !== 1 ? 's' : ''} available for sale
              {listings.length > 0 ? `, with prices starting at ${formatListPrice(Math.min(...listings.map(l => l.ListPrice)))}` : ''}.
              Contact Miami Residence Realty for private showings and detailed information about {buildingName} amenities, floor plans, and availability.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
