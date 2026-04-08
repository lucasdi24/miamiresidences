'use client'
import { useState } from 'react'

const sidebarData = {
  condos: {
    'Aventura': ['Admirals Port', 'Echo Aventura', 'Marina Palms', 'Porto Vita', 'Hidden Bay', 'Turnberry on the Green'],
    'Bal Harbour': ['Oceana Bal Harbour', 'Ritz Carlton', 'St Regis', 'Majestic Tower', 'Harbour House', 'Bellini'],
    'Brickell': ['Icon Brickell', 'Brickell City Centre', 'Four Seasons', 'Santa Maria', 'SLS Brickell', 'UNA Residences', 'Panorama Tower'],
    'Miami Beach': ['Faena House', 'Edition Residences', 'Bath Club', 'Mosaic', 'Fontainebleau Tresor', 'La Gorce Palace'],
    'South Beach': ['Continuum North', 'Continuum South', 'Apogee', 'Murano Grande', 'Setai', 'W South Beach', 'Icon South Beach'],
    'Sunny Isles Beach': ['Acqualina', 'Jade Beach', 'Jade Ocean', 'Porsche Design Tower', 'Regalia', 'Trump Towers', 'Turnberry Ocean Colony'],
    'Downtown Miami': ['Aston Martin Residences', 'One Thousand Museum', 'Paramount WorldCenter', 'Epic Residences', 'Marina Blue'],
    'Edgewater': ['Aria Reserve', 'Paraiso District', 'Missoni Baia', 'Elysee Miami', 'Biscayne Beach'],
    'Hollywood Beach': ['HYDE Beach', 'HYDE Beach House', 'Trump Hollywood', 'Diplomat Residences', 'Apogee Beach'],
    'Hallandale Beach': ['2000 Ocean', 'Beach Club', 'Duo Hallandale', 'Parker Plaza'],
  },
  homes: ['Aventura', 'Bal Harbour', 'Bay Harbor Islands', 'Coconut Grove', 'Coral Gables', 'Fort Lauderdale', 'Golden Beach', 'Hollywood', 'Key Biscayne', 'Miami Beach', 'Palmetto Bay', 'Pinecrest', 'Sunny Isles Beach', 'West Palm Beach'],
  developments: [
    { name: 'Rivage Bal Harbour', slug: 'rivage-bal-harbour' },
    { name: 'Dolce Gabbana Brickell', slug: 'dolce-gabbana-residences' },
    { name: 'Mercedes-Benz Places', slug: 'mercedes-benz-places' },
    { name: 'Waldorf Astoria Miami', slug: 'waldorf-astoria-miami' },
    { name: 'Cipriani Residences', slug: 'cipriani-residences-miami' },
    { name: 'Baccarat Residences', slug: 'baccarat-residences-miami' },
    { name: 'St Regis Miami', slug: 'st-regis-residences-miami' },
    { name: 'Aria Reserve', slug: 'aria-reserve' },
    { name: 'Mandarin Oriental', slug: 'mandarin-oriental-residences' },
    { name: 'E11EVEN Residences', slug: 'e11even-residences' },
    { name: 'Casa Bella Residences', slug: 'casa-bella-residences' },
    { name: 'Bentley Residences', slug: 'bentley-residences' },
    { name: 'Shell Bay Residences', slug: 'shell-bay-residences' },
    { name: 'Villa Miami', slug: 'villa-miami' },
    { name: 'Six Fisher Island', slug: 'six-fisher-island' },
  ],
  commercial: ['Business Opportunity', 'Commercial Income', 'Commercial Land', 'Hotels and Motels', 'Industrial', 'Office Space', 'Retail Space', 'Warehouse Space'],
}

type Section = 'condos' | 'homes' | 'developments' | 'commercial'

export default function Sidebar() {
  const [open, setOpen] = useState<Record<Section, boolean>>({ condos: true, homes: false, developments: true, commercial: false })
  const [expandedHood, setExpandedHood] = useState<string | null>(null)
  const toggle = (s: Section) => setOpen(p => ({ ...p, [s]: !p[s] }))

  const sectionStyle = "border-b border-border"
  const headerStyle = "w-full flex justify-between items-center py-3 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-light transition-colors"

  return (
    <aside className="w-full lg:w-56 shrink-0 text-sm border-r border-border bg-white pt-2">
      {/* Condominiums */}
      <div className={sectionStyle}>
        <button onClick={() => toggle('condos')} className={headerStyle}>
          <span>Condominiums</span>
          <svg className={`w-3 h-3 text-muted transition-transform ${open.condos ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open.condos && (
          <ul className="pb-2">
            {Object.entries(sidebarData.condos).map(([hood, buildings]) => (
              <li key={hood} className="px-2">
                <button onClick={() => setExpandedHood(expandedHood === hood ? null : hood)} className="w-full flex justify-between items-center py-1.5 text-xs hover:text-primary text-accent px-2 rounded transition-colors">
                  <span className="flex items-center gap-1.5">
                    <svg className={`w-2.5 h-2.5 text-muted transition-transform ${expandedHood === hood ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    {hood}
                  </span>
                  <span className="text-[10px] text-muted bg-light px-1.5 py-0.5 rounded-full">{buildings.length}</span>
                </button>
                {expandedHood === hood && (
                  <ul className="pl-5 pb-1">
                    {buildings.map(b => (
                      <li key={b}>
                        <a href={`/condos/${hood.toLowerCase().replace(/\s+/g, '-')}/${b.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="block py-1 text-[11px] text-muted hover:text-gold transition-colors">
                          {b}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Single Family Homes */}
      <div className={sectionStyle}>
        <button onClick={() => toggle('homes')} className={headerStyle}>
          <span>Single Family Homes</span>
          <svg className={`w-3 h-3 text-muted transition-transform ${open.homes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open.homes && (
          <ul className="pb-2 px-2">
            {sidebarData.homes.map(h => (
              <li key={h}><a href="/homes" className="block py-1.5 text-xs text-accent hover:text-gold px-2 rounded transition-colors">{h}</a></li>
            ))}
          </ul>
        )}
      </div>

      {/* New Developments */}
      <div className={sectionStyle}>
        <button onClick={() => toggle('developments')} className={headerStyle}>
          <span>New Developments</span>
          <svg className={`w-3 h-3 text-muted transition-transform ${open.developments ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open.developments && (
          <ul className="pb-2 px-2">
            {sidebarData.developments.map(d => (
              <li key={d.slug}><a href={`/new-developments/${d.slug}`} className="block py-1.5 text-xs text-accent hover:text-gold px-2 rounded transition-colors">{d.name}</a></li>
            ))}
          </ul>
        )}
      </div>

      {/* Commercial */}
      <div className={sectionStyle}>
        <button onClick={() => toggle('commercial')} className={headerStyle}>
          <span>Commercial</span>
          <svg className={`w-3 h-3 text-muted transition-transform ${open.commercial ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open.commercial && (
          <ul className="pb-2 px-2">
            {sidebarData.commercial.map(c => (
              <li key={c}><a href="/listings" className="block py-1.5 text-xs text-accent hover:text-gold px-2 rounded transition-colors">{c}</a></li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
