export default function JustListed() {
  return (
    <section className="py-16 px-4 border-t border-border bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1">
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-sm shadow-card">
            <img src="https://picsum.photos/seed/miami-justlisted/800/600" alt="Just Listed" className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-gold text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider">Just Listed</div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-2">Latest Arrivals</p>
          <h3 className="text-2xl font-semibold mb-4">Newest on the Market</h3>
          <p className="text-sm text-muted leading-relaxed mb-6">
            Be the first to discover Miami&apos;s latest listings. Our &ldquo;Just Listed&rdquo; feed is updated daily with the freshest opportunities in South Florida&apos;s real estate market.
          </p>
          <a href="/condos?sort=newest" className="btn-primary text-sm inline-block rounded-sm">View Newest Listings</a>
        </div>
      </div>
    </section>
  )
}
