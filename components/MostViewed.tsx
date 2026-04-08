import ListingsGrid from './ListingsGrid'
import { searchListings, getPrimaryPhoto, formatListPrice } from '@/lib/bridge'

export default async function MostViewed() {
  const { listings } = await searchListings({ sort: 'price-desc', limit: 6 })

  const listingData = listings.map(l => ({
    listingKey: l.ListingKey,
    photo: getPrimaryPhoto(l),
    name: l.BuildingName || `${l.StreetNumber} ${l.StreetName}`,
    subtitle: `${l.City}, FL`,
    price: formatListPrice(l.ListPrice),
    beds: l.BedroomsTotal,
    baths: l.BathroomsTotalInteger,
    sqft: l.LivingArea,
    href: `/property/${l.ListingKey}`,
  }))

  return (
    <section className="py-12 px-4 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-6">🔥 Most Viewed Properties</h2>
        <ListingsGrid listings={listingData} total={listingData.length} initialVisible={6} />
        <div className="text-center mt-6">
          <a href="/condos" className="btn-outline text-sm inline-block">View All Properties →</a>
        </div>
      </div>
    </section>
  )
}
