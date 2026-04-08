import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import { getAllDevelopments, formatPrice } from '@/lib/developments'

export const metadata: Metadata = {
  title: 'New Developments Miami | Pre-Construction Condos for Sale',
  description: 'Explore 15+ new luxury condo developments in Miami. Pre-construction pricing, floor plans, amenities, and availability for Brickell, Sunny Isles, Bal Harbour, and more.',
  alternates: { canonical: '/new-developments' },
  openGraph: {
    title: 'New Developments Miami | Pre-Construction Condos',
    description: 'Explore 15+ new luxury condo developments in Miami. Pre-construction pricing and floor plans.',
  },
}

export default async function NewDevelopmentsPage() {
  const developments = await getAllDevelopments()

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'New Condo Developments in Miami',
        description: `${developments.length} new luxury condominium developments in Miami, Florida`,
        numberOfItems: developments.length,
        itemListElement: developments.map((d, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://miamiresidence.com/new-developments/${d.slug}`,
          name: d.name,
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
              <span className="text-black">New Developments</span>
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">🏗️ New Developments in Miami</h1>
            <p className="text-sm text-accent mb-8 max-w-2xl">
              Discover {developments.length} luxury pre-construction condominium projects across Miami&apos;s most coveted neighborhoods. From branded residences to waterfront towers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developments.map(dev => (
                <a
                  key={dev.id}
                  href={`/new-developments/${dev.slug}`}
                  className="group border border-border bg-white block hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[16/9] bg-gray-200 overflow-hidden relative">
                    <img
                      src={dev.heroImage}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h2 className="text-white font-bold text-lg">{dev.name}</h2>
                      <p className="text-white/80 text-xs">{dev.tagline}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-4 text-xs text-muted mb-3">
                      <span>📍 {dev.neighborhood}</span>
                      <span>🏢 {dev.floors} Floors</span>
                      <span>🏠 {dev.units} Units</span>
                      <span>📅 Delivery {dev.delivery}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted">Starting from</p>
                        <p className="text-lg font-bold">{formatPrice(dev.startingPrice)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted">Price per SF</p>
                        <p className="text-sm font-medium">{formatPrice(dev.pricePerSqFt)}/ft²</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <span className="px-2 py-1 bg-light border border-border text-[10px] font-medium">{dev.developer}</span>
                      <span className="px-2 py-1 bg-light border border-border text-[10px] font-medium">{dev.architect}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-12 max-w-3xl">
              <h2 className="text-lg font-bold mb-3">About Miami New Developments</h2>
              <p className="text-sm text-accent leading-relaxed mb-3">
                Miami is experiencing an unprecedented wave of luxury development, with world-renowned brands like Bentley, Dolce &amp; Gabbana, Mercedes-Benz, and Waldorf Astoria all launching branded residential towers. These developments represent the future of luxury living in South Florida.
              </p>
              <p className="text-sm text-accent leading-relaxed">
                Pre-construction purchases offer significant advantages: lower entry prices, flexible payment plans (typically 50% during construction, 50% at closing), and the ability to customize finishes. Contact us for exclusive pricing, floor plans, and private showings.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
