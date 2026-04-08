export default function VirtualTours() {
  return (
    <section className="py-16 px-4 border-t border-border bg-light">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-2">Virtual Experience</p>
          <h3 className="text-2xl font-semibold mb-4">Tour Properties From Anywhere</h3>
          <div className="aspect-video bg-gray-100 mb-5 overflow-hidden rounded-sm shadow-card">
            <img src="https://picsum.photos/seed/miami-vr-tour/800/450" alt="Virtual Tour" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Virtual valuations and viewings are now available. Explore properties in stunning 360° detail — saving you time while making confident decisions.
          </p>
          <a href="/condos" className="btn-primary text-sm rounded-sm inline-block">Start Virtual Touring</a>
        </div>
        <div className="flex-1 hidden md:block">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm shadow-card">
            <img src="https://picsum.photos/seed/miami-vr-side/600/800" alt="Virtual Tours" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
