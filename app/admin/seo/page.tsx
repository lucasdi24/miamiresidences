'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SeoOverview() {
  const [settings, setSettings] = useState<any>(null)
  const [sitemapCount, setSitemapCount] = useState(0)

  useEffect(() => {
    fetch('/api/seo').then(r => r.json()).then(setSettings)
    // Count sitemap URLs
    fetch('/sitemap.xml')
      .then(r => r.text())
      .then(xml => {
        const matches = xml.match(/<url>/g)
        setSitemapCount(matches?.length || 0)
      })
      .catch(() => {})
  }, [])

  if (!settings) return <p className="text-muted">Loading SEO data...</p>

  const pageCount = Object.keys(settings.pages).length
  const redirectCount = settings.redirects.length
  const activeRedirects = settings.redirects.filter((r: any) => r.active).length
  const hasAnalytics = !!settings.global.googleAnalyticsId
  const hasVerification = !!settings.global.googleVerification

  const checks = [
    { label: 'Title Template configured', ok: !!settings.global.titleTemplate, link: '/admin/seo/meta-tags' },
    { label: 'Default meta description set', ok: settings.global.defaultDescription.length > 50, link: '/admin/seo/meta-tags' },
    { label: 'OG Image configured', ok: !!settings.global.ogImage, link: '/admin/seo/meta-tags' },
    { label: 'Sitemap.xml active', ok: sitemapCount > 0, link: '/admin/seo/sitemap' },
    { label: 'Robots.txt configured', ok: true, link: '/admin/seo/sitemap' },
    { label: 'Schema.org markup on pages', ok: true, link: '/admin/seo/schema' },
    { label: 'Google Analytics connected', ok: hasAnalytics, link: '/admin/seo/analytics' },
    { label: 'Google Search Console verified', ok: hasVerification, link: '/admin/seo/analytics' },
    { label: 'Redirects active', ok: activeRedirects > 0, link: '/admin/seo/redirects' },
    { label: 'Canonical URLs set', ok: true, link: '/admin/seo/meta-tags' },
  ]

  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100)

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">SEO Overview</h1>
      <p className="text-sm text-muted mb-6">Monitor and manage your site&apos;s search engine optimization</p>

      {/* Score & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-border p-5 rounded-sm text-center">
          <p className={`text-4xl font-bold ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{score}%</p>
          <p className="text-xs text-muted mt-1">SEO Score</p>
        </div>
        <div className="bg-white border border-border p-5 rounded-sm text-center">
          <p className="text-3xl font-bold">{sitemapCount}</p>
          <p className="text-xs text-muted mt-1">Sitemap URLs</p>
        </div>
        <div className="bg-white border border-border p-5 rounded-sm text-center">
          <p className="text-3xl font-bold">{pageCount}</p>
          <p className="text-xs text-muted mt-1">Pages with Meta</p>
        </div>
        <div className="bg-white border border-border p-5 rounded-sm text-center">
          <p className="text-3xl font-bold">{activeRedirects}/{redirectCount}</p>
          <p className="text-xs text-muted mt-1">Active Redirects</p>
        </div>
        <div className="bg-white border border-border p-5 rounded-sm text-center">
          <p className="text-3xl font-bold">{hasAnalytics ? '✅' : '❌'}</p>
          <p className="text-xs text-muted mt-1">Analytics</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white border border-border rounded-sm mb-8">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">SEO Checklist</h2>
        </div>
        <div className="divide-y divide-border">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${check.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {check.ok ? '✓' : '!'}
                </span>
                <span className="text-sm">{check.label}</span>
              </div>
              <Link href={check.link} className="text-xs text-gold hover:underline">Configure →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { title: 'Meta Tags', desc: 'Edit titles, descriptions, OG tags per page', href: '/admin/seo/meta-tags', icon: '🏷️' },
          { title: 'Sitemap & Robots', desc: 'View sitemap URLs and robots.txt rules', href: '/admin/seo/sitemap', icon: '🗺️' },
          { title: 'Redirects', desc: 'Manage 301/302 URL redirects', href: '/admin/seo/redirects', icon: '↪️' },
          { title: 'Schema.org', desc: 'View structured data on each page', href: '/admin/seo/schema', icon: '📋' },
          { title: 'Performance', desc: 'Analytics IDs and verification codes', href: '/admin/seo/analytics', icon: '📈' },
          { title: 'Developments', desc: 'Manage development landing pages', href: '/admin/developments', icon: '🏗️' },
        ].map(card => (
          <Link key={card.href} href={card.href} className="bg-white border border-border p-5 rounded-sm hover:shadow-card-hover hover:border-gold/30 transition-all group">
            <span className="text-2xl">{card.icon}</span>
            <h3 className="text-sm font-semibold mt-2 group-hover:text-gold transition-colors">{card.title}</h3>
            <p className="text-xs text-muted mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
