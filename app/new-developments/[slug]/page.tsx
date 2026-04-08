import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import ContactForm from '@/components/ContactForm'
import { getAllDevelopments, getDevelopmentBySlug, formatPrice, DevelopmentDetail } from '@/lib/developments'
import { sqftToM2 } from '@/lib/bridge'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dev = await getDevelopmentBySlug(params.slug)
  if (!dev) return { title: 'Not Found' }

  return {
    title: `${dev.name} | Prices, Floor Plans & Availability`,
    description: `${dev.name} ${dev.neighborhood} - ${dev.floors}-story, ${dev.units}-unit luxury tower by ${dev.developer}. Prices from ${formatPrice(dev.startingPrice)}. Floor plans, amenities, photos & availability.`,
    keywords: [
      dev.name,
      `${dev.name} for sale`,
      `${dev.name} prices`,
      `${dev.name} floor plans`,
      `${dev.name} ${dev.neighborhood}`,
      `${dev.name} ${dev.city}`,
      `${dev.developer} Miami`,
      `new condos ${dev.neighborhood}`,
      `pre-construction ${dev.city}`,
    ],
    alternates: { canonical: `/new-developments/${dev.slug}` },
    openGraph: {
      title: `${dev.name} | ${dev.neighborhood} New Development`,
      description: `${dev.floors}-story luxury tower with ${dev.units} residences. Starting at ${formatPrice(dev.startingPrice)}. By ${dev.developer}.`,
      images: [{ url: dev.heroImage, width: 1600, height: 900, alt: dev.name }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dev.name} | Prices from ${formatPrice(dev.startingPrice)}`,
      description: `${dev.floors}-story luxury tower in ${dev.neighborhood} by ${dev.developer}.`,
      images: [dev.heroImage],
    },
  }
}

export async function generateStaticParams() {
  const developments = await getAllDevelopments()
  return developments.map(d => ({ slug: d.slug }))
}

function DevelopmentJsonLd({ dev }: { dev: DevelopmentDetail }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: dev.name,
    description: dev.description,
    url: `https://miamiresidence.com/new-developments/${dev.slug}`,
    image: dev.heroImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: dev.address.split(',')[0],
      addressLocality: dev.city,
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: dev.lat,
      longitude: dev.lng,
    },
    numberOfRooms: dev.units,
    floorSize: {
      '@type': 'QuantitativeValue',
      minValue: dev.residenceSizes.min,
      maxValue: dev.residenceSizes.max,
      unitCode: 'FTK',
    },
    amenityFeature: dev.buildingAmenities.map(a => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the prices at ${dev.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Prices at ${dev.name} start from ${formatPrice(dev.startingPrice)} (${formatPrice(dev.pricePerSqFt)}/SF). Residences range from ${dev.residenceSizes.min.toLocaleString()} to ${dev.residenceSizes.max.toLocaleString()} square feet.`,
        },
      },
      {
        '@type': 'Question',
        name: `When will ${dev.name} be completed?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${dev.name} is expected to be delivered in ${dev.delivery}. The ${dev.floors}-story tower features ${dev.units} residences.`,
        },
      },
      {
        '@type': 'Question',
        name: `Who is the developer of ${dev.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${dev.name} is developed by ${dev.developer}, designed by ${dev.architect}, with interiors by ${dev.interiorDesigner}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What amenities does ${dev.name} offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${dev.name} offers ${dev.buildingAmenities.length} world-class amenities including: ${dev.buildingAmenities.slice(0, 6).join(', ')}, and more.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

export default async function DevelopmentPage({ params }: Props) {
  const dev = await getDevelopmentBySlug(params.slug)
  if (!dev) notFound()

  const allDevs = await getAllDevelopments()
  const similarDevs = allDevs
    .filter(d => d.id !== dev.id)
    .sort((a, b) => {
      // Prioritize same neighborhood, then similar price
      if (a.neighborhood === dev.neighborhood && b.neighborhood !== dev.neighborhood) return -1
      if (b.neighborhood === dev.neighborhood && a.neighborhood !== dev.neighborhood) return 1
      return Math.abs(a.startingPrice - dev.startingPrice) - Math.abs(b.startingPrice - dev.startingPrice)
    })
    .slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <DevelopmentJsonLd dev={dev} />
      <Header />

      {/* Hero Banner - Full Width */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
        <img
          src={dev.heroImage}
          alt={dev.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-2">New Development</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{dev.name}</h1>
          <p className="text-white/80 text-lg md:text-xl">{dev.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/70">
            <span>📍 {dev.address}</span>
            <span>|</span>
            <span>📞 +1 (305) 751-1000</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 min-w-0">

            {/* Quick Stats Bar */}
            <div className="border-b border-border bg-light">
              <div className="px-4 py-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Floors</p>
                  <p className="text-xl font-bold">{dev.floors}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Residences</p>
                  <p className="text-xl font-bold">{dev.units}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Starting Price</p>
                  <p className="text-xl font-bold">{formatPrice(dev.startingPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Price / SF</p>
                  <p className="text-xl font-bold">{formatPrice(dev.pricePerSqFt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Delivery</p>
                  <p className="text-xl font-bold">{dev.delivery}</p>
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="px-4 py-4">
              <nav className="text-xs text-muted">
                <a href="/" className="hover:text-black">🏠 Home</a>
                <span className="mx-1">/</span>
                <a href="/new-developments" className="hover:text-black">New Developments</a>
                <span className="mx-1">/</span>
                <span className="text-black">{dev.name}</span>
              </nav>
            </div>

            {/* Main Content */}
            <div className="px-4 pb-12">

              {/* About Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">About {dev.name}</h2>
                <p className="text-sm text-accent leading-relaxed mb-4">{dev.description}</p>
                {dev.longDescription.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-sm text-accent leading-relaxed mb-4">{paragraph}</p>
                ))}
              </section>

              {/* Key Info Grid */}
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">📋 Building Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-border p-4">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Developer</td>
                          <td className="py-2 font-medium text-right">{dev.developer}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Architect</td>
                          <td className="py-2 font-medium text-right">{dev.architect}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Interior Design</td>
                          <td className="py-2 font-medium text-right">{dev.interiorDesigner}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Location</td>
                          <td className="py-2 font-medium text-right">{dev.neighborhood}, {dev.city}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted">Expected Delivery</td>
                          <td className="py-2 font-medium text-right">{dev.delivery}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="border border-border p-4">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Total Floors</td>
                          <td className="py-2 font-medium text-right">{dev.floors}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Total Residences</td>
                          <td className="py-2 font-medium text-right">{dev.units}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Bedrooms</td>
                          <td className="py-2 font-medium text-right">{dev.bedrooms.min} - {dev.bedrooms.max}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted">Residence Sizes</td>
                          <td className="py-2 font-medium text-right">{dev.residenceSizes.min.toLocaleString()} - {dev.residenceSizes.max.toLocaleString()} ft²</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted">Residence Sizes (m²)</td>
                          <td className="py-2 font-medium text-right">{sqftToM2(dev.residenceSizes.min)} - {sqftToM2(dev.residenceSizes.max)} m²</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Photo Gallery */}
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">📸 Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dev.gallery.map((img, i) => (
                    <div key={i} className="aspect-[4/3] bg-gray-200 overflow-hidden">
                      <img
                        src={img}
                        alt={`${dev.name} - Photo ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Amenities */}
              <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-xl font-bold mb-4">🏢 Building Amenities</h2>
                    <ul className="space-y-2">
                      {dev.buildingAmenities.map((amenity, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-black mt-0.5">✓</span>
                          <span>{amenity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4">🏠 Residence Features</h2>
                    <ul className="space-y-2">
                      {dev.residenceFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-black mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Floor Plans */}
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">📐 Floor Plans & Pricing</h2>
                <div className="border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="py-3 px-4 text-left font-medium">Model</th>
                        <th className="py-3 px-4 text-center font-medium">Beds</th>
                        <th className="py-3 px-4 text-center font-medium">Baths</th>
                        <th className="py-3 px-4 text-right font-medium">Size (ft²)</th>
                        <th className="py-3 px-4 text-right font-medium">Size (m²)</th>
                        <th className="py-3 px-4 text-right font-medium">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dev.floorPlans.map((plan, i) => (
                        <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-white' : 'bg-light'}`}>
                          <td className="py-3 px-4 font-medium">{plan.name}</td>
                          <td className="py-3 px-4 text-center">{plan.beds}</td>
                          <td className="py-3 px-4 text-center">{plan.baths}</td>
                          <td className="py-3 px-4 text-right">{plan.sqft.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">{sqftToM2(plan.sqft)}</td>
                          <td className="py-3 px-4 text-right font-bold">{plan.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted mt-2">* Prices are subject to change. Contact us for the latest availability and pricing.</p>
              </section>

              {/* Location / Map */}
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">📍 Location</h2>
                <div className="border border-border overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(dev.address)}&zoom=15`}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${dev.name} Location Map`}
                  />
                </div>
                <p className="text-sm text-muted mt-2">{dev.address}</p>
              </section>

              {/* Developer Info */}
              <section className="mb-12 bg-light border border-border p-6">
                <h2 className="text-xl font-bold mb-3">🏗️ About the Developer</h2>
                <p className="text-sm text-accent leading-relaxed mb-3">
                  <strong>{dev.developer}</strong> is the visionary developer behind {dev.name}. Working alongside acclaimed architect <strong>{dev.architect}</strong> and interior designer <strong>{dev.interiorDesigner}</strong>, they have created a landmark development that redefines luxury living in {dev.neighborhood}.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="px-3 py-1.5 bg-white border border-border text-xs font-medium">Developer: {dev.developer}</span>
                  <span className="px-3 py-1.5 bg-white border border-border text-xs font-medium">Architect: {dev.architect}</span>
                  <span className="px-3 py-1.5 bg-white border border-border text-xs font-medium">Interior: {dev.interiorDesigner}</span>
                </div>
              </section>

              {/* Contact / CTA Form */}
              <section className="mb-12 border-2 border-black p-6 md:p-8">
                <div className="max-w-xl mx-auto text-center">
                  <h2 className="text-2xl font-bold mb-2">Interested in {dev.name}?</h2>
                  <p className="text-sm text-muted mb-6">Get exclusive pricing, floor plans, and schedule a private showing.</p>
                  <ContactForm subject={dev.name} />
                  <p className="text-[10px] text-muted mt-3">
                    By submitting, you agree to receive communications about {dev.name}. We respect your privacy.
                  </p>
                </div>
              </section>

              {/* Similar Developments */}
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">🏗️ Similar Developments</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {similarDevs.map(similar => (
                    <a
                      key={similar.id}
                      href={`/new-developments/${similar.slug}`}
                      className="border border-border bg-white group block hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[16/9] bg-gray-200 overflow-hidden">
                        <img
                          src={similar.heroImage}
                          alt={similar.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold">{similar.name}</p>
                        <p className="text-xs text-muted">{similar.neighborhood}</p>
                        <p className="text-xs font-medium mt-1">From {formatPrice(similar.startingPrice)}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>

              {/* FAQ Section (for SEO) */}
              <section className="mb-12">
                <h2 className="text-xl font-bold mb-4">❓ Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <details className="border border-border p-4 group">
                    <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                      What are the prices at {dev.name}?
                      <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-sm text-accent mt-3 leading-relaxed">
                      Prices at {dev.name} start from {formatPrice(dev.startingPrice)}, with a price per square foot of {formatPrice(dev.pricePerSqFt)}/SF. Residences range from {dev.residenceSizes.min.toLocaleString()} to {dev.residenceSizes.max.toLocaleString()} square feet ({sqftToM2(dev.residenceSizes.min)} to {sqftToM2(dev.residenceSizes.max)} m²), with {dev.bedrooms.min} to {dev.bedrooms.max} bedrooms.
                    </p>
                  </details>
                  <details className="border border-border p-4 group">
                    <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                      When will {dev.name} be completed?
                      <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-sm text-accent mt-3 leading-relaxed">
                      {dev.name} is expected to be delivered in {dev.delivery}. The {dev.floors}-story tower features {dev.units} luxury residences in {dev.neighborhood}, {dev.city}.
                    </p>
                  </details>
                  <details className="border border-border p-4 group">
                    <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                      Who is the developer of {dev.name}?
                      <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-sm text-accent mt-3 leading-relaxed">
                      {dev.name} is developed by {dev.developer}. The building is designed by {dev.architect} with interiors by {dev.interiorDesigner}.
                    </p>
                  </details>
                  <details className="border border-border p-4 group">
                    <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                      What amenities does {dev.name} offer?
                      <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-sm text-accent mt-3 leading-relaxed">
                      {dev.name} offers {dev.buildingAmenities.length} world-class amenities including: {dev.buildingAmenities.join(', ')}.
                    </p>
                  </details>
                  <details className="border border-border p-4 group">
                    <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                      What floor plans are available at {dev.name}?
                      <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-sm text-accent mt-3 leading-relaxed">
                      {dev.name} offers {dev.floorPlans.length} floor plan options: {dev.floorPlans.map(p => `${p.name} (${p.beds} bed/${p.baths} bath, ${p.sqft.toLocaleString()} SF, from ${p.price})`).join('; ')}. Contact us for detailed floor plans and availability.
                    </p>
                  </details>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
