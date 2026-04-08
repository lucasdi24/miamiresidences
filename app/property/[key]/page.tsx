import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import FavoriteButton from '@/components/FavoriteButton'
import { getListing, formatAddress, formatListPrice, getPrimaryPhoto, sqftToM2 } from '@/lib/bridge'
import { BridgeListing } from '@/lib/types'

type Props = { params: { key: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListing(params.key)
  if (!listing) return { title: 'Listing Not Found' }

  const price = formatListPrice(listing.ListPrice)
  const address = formatAddress(listing)
  const title = listing.BuildingName
    ? `${listing.BuildingName} #${listing.UnitNumber} | ${price} | ${listing.City} ${listing.PropertySubType}`
    : `${address} | ${price} | ${listing.City} Real Estate`
  const description = listing.PublicRemarks.slice(0, 160)
  const image = getPrimaryPhoto(listing)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image, width: 800, height: 600 }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `/property/${params.key}`,
    },
  }
}

function JsonLd({ listing }: { listing: BridgeListing }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.BuildingName
      ? `${listing.BuildingName} #${listing.UnitNumber}`
      : formatAddress(listing),
    description: listing.PublicRemarks,
    url: `/property/${listing.ListingKey}`,
    datePosted: listing.OnMarketDate,
    image: listing.Media.map(m => m.MediaURL),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${listing.StreetNumber} ${listing.StreetName}${listing.UnitNumber ? ` #${listing.UnitNumber}` : ''}`,
      addressLocality: listing.City,
      addressRegion: listing.StateOrProvince,
      postalCode: listing.PostalCode,
      addressCountry: listing.Country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: listing.Latitude,
      longitude: listing.Longitude,
    },
    offers: {
      '@type': 'Offer',
      price: listing.ListPrice,
      priceCurrency: 'USD',
      availability: listing.StandardStatus === 'Active'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
    numberOfRooms: listing.BedroomsTotal,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: listing.LivingArea,
      unitCode: 'FTK',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function PropertyPage({ params }: Props) {
  const listing = await getListing(params.key)
  if (!listing) notFound()

  const price = formatListPrice(listing.ListPrice)
  const address = formatAddress(listing)
  const primaryPhoto = getPrimaryPhoto(listing)
  const allPhotos = listing.Media.sort((a, b) => a.Order - b.Order)
  const propertyTitle = listing.BuildingName ? `${listing.BuildingName} #${listing.UnitNumber}` : address

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd listing={listing} />
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted mb-4 flex items-center gap-1 flex-wrap">
            <a href="/" className="hover:text-black">🏠 Home</a>
            <span>/</span>
            <a href={listing.PropertySubType === 'Single Family Residence' ? '/homes' : '/condos'} className="hover:text-black">
              {listing.PropertySubType === 'Single Family Residence' ? 'Homes' : 'Condos'}
            </a>
            <span>/</span>
            <a href={`/condos/${listing.City.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-black">{listing.City}</a>
            {listing.BuildingName && (
              <>
                <span>/</span>
                <a href={`/condos/${listing.City.toLowerCase().replace(/\s+/g, '-')}/${listing.BuildingName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="hover:text-black">
                  {listing.BuildingName}
                </a>
              </>
            )}
            <span>/</span>
            <span className="text-black">{listing.UnitNumber ? `#${listing.UnitNumber}` : listing.ListingId}</span>
          </nav>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6 relative">
            <div className="absolute top-3 right-3 z-10">
              <FavoriteButton listingId={listing.ListingKey} className="bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow-md text-lg" />
            </div>
            <div className="md:col-span-2 aspect-[16/10] bg-gray-200 overflow-hidden">
              {primaryPhoto ? (
                <img src={primaryPhoto} alt={listing.BuildingName || address} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">📷 No Image</div>
              )}
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2">
              {allPhotos.slice(1, 3).map((m, i) => (
                <div key={i} className="aspect-[16/10] bg-gray-200 overflow-hidden">
                  <img src={m.MediaURL} alt={m.ShortDescription} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          {allPhotos.length > 3 && (
            <p className="text-xs text-muted mb-6">📸 {allPhotos.length} photos total</p>
          )}

          {/* Title + Price */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{propertyTitle}</h1>
              <p className="text-sm text-muted mt-1">📍 {address}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${listing.StandardStatus === 'Active' ? 'bg-green-100 text-green-800' : listing.StandardStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                  {listing.StandardStatus}
                </span>
                <span className="text-xs text-muted">{listing.PropertySubType}</span>
                <span className="text-xs text-muted">· MLS# {listing.ListingId}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{price}</p>
              {listing.OriginalListPrice !== listing.ListPrice && (
                <p className="text-sm text-muted line-through">{formatListPrice(listing.OriginalListPrice)}</p>
              )}
              <p className="text-xs text-muted">${Math.round(listing.ListPrice / listing.LivingArea).toLocaleString()}/ft²</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Details */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-light border border-border mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{listing.BedroomsTotal}</p>
                  <p className="text-xs text-muted">🛏️ Bedrooms</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{listing.BathroomsTotalInteger}</p>
                  <p className="text-xs text-muted">🚿 Bathrooms</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{listing.LivingArea.toLocaleString()}</p>
                  <p className="text-xs text-muted">📐 Sq Ft</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{listing.YearBuilt}</p>
                  <p className="text-xs text-muted">🏗️ Year Built</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">📋 Description</h2>
                <p className="text-sm text-accent leading-relaxed">{listing.PublicRemarks}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold mb-3">🏠 Property Details</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  {[
                    ['Property Type', listing.PropertySubType],
                    ['Living Area', `${listing.LivingArea.toLocaleString()} ft² (${sqftToM2(listing.LivingArea)} m²)`],
                    ['Bedrooms', listing.BedroomsTotal],
                    ['Full Baths', listing.BathroomsFull],
                    ['Half Baths', listing.BathroomsHalf],
                    ['Year Built', listing.YearBuilt],
                    ['Parking', `${listing.ParkingTotal} spaces`],
                    ['Garage', listing.GarageSpaces],
                    ['Days on Market', listing.DaysOnMarket],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex justify-between border-b border-border py-1.5">
                      <span className="text-muted">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                  {listing.LotSizeArea > 0 && (
                    <div className="flex justify-between border-b border-border py-1.5">
                      <span className="text-muted">Lot Size</span>
                      <span className="font-medium">{listing.LotSizeArea.toLocaleString()} ft²</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold mb-3">✨ Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {listing.View.length > 0 && (
                    <div><h3 className="font-medium mb-1">👀 Views</h3><p className="text-muted">{listing.View.join(', ')}</p></div>
                  )}
                  {listing.InteriorFeatures.length > 0 && (
                    <div><h3 className="font-medium mb-1">🏠 Interior</h3><p className="text-muted">{listing.InteriorFeatures.join(', ')}</p></div>
                  )}
                  {listing.ExteriorFeatures.length > 0 && (
                    <div><h3 className="font-medium mb-1">🌴 Exterior</h3><p className="text-muted">{listing.ExteriorFeatures.join(', ')}</p></div>
                  )}
                  {listing.CommunityFeatures.length > 0 && (
                    <div><h3 className="font-medium mb-1">🏊 Amenities</h3><p className="text-muted">{listing.CommunityFeatures.join(', ')}</p></div>
                  )}
                  {listing.Appliances.length > 0 && (
                    <div><h3 className="font-medium mb-1">🍳 Appliances</h3><p className="text-muted">{listing.Appliances.join(', ')}</p></div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-bold mb-3">💰 Financial Details</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  {listing.AssociationFee > 0 && (
                    <div className="flex justify-between border-b border-border py-1.5">
                      <span className="text-muted">HOA Fee</span>
                      <span className="font-medium">${listing.AssociationFee.toLocaleString()}/{listing.AssociationFeeFrequency.toLowerCase()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-border py-1.5">
                    <span className="text-muted">Annual Tax</span>
                    <span className="font-medium">${listing.TaxAnnualAmount.toLocaleString()} ({listing.TaxYear})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Card */}
            <div className="lg:w-80 shrink-0">
              <div className="sticky top-28 bg-light border border-border p-6">
                <h3 className="font-bold mb-4">📞 Contact Agent</h3>
                <div className="mb-4 text-sm">
                  <p className="font-medium">{listing.ListAgentFullName}</p>
                  <p className="text-muted">{listing.ListOfficeName}</p>
                  <p className="text-muted">{listing.ListAgentDirectPhone}</p>
                  <p className="text-muted">{listing.ListAgentEmail}</p>
                </div>
                <ContactForm subject={propertyTitle} compact />
                <p className="text-[10px] text-muted mt-3 text-center">By submitting, you agree to our Terms of Service</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
