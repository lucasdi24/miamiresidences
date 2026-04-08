import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import ListingsGrid from '@/components/ListingsGrid'
import { searchListings, formatListPrice, getPrimaryPhoto, formatAddress } from '@/lib/bridge'

type Props = { params: { city: string } }

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityName = cityMap[params.city]
  if (!cityName) return { title: 'Not Found' }
  return {
    title: `${cityName} Condos for Sale | Luxury Condominiums`,
    description: `Browse luxury condos for sale in ${cityName}, FL. View photos, prices, floor plans, and details for condominiums. Updated daily.`,
    alternates: { canonical: `/condos/${params.city}` },
  }
}

export async function generateStaticParams() {
  return Object.keys(cityMap).map(city => ({ city }))
}

export default async function CityCondosPage({ params }: Props) {
  const cityName = cityMap[params.city]
  if (!cityName) notFound()

  const { listings, total } = await searchListings({
    city: cityName,
    propertySubType: 'Condominium',
    sort: 'newest',
    limit: 100,
  })

  const buildings = Array.from(new Set(listings.filter(l => l.BuildingName).map(l => l.BuildingName!))).sort()

  const listingData = listings.map(l => ({
    listingKey: l.ListingKey,
    photo: getPrimaryPhoto(l),
    name: `${l.BuildingName || l.StreetName}${l.UnitNumber ? ` #${l.UnitNumber}` : ''}`,
    subtitle: `${l.City}, FL`,
    price: formatListPrice(l.ListPrice),
    beds: l.BedroomsTotal,
    baths: l.BathroomsTotalInteger,
    sqft: l.LivingArea,
    href: `/property/${l.ListingKey}`,
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${cityName} Condos for Sale`,
        description: `${total} luxury condominiums for sale in ${cityName}, Florida`,
        numberOfItems: total,
        itemListElement: listings.slice(0, 10).map((l, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://miamiresidence.com/property/${l.ListingKey}`,
          name: l.BuildingName ? `${l.BuildingName} #${l.UnitNumber}` : formatAddress(l),
        })),
      }) }} />
      <Header />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 min-w-0 px-4 py-8">
            <nav className="text-xs text-muted mb-4">
              <a href="/" className="hover:text-black">🏠 Home</a>
              <span className="mx-1">/</span>
              <a href="/condos" className="hover:text-black">Condos</a>
              <span className="mx-1">/</span>
              <span className="text-black">{cityName}</span>
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">🏙️ {cityName} Condos for Sale</h1>
            <p className="text-sm text-accent mb-6">
              {total} luxury condominiums available in {cityName}, Florida.
            </p>

            {buildings.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold mb-2">🏢 Buildings in {cityName}</h2>
                <div className="flex flex-wrap gap-2">
                  {buildings.map(b => (
                    <a
                      key={b}
                      href={`/condos/${params.city}/${b!.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                      className="px-3 py-1.5 bg-light border border-border text-xs font-medium hover:bg-black hover:text-white transition-colors"
                    >
                      {b}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-sm text-muted mb-4">{total} results</p>

            <ListingsGrid
              listings={listingData}
              total={total}
              initialVisible={24}
              loadMoreIncrement={12}
            />

            {listings.length === 0 && (
              <p className="text-center text-muted py-12">No condos found in {cityName}.</p>
            )}

            <div className="mt-12 max-w-3xl">
              <h2 className="text-lg font-bold mb-3">About {cityName} Condominiums</h2>
              <p className="text-sm text-accent leading-relaxed">
                {cityName} is one of South Florida&apos;s most sought-after locations for luxury condominium living. With {buildings.length} premier buildings to choose from and prices ranging from {listings.length > 0 ? formatListPrice(Math.min(...listings.map(l => l.ListPrice))) : 'N/A'} to {listings.length > 0 ? formatListPrice(Math.max(...listings.map(l => l.ListPrice))) : 'N/A'}, there&apos;s a perfect home for every lifestyle. Browse our complete selection of {cityName} condos updated daily from the MLS.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
