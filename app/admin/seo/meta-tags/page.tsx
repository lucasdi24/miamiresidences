'use client'
import { useEffect, useState } from 'react'

export default function MetaTagsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/seo').then(r => r.json()).then(setSettings)
  }, [])

  const saveGlobal = async () => {
    setSaving(true)
    await fetch('/api/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'global', data: settings.global }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const savePage = async (path: string) => {
    setSaving(true)
    await fetch('/api/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'page', key: path, data: settings.pages[path] }),
    })
    setSaving(false)
    setSaved(true)
    setEditingPage(null)
    setTimeout(() => setSaved(false), 2000)
  }

  const addPage = () => {
    const path = prompt('Enter page path (e.g., /contact):')
    if (!path) return
    setSettings((s: any) => ({
      ...s,
      pages: {
        ...s.pages,
        [path]: { title: '', description: '', keywords: '', ogImage: '', noIndex: false, canonical: path },
      },
    }))
    setEditingPage(path)
  }

  if (!settings) return <p className="text-muted">Loading...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Meta Tags Manager</h1>
          <p className="text-sm text-muted">Edit SEO meta tags for each page</p>
        </div>
        {saved && <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-sm">✓ Saved</span>}
      </div>

      {/* Global Settings */}
      <div className="bg-white border border-border rounded-sm mb-8">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">Global SEO Settings</h2>
          <p className="text-xs text-muted">These apply as defaults across all pages</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Site Name</label>
            <input
              type="text"
              value={settings.global.siteName}
              onChange={e => setSettings((s: any) => ({ ...s, global: { ...s.global, siteName: e.target.value } }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Title Template <span className="text-muted">(%s = page title)</span></label>
            <input
              type="text"
              value={settings.global.titleTemplate}
              onChange={e => setSettings((s: any) => ({ ...s, global: { ...s.global, titleTemplate: e.target.value } }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Default Description</label>
            <textarea
              value={settings.global.defaultDescription}
              onChange={e => setSettings((s: any) => ({ ...s, global: { ...s.global, defaultDescription: e.target.value } }))}
              rows={3}
              className="input-field resize-none"
            />
            <p className="text-[10px] text-muted mt-1">{settings.global.defaultDescription.length}/160 characters</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Default Keywords</label>
            <input
              type="text"
              value={settings.global.defaultKeywords}
              onChange={e => setSettings((s: any) => ({ ...s, global: { ...s.global, defaultKeywords: e.target.value } }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Default OG Image URL</label>
            <input
              type="text"
              value={settings.global.ogImage}
              onChange={e => setSettings((s: any) => ({ ...s, global: { ...s.global, ogImage: e.target.value } }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Twitter Handle</label>
            <input
              type="text"
              value={settings.global.twitterHandle}
              onChange={e => setSettings((s: any) => ({ ...s, global: { ...s.global, twitterHandle: e.target.value } }))}
              className="input-field"
              placeholder="@username"
            />
          </div>
          <button onClick={saveGlobal} disabled={saving} className="btn-primary text-sm rounded-sm">
            {saving ? 'Saving...' : 'Save Global Settings'}
          </button>
        </div>
      </div>

      {/* Per-Page Meta Tags */}
      <div className="bg-white border border-border rounded-sm">
        <div className="px-5 py-3 border-b border-border bg-light flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold">Page-Level Meta Tags</h2>
            <p className="text-xs text-muted">{Object.keys(settings.pages).length} pages configured</p>
          </div>
          <button onClick={addPage} className="text-xs font-medium text-gold hover:underline">+ Add Page</button>
        </div>
        <div className="divide-y divide-border">
          {Object.entries(settings.pages).map(([path, meta]: [string, any]) => (
            <div key={path} className="px-5 py-4">
              {editingPage === path ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <code className="text-xs bg-light px-2 py-1 rounded-sm text-gold">{path}</code>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingPage(null)} className="text-xs text-muted hover:text-primary">Cancel</button>
                      <button onClick={() => savePage(path)} className="btn-primary text-xs py-1 px-4 rounded-sm">Save</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted block mb-1">Title</label>
                    <input
                      type="text"
                      value={meta.title}
                      onChange={e => setSettings((s: any) => ({ ...s, pages: { ...s.pages, [path]: { ...s.pages[path], title: e.target.value } } }))}
                      className="input-field"
                    />
                    <p className="text-[10px] text-muted mt-1">{meta.title.length}/70 characters</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted block mb-1">Description</label>
                    <textarea
                      value={meta.description}
                      onChange={e => setSettings((s: any) => ({ ...s, pages: { ...s.pages, [path]: { ...s.pages[path], description: e.target.value } } }))}
                      rows={2}
                      className="input-field resize-none"
                    />
                    <p className="text-[10px] text-muted mt-1">{meta.description.length}/160 characters</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted block mb-1">Keywords</label>
                    <input
                      type="text"
                      value={meta.keywords}
                      onChange={e => setSettings((s: any) => ({ ...s, pages: { ...s.pages, [path]: { ...s.pages[path], keywords: e.target.value } } }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted block mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={meta.canonical}
                      onChange={e => setSettings((s: any) => ({ ...s, pages: { ...s.pages, [path]: { ...s.pages[path], canonical: e.target.value } } }))}
                      className="input-field"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={meta.noIndex}
                      onChange={e => setSettings((s: any) => ({ ...s, pages: { ...s.pages, [path]: { ...s.pages[path], noIndex: e.target.checked } } }))}
                      className="accent-gold"
                    />
                    No Index (hide from search engines)
                  </label>
                </div>
              ) : (
                <div className="flex justify-between items-start cursor-pointer group" onClick={() => setEditingPage(path)}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs bg-light px-2 py-0.5 rounded-sm">{path}</code>
                      {meta.noIndex && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-sm">noindex</span>}
                    </div>
                    <p className="text-sm font-medium truncate">{meta.title || 'No title set'}</p>
                    <p className="text-xs text-muted truncate mt-0.5">{meta.description || 'No description set'}</p>
                  </div>
                  <span className="text-xs text-muted group-hover:text-gold transition-colors ml-3 shrink-0">Edit →</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
