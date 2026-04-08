import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import ListingsGrid from '@/components/ListingsGrid'
import { searchListings, formatListPrice, getPrimaryPhoto, formatAddress } from '@/lib/bridge'

export const metadata: Metadata = {
  title: 'Miami Homes for Sale | Single Family Houses',
  description: 'Browse luxury single family homes for sale in Miami. Waterfront estates in Coral Gables, Coconut Grove, Key Biscayne, and more. Updated daily from the MLS.',
  alternates: { canonical: '/homes' },
}

export default async function HomesPage() {
  const { listings, total } = await searchListings({
    propertySubType: 'Single Family Residence',
    sort: 'newest',
    limit: 100,
  })

  const cities = Array.from(new Set(listings.map(l => l.City))).sort()

  const listingData = listings.map(l => ({
    listingKey: l.ListingKey,
    photo: getPrimaryPhoto(l),
    name: `${l.StreetNumber} ${l.StreetName}`,
    subtitle: `${l.City}, FL ${l.PostalCode}`,
    price: formatListPrice(l.ListPrice),
    beds: l.BedroomsTotal,
    baths: l.BathroomsTotalInteger,
    sqft: l.LivingArea,
    lotSize: l.LotSizeArea,
    href: `/property/${l.ListingKey}`,
  }))

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Miami Homes for Sale',
        description: `${total} single family homes for sale in Miami, Florida`,
        numberOfItems: total,
        itemListElement: listings.slice(0, 10).map((l, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://miamiresidence.com/property/${l.ListingKey}`,
          name: `${l.StreetNumber} ${l.StreetName}, ${l.City}`,
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
              <span className="text-black">Homes for Sale</span>
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">🏡 Miami Homes for Sale</h1>
            <p className="text-sm text-accent mb-6 max-w-2xl">
              Discover {total} luxury single family homes for sale in Miami-Dade County. Waterfront estates, gated communities, and family-friendly neighborhoods.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {cities.map(city => (
                <span key={city} className="px-3 py-1.5 bg-light border border-border text-xs font-medium">{city}</span>
              ))}
            </div>

            <p className="text-sm text-muted mb-4">{total} homes available</p>

            <ListingsGrid
              listings={listingData}
              total={total}
              initialVisible={24}
              loadMoreIncrement={12}
            />

            <div className="mt-12 max-w-3xl">
              <h2 className="text-lg font-bold mb-3">About Miami Single Family Homes</h2>
              <p className="text-sm text-accent leading-relaxed">
                Miami&apos;s single family home market offers everything from historic Coral Gables estates to modern waterfront mansions. Popular neighborhoods include Coconut Grove, Coral Gables, Key Biscayne, Pinecrest, and Miami Beach. Many homes feature private docks, pools, tropical gardens, and direct water access.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
