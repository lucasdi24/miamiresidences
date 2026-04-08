import LanguageSelector from './LanguageSelector'

export default function Footer() {
  return (
    <footer>
      <div className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">Services</h4>
                  <ul className="space-y-2">
                    {[
                      { label: 'Oceanfront Condos', href: '/condos' },
                      { label: 'Single Family Homes', href: '/homes' },
                      { label: 'New Developments', href: '/new-developments' },
                      { label: 'Instant Estimate', href: '/condos' },
                      { label: 'Most Exclusive', href: '/condos?sort=price-desc' },
                      { label: 'Just Listed', href: '/condos?sort=newest' },
                    ].map(s => (
                      <li key={s.label}><a href={s.href} className="text-xs text-white/50 hover:text-white transition-colors">{s.label}</a></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">Property Types</h4>
                  <ul className="space-y-2">
                    {[
                      { label: 'Waterfront Condos', href: '/condos' },
                      { label: 'Luxury Penthouses', href: '/condos?sort=price-desc' },
                      { label: 'Branded Residences', href: '/new-developments' },
                      { label: 'Beachfront Homes', href: '/homes' },
                      { label: 'Gated Communities', href: '/homes' },
                    ].map(s => (
                      <li key={s.label}><a href={s.href} className="text-xs text-white/50 hover:text-white transition-colors">{s.label}</a></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">Neighborhoods</h4>
                  <ul className="space-y-2">
                    {[
                      { label: 'Brickell', href: '/condos/miami' },
                      { label: 'Miami Beach', href: '/condos/miami-beach' },
                      { label: 'Sunny Isles Beach', href: '/condos/sunny-isles-beach' },
                      { label: 'Bal Harbour', href: '/condos/bal-harbour' },
                      { label: 'Coral Gables', href: '/condos/coral-gables' },
                      { label: 'Key Biscayne', href: '/condos/key-biscayne' },
                      { label: 'Hollywood', href: '/condos/hollywood' },
                      { label: 'Hallandale Beach', href: '/condos/hallandale-beach' },
                    ].map(s => (
                      <li key={s.label}><a href={s.href} className="text-xs text-white/50 hover:text-white transition-colors">{s.label}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
              <hr className="border-white/10 mb-6" />
              <div className="flex flex-wrap items-center gap-8">
                <LanguageSelector />
                <p className="text-xs text-white/30">Miami Residence Realty — Premier luxury real estate brokerage.</p>
              </div>
            </div>
            <div className="lg:w-64 lg:text-right">
              <div className="mb-5">
                <span className="text-lg font-semibold tracking-[0.15em] block">MIAMI RESIDENCE</span>
                <span className="text-[9px] text-white/30 tracking-[0.25em] uppercase">Luxury Real Estate</span>
              </div>
              <p className="text-xs text-white/40 mb-1 leading-relaxed">20900 NE 30th Ave. Suite 410</p>
              <p className="text-xs text-white/40 mb-3">Miami, FL 33180 USA</p>
              <p className="text-sm font-medium mb-5 tracking-wide">+1 305 751-1000</p>
              <div className="flex gap-2 lg:justify-end mb-5">
                {['Facebook', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn'].map(s => (
                  <a key={s} href={`https://${s.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-white/15 flex items-center justify-center text-[10px] text-white/40 hover:text-white hover:border-white/40 transition-all rounded-sm" title={s}>
                    {s[0]}
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-white/20">&copy; 2009-2026 Miami Residence Realty</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#0d0d0d] text-center py-5 px-4">
        <p className="text-xs text-white/25 mb-3">We know Miami, love Miami, and will help find your perfect home.</p>
        <div className="flex justify-center gap-5">
          {[
            { label: 'Condos', href: '/condos' },
            { label: 'Homes', href: '/homes' },
            { label: 'New Developments', href: '/new-developments' },
            { label: 'All Listings', href: '/listings' },
          ].map(s => (
            <a key={s.label} href={s.href} className="text-[10px] text-white/20 hover:text-white/50 transition-colors">{s.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
