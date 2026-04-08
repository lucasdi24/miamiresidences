import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import ListingsGrid from '@/components/ListingsGrid'
import { searchListings, formatListPrice, getPrimaryPhoto } from '@/lib/bridge'

export const metadata: Metadata = {
  title: 'Miami Condos for Sale | Oceanfront Luxury Condominiums',
  description: 'Browse luxury condos for sale in Miami. Oceanfront condominiums in Brickell, South Beach, Sunny Isles Beach, Bal Harbour, and more. Updated daily with the latest MLS listings.',
  alternates: { canonical: '/condos' },
}

export default async function CondosPage() {
  const { listings, total } = await searchListings({
    propertySubType: 'Condominium',
    sort: 'newest',
    limit: 100,
  })

  const cities = Array.from(new Set(listings.map(l => l.City))).sort()

  const listingData = listings.map(l => ({
    listingKey: l.ListingKey,
    photo: getPrimaryPhoto(l),
    name: l.BuildingName || l.StreetName,
    subtitle: `${l.City}, FL ${l.PostalCode}`,
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
        name: 'Miami Condos for Sale',
        description: `${total} luxury condominiums for sale in Miami, Florida`,
        numberOfItems: total,
        itemListElement: listings.slice(0, 10).map((l, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://miamiresidence.com/property/${l.ListingKey}`,
          name: l.BuildingName ? `${l.BuildingName} #${l.UnitNumber}` : `${l.StreetNumber} ${l.StreetName}`,
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
              <span className="text-black">Condos for Sale</span>
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">🏙️ Miami Condos for Sale</h1>
            <p className="text-sm text-accent mb-6 max-w-2xl">
              Discover {total} luxury condominiums for sale across Miami&apos;s most prestigious neighborhoods. From oceanfront penthouses in South Beach to modern high-rises in Brickell.
            </p>

            {/* Quick City Links */}
            <div className="flex flex-wrap gap-2 mb-6">
              {cities.map(city => (
                <a
                  key={city}
                  href={`/condos/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-3 py-1.5 bg-light border border-border text-xs font-medium hover:bg-black hover:text-white transition-colors"
                >
                  {city}
                </a>
              ))}
            </div>

            <p className="text-sm text-muted mb-4">{total} condos available</p>

            <ListingsGrid
              listings={listingData}
              total={total}
              initialVisible={24}
              loadMoreIncrement={12}
            />

            <div className="mt-12 max-w-3xl">
              <h2 className="text-lg font-bold mb-3">About Miami Condos</h2>
              <p className="text-sm text-accent leading-relaxed mb-3">
                Miami&apos;s condominium market offers an unparalleled selection of luxury residences, from iconic oceanfront towers to sleek urban high-rises. Whether you&apos;re seeking a primary residence, a vacation home, or an investment property, Miami&apos;s condo market has something for every buyer.
              </p>
              <p className="text-sm text-accent leading-relaxed">
                Popular neighborhoods for condos include Brickell (Miami&apos;s financial district), South Beach (iconic Art Deco and luxury living), Sunny Isles Beach (oceanfront towers), and Bal Harbour (exclusive boutique buildings). Prices range from the mid-$300s for studio units to over $20 million for penthouses in the most exclusive buildings.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
