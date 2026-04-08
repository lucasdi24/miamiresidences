import { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

function HomeJsonLd() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Miami Residence Realty',
      url: 'https://miamiresidence.com',
      logo: 'https://miamiresidence.com/logo.png',
      description: 'Miami Beach oceanfront condos for sale and rent. Luxury real estate in Brickell, South Beach, Sunny Isles, and more.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '20900 NE 30th Ave. Suite 410',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        postalCode: '33180',
        addressCountry: 'US',
      },
      telephone: '+1-305-751-1000',
      areaServed: {
        '@type': 'City',
        name: 'Miami',
        '@id': 'https://www.wikidata.org/wiki/Q8652',
      },
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Miami Residence',
      url: 'https://miamiresidence.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://miamiresidence.com/condos?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ]
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  )
}
import HeroSearch from '@/components/HeroSearch'
import CategoryGrid from '@/components/CategoryGrid'
import FeaturedCarousel from '@/components/FeaturedCarousel'
import CondoEstimate from '@/components/CondoEstimate'
import VirtualTours from '@/components/VirtualTours'
import JustListed from '@/components/JustListed'
import MostExclusive from '@/components/MostExclusive'
import MostViewed from '@/components/MostViewed'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeJsonLd />
      <Header />

      {/* Two-column layout on desktop, single column on mobile */}
      <div className="flex-1 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto lg:flex lg:items-start">
          {/* Sidebar - desktop only */}
          <div className="hidden lg:block flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content - all sections */}
          <main className="w-full lg:flex-1 lg:min-w-0">
            <HeroSearch />
            <CategoryGrid />
            <FeaturedCarousel />
            <CondoEstimate />
            <VirtualTours />
            <JustListed />
            <MostExclusive />
            <MostViewed />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
