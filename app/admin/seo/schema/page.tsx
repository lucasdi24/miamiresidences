'use client'
import { useEffect, useState } from 'react'

interface SchemaPreview {
  page: string
  types: string[]
  preview: string
}

const schemaPages: SchemaPreview[] = [
  {
    page: '/ (Homepage)',
    types: ['WebSite', 'RealEstateAgent', 'ItemList'],
    preview: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Miami Residence',
      url: 'https://miamiresidence.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://miamiresidence.com/listings?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }, null, 2),
  },
  {
    page: '/condos',
    types: ['ItemList', 'RealEstateListing'],
    preview: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Miami Condos for Sale',
      numberOfItems: 65,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'RealEstateListing',
            name: 'Example Condo Listing',
            url: 'https://miamiresidence.com/property/example',
          },
        },
      ],
    }, null, 2),
  },
  {
    page: '/homes',
    types: ['ItemList', 'RealEstateListing'],
    preview: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Miami Homes for Sale',
      numberOfItems: 35,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'RealEstateListing',
            name: 'Example Home Listing',
            url: 'https://miamiresidence.com/property/example',
          },
        },
      ],
    }, null, 2),
  },
  {
    page: '/property/[key]',
    types: ['RealEstateListing', 'Residence', 'Place'],
    preview: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: 'Luxury Condo in Brickell',
      url: 'https://miamiresidence.com/property/123',
      description: 'Stunning 3-bedroom condo with ocean views',
      offers: {
        '@type': 'Offer',
        price: 1250000,
        priceCurrency: 'USD',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
      numberOfRooms: 3,
      floorSize: { '@type': 'QuantitativeValue', value: 1850, unitCode: 'FTK' },
    }, null, 2),
  },
  {
    page: '/new-developments/[slug]',
    types: ['Residence', 'Place', 'FAQPage'],
    preview: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Residence',
      name: 'Bentley Residences',
      url: 'https://miamiresidence.com/new-developments/bentley-residences',
      description: 'Ultra-luxury oceanfront tower',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '18401 Collins Avenue',
        addressLocality: 'Sunny Isles Beach',
        addressRegion: 'FL',
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Pool' },
        { '@type': 'LocationFeatureSpecification', name: 'Gym' },
      ],
    }, null, 2),
  },
  {
    page: '/listings (Search Results)',
    types: ['ItemList', 'SearchAction'],
    preview: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Search Results - Miami Properties',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: 100,
    }, null, 2),
  },
]

export default function SchemaPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [testUrl, setTestUrl] = useState('')

  const openGoogleTest = () => {
    const url = testUrl || 'https://miamiresidence.com'
    window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`, '_blank')
  }

  const openSchemaValidator = () => {
    const url = testUrl || 'https://miamiresidence.com'
    window.open(`https://validator.schema.org/#url=${encodeURIComponent(url)}`, '_blank')
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Schema.org Markup</h1>
      <p className="text-sm text-muted mb-6">View structured data (JSON-LD) applied to each page type</p>

      {/* Validation Tools */}
      <div className="bg-white border border-border rounded-sm mb-8">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">Validation Tools</h2>
        </div>
        <div className="p-5">
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <label className="text-xs font-medium text-muted block mb-1">URL to Test</label>
              <input
                type="text"
                value={testUrl}
                onChange={e => setTestUrl(e.target.value)}
                placeholder="https://miamiresidence.com"
                className="input-field"
              />
            </div>
            <button onClick={openGoogleTest} className="btn-primary text-sm rounded-sm whitespace-nowrap">
              Google Rich Results Test ↗
            </button>
            <button onClick={openSchemaValidator} className="text-sm border border-border px-4 py-2 rounded-sm hover:bg-light transition-colors whitespace-nowrap">
              Schema.org Validator ↗
            </button>
          </div>
        </div>
      </div>

      {/* Schema Types Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{schemaPages.length}</p>
          <p className="text-xs text-muted mt-1">Page Types</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{new Set(schemaPages.flatMap(s => s.types)).size}</p>
          <p className="text-xs text-muted mt-1">Schema Types</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold text-green-600">✓</p>
          <p className="text-xs text-muted mt-1">JSON-LD Format</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold text-green-600">✓</p>
          <p className="text-xs text-muted mt-1">SSR Rendered</p>
        </div>
      </div>

      {/* Schema Per Page */}
      <div className="bg-white border border-border rounded-sm">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">Structured Data by Page</h2>
        </div>
        <div className="divide-y divide-border">
          {schemaPages.map((schema) => (
            <div key={schema.page}>
              <div
                className="px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-light/50 transition-colors"
                onClick={() => setExpanded(expanded === schema.page ? null : schema.page)}
              >
                <div>
                  <code className="text-xs bg-light px-2 py-0.5 rounded-sm">{schema.page}</code>
                  <div className="flex gap-2 mt-2">
                    {schema.types.map(type => (
                      <span key={type} className="text-[10px] px-2 py-0.5 rounded-full bg-gold-light text-gold font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted">
                  {expanded === schema.page ? '▼' : '▶'}
                </span>
              </div>
              {expanded === schema.page && (
                <div className="px-5 pb-4">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto whitespace-pre font-mono max-h-[400px] overflow-y-auto">
                    {schema.preview}
                  </pre>
                  <p className="text-[10px] text-muted mt-2">
                    This schema is automatically generated server-side via generateMetadata() and embedded as JSON-LD in the page &lt;head&gt;.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white border border-border rounded-sm mt-8">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">Schema.org Best Practices</h2>
        </div>
        <div className="p-5">
          <ul className="space-y-3 text-sm">
            {[
              { check: true, text: 'Using JSON-LD format (recommended by Google)' },
              { check: true, text: 'Schema rendered server-side for crawler visibility' },
              { check: true, text: 'RealEstateListing type for property pages' },
              { check: true, text: 'Residence type for development pages' },
              { check: true, text: 'FAQPage schema on development detail pages' },
              { check: true, text: 'ItemList for collection pages (condos, homes, listings)' },
              { check: true, text: 'WebSite with SearchAction for sitelinks search box' },
              { check: false, text: 'BreadcrumbList schema (not yet implemented)' },
              { check: false, text: 'Review/AggregateRating schema (not yet implemented)' },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${item.check ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.check ? '✓' : '!'}
                </span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
