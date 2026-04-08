'use client'
import { usePathname } from 'next/navigation'
import { useFavorites } from './FavoritesProvider'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { count } = useFavorites()

  // Hide on admin pages
  if (pathname?.startsWith('/admin')) return null

  const items = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      match: (p: string) => p === '/',
    },
    {
      label: 'Condos',
      href: '/condos',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      match: (p: string) => p.startsWith('/condos'),
    },
    {
      label: 'Search',
      href: '/listings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      match: (p: string) => p.startsWith('/listings'),
    },
    {
      label: 'Saved',
      href: '/favorites',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      match: (p: string) => p.startsWith('/favorites'),
      badge: count,
    },
    {
      label: 'Call',
      href: 'tel:3057511000',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      match: () => false,
    },
  ]

  return (
    <>
      {/* Spacer so content isn't hidden behind nav */}
      <div className="lg:hidden h-16 pb-safe" aria-hidden="true" />

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16">
          {items.map(item => {
            const active = item.match(pathname || '')
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-full relative transition-colors active:bg-gray-50 ${
                  active ? 'text-gold' : 'text-muted'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 bg-gold text-white text-[10px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </a>
            )
          })}
        </div>
      </nav>
    </>
  )
}
