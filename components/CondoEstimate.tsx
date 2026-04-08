export default function CondoEstimate() {
  return (
    <section className="py-16 px-4 border-t border-border bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        <div className="flex-1 w-full">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium mb-2">Instant Valuation</p>
          <h2 className="text-2xl font-semibold mb-4">How Much Is My Condo Worth?</h2>
          <p className="text-sm text-muted leading-relaxed mb-5">
            Get an instant market value estimate for your property. Enter your condo address or building name for immediate results.
          </p>
          <div className="flex gap-3">
            <input type="text" placeholder="Enter condo address or building name..." className="input-field flex-1" />
            <button className="btn-gold text-sm whitespace-nowrap rounded-sm">Get Estimate</button>
          </div>
        </div>
        <div className="flex-1 text-right hidden md:block">
          <div className="inline-block text-left">
            <span className="block text-4xl md:text-5xl font-bold leading-tight text-primary/10">HOW MUCH</span>
            <span className="block text-3xl md:text-4xl font-bold leading-tight text-primary/20">IS MY CONDO</span>
            <span className="block text-4xl md:text-5xl font-bold leading-tight text-gold/30">WORTH?</span>
          </div>
        </div>
      </div>
    </section>
  )
}
