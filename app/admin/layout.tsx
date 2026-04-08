'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navSections = [
  {
    title: 'Content',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊' },
      { href: '/admin/listings', label: 'Listings', icon: '🏠' },
      { href: '/admin/listings/new', label: 'New Listing', icon: '➕' },
      { href: '/admin/developments', label: 'Developments', icon: '🏗️' },
    ],
  },
  {
    title: 'SEO',
    items: [
      { href: '/admin/seo', label: 'SEO Overview', icon: '🔍' },
      { href: '/admin/seo/meta-tags', label: 'Meta Tags', icon: '🏷️' },
      { href: '/admin/seo/sitemap', label: 'Sitemap & Robots', icon: '🗺️' },
      { href: '/admin/seo/redirects', label: 'Redirects', icon: '↪️' },
      { href: '/admin/seo/schema', label: 'Schema.org', icon: '📋' },
      { href: '/admin/seo/analytics', label: 'Performance', icon: '📈' },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-primary text-white shrink-0 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="text-sm font-semibold tracking-[0.15em]">MIAMI RESIDENCE</Link>
          <p className="text-[9px] text-white/30 tracking-[0.2em] uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-2 space-y-4 overflow-y-auto">
          {navSections.map(section => (
            <div key={section.title}>
              <p className="px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">{section.title}</p>
              {section.items.map(item => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-sm transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs">{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="p-2 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-white/30 hover:text-white transition-colors">
            <span className="text-xs">←</span> Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-warm-white min-h-screen overflow-x-hidden">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
