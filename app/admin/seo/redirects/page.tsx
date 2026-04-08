'use client'
import { useEffect, useState } from 'react'

export default function RedirectsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [newFrom, setNewFrom] = useState('')
  const [newTo, setNewTo] = useState('')
  const [newType, setNewType] = useState(301)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/seo').then(r => r.json()).then(setSettings)
  }, [])

  const addRedirect = async () => {
    if (!newFrom || !newTo) return
    await fetch('/api/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section: 'redirect-add',
        data: { from: newFrom, to: newTo, type: newType, active: true },
      }),
    })
    setNewFrom('')
    setNewTo('')
    const res = await fetch('/api/seo')
    setSettings(await res.json())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleRedirect = async (index: number) => {
    await fetch('/api/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'redirect-toggle', key: index }),
    })
    const res = await fetch('/api/seo')
    setSettings(await res.json())
  }

  const deleteRedirect = async (index: number) => {
    if (!confirm('Delete this redirect?')) return
    await fetch('/api/seo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'redirect-delete', key: index }),
    })
    const res = await fetch('/api/seo')
    setSettings(await res.json())
  }

  if (!settings) return <p className="text-muted">Loading...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">URL Redirects</h1>
          <p className="text-sm text-muted">Manage 301/302 redirects for old or changed URLs</p>
        </div>
        {saved && <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-sm">✓ Saved</span>}
      </div>

      {/* Add New */}
      <div className="bg-white border border-border rounded-sm mb-8">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">Add Redirect</h2>
        </div>
        <div className="p-5">
          <div className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted block mb-1">From Path</label>
              <input type="text" value={newFrom} onChange={e => setNewFrom(e.target.value)} placeholder="/old-page" className="input-field" />
            </div>
            <div className="text-muted text-lg">→</div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted block mb-1">To Path</label>
              <input type="text" value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="/new-page" className="input-field" />
            </div>
            <div className="w-24">
              <label className="text-xs font-medium text-muted block mb-1">Type</label>
              <select value={newType} onChange={e => setNewType(Number(e.target.value))} className="select-field">
                <option value={301}>301</option>
                <option value={302}>302</option>
              </select>
            </div>
            <button onClick={addRedirect} className="btn-primary text-sm rounded-sm">Add</button>
          </div>
        </div>
      </div>

      {/* Redirects List */}
      <div className="bg-white border border-border rounded-sm">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">{settings.redirects.length} Redirects</h2>
        </div>
        {settings.redirects.length === 0 ? (
          <p className="text-center text-muted py-8 text-sm">No redirects configured yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Status</th>
                <th className="text-left px-5 py-2 text-[10px] uppercase tracking-wider text-muted font-medium">From</th>
                <th className="text-left px-5 py-2 text-[10px] uppercase tracking-wider text-muted font-medium">To</th>
                <th className="text-left px-5 py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Type</th>
                <th className="text-right px-5 py-2 text-[10px] uppercase tracking-wider text-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {settings.redirects.map((r: any, i: number) => (
                <tr key={i} className="hover:bg-light/50">
                  <td className="px-5 py-3">
                    <button onClick={() => toggleRedirect(i)} className={`w-8 h-5 rounded-full relative transition-colors ${r.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${r.active ? 'left-3.5' : 'left-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">{r.from}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gold">{r.to}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.type === 301 ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => deleteRedirect(i)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
