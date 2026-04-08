'use client'
import { useEffect, useState } from 'react'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

export default function SitemapPage() {
  const [urls, setUrls] = useState<SitemapUrl[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [robotsTxt, setRobotsTxt] = useState('')

  useEffect(() => {
    // Fetch sitemap
    fetch('/sitemap.xml')
      .then(r => r.text())
      .then(xml => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'text/xml')
        const urlNodes = doc.querySelectorAll('url')
        const parsed: SitemapUrl[] = []
        urlNodes.forEach(node => {
          parsed.push({
            loc: node.querySelector('loc')?.textContent || '',
            lastmod: node.querySelector('lastmod')?.textContent || '',
            changefreq: node.querySelector('changefreq')?.textContent || '',
            priority: node.querySelector('priority')?.textContent || '',
          })
        })
        setUrls(parsed)
      })
      .catch(() => {})

    // Fetch robots.txt
    fetch('/robots.txt')
      .then(r => r.text())
      .then(setRobotsTxt)
      .catch(() => {})

    // Fetch SEO settings
    fetch('/api/seo').then(r => r.json()).then(setSettings)
  }, [])

  const saveRobots = async () => {
    if (!settings) return
    setSaving(true)
    await fetch('/api/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'robots', data: settings.robots }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const groupedUrls: Record<string, SitemapUrl[]> = {}
  urls.forEach(u => {
    const url = new URL(u.loc)
    const segments = url.pathname.split('/').filter(Boolean)
    const group = segments[0] || 'home'
    if (!groupedUrls[group]) groupedUrls[group] = []
    groupedUrls[group].push(u)
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Sitemap & Robots.txt</h1>
          <p className="text-sm text-muted">View and manage your sitemap and crawler settings</p>
        </div>
        {saved && <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-sm">✓ Saved</span>}
      </div>

      {/* Sitemap Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{urls.length}</p>
          <p className="text-xs text-muted mt-1">Total URLs</p>
        </div>
        {Object.entries(groupedUrls).slice(0, 3).map(([group, items]) => (
          <div key={group} className="bg-white border border-border p-4 rounded-sm text-center">
            <p className="text-3xl font-bold">{items.length}</p>
            <p className="text-xs text-muted mt-1 capitalize">{group} Pages</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sitemap URLs */}
        <div className="bg-white border border-border rounded-sm">
          <div className="px-5 py-3 border-b border-border bg-light flex justify-between items-center">
            <h2 className="text-sm font-semibold">Sitemap URLs</h2>
            <a href="/sitemap.xml" target="_blank" className="text-xs text-gold hover:underline">View XML →</a>
          </div>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-border">
            {Object.entries(groupedUrls).map(([group, items]) => (
              <div key={group}>
                <div className="px-5 py-2 bg-light/50 sticky top-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{group} ({items.length})</span>
                </div>
                {items.map((u, i) => (
                  <div key={i} className="px-5 py-2 flex justify-between items-center text-xs hover:bg-light/30">
                    <span className="truncate flex-1 mr-3 text-primary">{new URL(u.loc).pathname}</span>
                    <div className="flex gap-3 text-muted shrink-0">
                      {u.priority && <span>P: {u.priority}</span>}
                      {u.changefreq && <span>{u.changefreq}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Robots.txt */}
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-sm">
            <div className="px-5 py-3 border-b border-border bg-light flex justify-between items-center">
              <h2 className="text-sm font-semibold">Robots.txt</h2>
              <a href="/robots.txt" target="_blank" className="text-xs text-gold hover:underline">View File →</a>
            </div>
            <div className="p-5">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto whitespace-pre-wrap font-mono">{robotsTxt || 'Loading...'}</pre>
            </div>
          </div>

          {settings && (
            <div className="bg-white border border-border rounded-sm">
              <div className="px-5 py-3 border-b border-border bg-light">
                <h2 className="text-sm font-semibold">Robots Settings</h2>
              </div>
              <div className="p-5 space-y-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.robots.allowAll}
                    onChange={e => setSettings((s: any) => ({ ...s, robots: { ...s.robots, allowAll: e.target.checked } }))}
                    className="accent-gold"
                  />
                  Allow all crawlers
                </label>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Disallowed paths (one per line)</label>
                  <textarea
                    value={settings.robots.disallow.join('\n')}
                    onChange={e => setSettings((s: any) => ({ ...s, robots: { ...s.robots, disallow: e.target.value.split('\n').filter(Boolean) } }))}
                    rows={4}
                    className="input-field resize-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Sitemap URL</label>
                  <input
                    type="text"
                    value={settings.robots.sitemapUrl}
                    onChange={e => setSettings((s: any) => ({ ...s, robots: { ...s.robots, sitemapUrl: e.target.value } }))}
                    className="input-field"
                  />
                </div>
                <button onClick={saveRobots} disabled={saving} className="btn-primary text-sm rounded-sm">
                  {saving ? 'Saving...' : 'Save Robots Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
