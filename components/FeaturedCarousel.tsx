'use client'
import { useRef } from 'react'

const developments = [
  { name: 'Rivage Bal Harbour', sub: 'Bal Harbour', slug: 'rivage-bal-harbour', image: 'https://picsum.photos/seed/dev-rivage/600/800' },
  { name: 'Dolce & Gabbana', sub: 'Brickell', slug: 'dolce-gabbana-residences', image: 'https://picsum.photos/seed/dev-dg/600/800' },
  { name: 'Mercedes-Benz Places', sub: 'Brickell', slug: 'mercedes-benz-places', image: 'https://picsum.photos/seed/dev-mercedes/600/800' },
  { name: 'Waldorf Astoria', sub: 'Downtown Miami', slug: 'waldorf-astoria-miami', image: 'https://picsum.photos/seed/dev-waldorf/600/800' },
  { name: 'Cipriani Residences', sub: 'Brickell', slug: 'cipriani-residences-miami', image: 'https://picsum.photos/seed/dev-cipriani/600/800' },
  { name: 'Baccarat Residences', sub: 'Brickell', slug: 'baccarat-residences-miami', image: 'https://picsum.photos/seed/dev-baccarat/600/800' },
  { name: 'St Regis Miami', sub: 'Brickell', slug: 'st-regis-residences-miami', image: 'https://picsum.photos/seed/dev-stregis/600/800' },
  { name: 'Bentley Residences', sub: 'Sunny Isles', slug: 'bentley-residences', image: 'https://picsum.photos/seed/dev-bentley/600/800' },
  { name: 'Aria Reserve', sub: 'Edgewater', slug: 'aria-reserve', image: 'https://picsum.photos/seed/dev-aria/600/800' },
  { name: 'Six Fisher Island', sub: 'Fisher Island', slug: 'six-fisher-island', image: 'https://picsum.photos/seed/dev-fisher/600/800' },
  { name: 'Mandarin Oriental', sub: 'Brickell Key', slug: 'mandarin-oriental-residences', image: 'https://picsum.photos/seed/dev-mandarin/600/800' },
  { name: 'E11EVEN Residences', sub: 'Downtown', slug: 'e11even-residences', image: 'https://picsum.photos/seed/dev-eleven/600/800' },
  { name: 'Villa Miami', sub: 'Edgewater', slug: 'villa-miami', image: 'https://picsum.photos/seed/dev-villamiami/600/800' },
  { name: 'Shell Bay', sub: 'Hallandale', slug: 'shell-bay-residences', image: 'https://picsum.photos/seed/dev-shellbay/600/800' },
  { name: 'Casa Bella', sub: 'Downtown', slug: 'casa-bella-residences', image: 'https://picsum.photos/seed/dev-casabella/600/800' },
]

export default function FeaturedCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 330, behavior: 'smooth' })

  return (
    <section className="py-16 px-4 border-t border-border bg-light">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-1">Featured</p>
            <h3 className="text-xl font-semibold">New Developments</h3>
          </div>
          <a href="/new-developments" className="text-xs font-medium text-muted hover:text-gold transition-colors">View All →</a>
        </div>
        <div className="relative">
          <button onClick={() => scroll(-1)} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white text-primary w-10 h-10 flex items-center justify-center shadow-card-hover rounded-full hover:bg-gold hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div ref={ref} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 px-2" style={{ scrollbarWidth: 'none' }}>
            {developments.map(d => (
              <a key={d.name} href={`/new-developments/${d.slug}`} className="snap-start min-w-[260px] md:min-w-[280px] group">
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm shadow-card">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h4 className="font-semibold text-sm text-white mb-0.5">{d.name}</h4>
                    <p className="text-[11px] text-white/60">{d.sub}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <button onClick={() => scroll(1)} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white text-primary w-10 h-10 flex items-center justify-center shadow-card-hover rounded-full hover:bg-gold hover:text-white transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  )
}
