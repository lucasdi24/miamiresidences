const categories = [
  { title: 'Oceanfront Condos', desc: 'View current Condo listings for Sale and Rent', icon: '🏖️', href: '/condos' },
  { title: 'Single Family Homes', desc: 'Find Your New Home in Miami', icon: '🏡', href: '/homes' },
  { title: 'Instant Estimate', desc: "Get an Instant Quote of your Condo's Market Value", icon: '💰', href: '/condos' },
  { title: 'New Developments', desc: 'Exclusive offers from Miami Developers', icon: '🏗️', href: '/new-developments' },
  { title: 'Miami Market Trends', desc: 'Miami Real Estate in Real Time', icon: '📊', href: '/condos' },
  { title: 'Commercial Real Estate', desc: 'Commercial properties for sale and rent', icon: '🏢', href: '/listings' },
  { title: 'Virtual Tours', desc: 'Virtual Tours and Showings available', icon: '🎥', href: '/condos' },
  { title: 'Most Exclusive', desc: 'Most exclusive properties in Miami', icon: '💎', href: '/condos?sort=price-desc' },
]

export default function CategoryGrid() {
  return (
    <section className="py-10 md:py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-2">Explore</p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">Miami Real Estate in Real Time</h2>
          <p className="text-xs md:text-sm text-muted max-w-xl mx-auto leading-relaxed px-2">
            All the tools you need to make informed decisions about South Florida real estate.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5">
          {categories.map(cat => (
            <a
              key={cat.title}
              href={cat.href}
              className="group text-center p-4 md:p-6 bg-warm-white border border-border rounded-sm hover:shadow-card-hover hover:border-gold/30 active:scale-[0.98] transition-all duration-200 min-h-[140px] flex flex-col items-center justify-center"
            >
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
              <h3 className="text-[11px] md:text-xs font-semibold mb-1.5 uppercase tracking-wide leading-snug">{cat.title}</h3>
              <p className="hidden md:block text-[11px] text-muted leading-relaxed">{cat.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
