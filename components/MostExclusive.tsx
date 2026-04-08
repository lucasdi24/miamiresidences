export default function MostExclusive() {
  return (
    <section className="py-16 px-4 border-t border-border bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-2">Curated Collection</p>
            <h3 className="text-2xl font-semibold mb-3">Most Exclusive Properties</h3>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Discover the most prestigious real estate in Miami — from oceanfront penthouses to private island estates. Handpicked for the most discerning buyers.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a href="/condos?sort=price-desc" className="btn-primary text-sm rounded-sm">Explore Collection</a>
              <a href="/new-developments" className="btn-outline text-sm rounded-sm">New Developments</a>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-[16/10] bg-gray-100 overflow-hidden rounded-sm shadow-card">
              <img src="https://picsum.photos/seed/miami-exclusive/1200/750" alt="Most Exclusive Properties" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
