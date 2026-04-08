'use client'
import { useEffect, useState } from 'react'

export default function AnalyticsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/seo').then(r => r.json()).then(setSettings)
  }, [])

  const save = async () => {
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

  if (!settings) return <p className="text-muted">Loading...</p>

  const integrations = [
    {
      name: 'Google Analytics 4',
      description: 'Track visitor behavior, traffic sources, and conversions',
      field: 'googleAnalyticsId',
      placeholder: 'G-XXXXXXXXXX',
      icon: '📊',
      docsUrl: 'https://analytics.google.com',
      connected: !!settings.global.googleAnalyticsId,
    },
    {
      name: 'Google Tag Manager',
      description: 'Manage marketing tags and scripts without code changes',
      field: 'googleTagManagerId',
      placeholder: 'GTM-XXXXXXX',
      icon: '🏷️',
      docsUrl: 'https://tagmanager.google.com',
      connected: !!settings.global.googleTagManagerId,
    },
    {
      name: 'Google Search Console',
      description: 'Verify site ownership for search performance data',
      field: 'googleVerification',
      placeholder: 'Verification code (meta tag content)',
      icon: '🔍',
      docsUrl: 'https://search.google.com/search-console',
      connected: !!settings.global.googleVerification,
    },
    {
      name: 'Bing Webmaster Tools',
      description: 'Verify site for Bing search engine visibility',
      field: 'bingVerification',
      placeholder: 'Verification code',
      icon: '🌐',
      docsUrl: 'https://www.bing.com/webmasters',
      connected: !!settings.global.bingVerification,
    },
  ]

  const connectedCount = integrations.filter(i => i.connected).length

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Performance & Analytics</h1>
          <p className="text-sm text-muted">Connect analytics services and search engine verification</p>
        </div>
        {saved && <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-sm">✓ Saved</span>}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className="text-3xl font-bold">{connectedCount}/{integrations.length}</p>
          <p className="text-xs text-muted mt-1">Connected</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className={`text-3xl font-bold ${settings.global.googleAnalyticsId ? 'text-green-600' : 'text-red-500'}`}>
            {settings.global.googleAnalyticsId ? '✓' : '✗'}
          </p>
          <p className="text-xs text-muted mt-1">Analytics</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className={`text-3xl font-bold ${settings.global.googleTagManagerId ? 'text-green-600' : 'text-red-500'}`}>
            {settings.global.googleTagManagerId ? '✓' : '✗'}
          </p>
          <p className="text-xs text-muted mt-1">Tag Manager</p>
        </div>
        <div className="bg-white border border-border p-4 rounded-sm text-center">
          <p className={`text-3xl font-bold ${settings.global.googleVerification ? 'text-green-600' : 'text-red-500'}`}>
            {settings.global.googleVerification ? '✓' : '✗'}
          </p>
          <p className="text-xs text-muted mt-1">Search Console</p>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="space-y-4 mb-8">
        {integrations.map((integration) => (
          <div key={integration.field} className="bg-white border border-border rounded-sm">
            <div className="px-5 py-3 border-b border-border bg-light flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xl">{integration.icon}</span>
                <div>
                  <h2 className="text-sm font-semibold">{integration.name}</h2>
                  <p className="text-xs text-muted">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${integration.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {integration.connected ? 'Connected' : 'Not Connected'}
                </span>
                <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline">
                  Open ↗
                </a>
              </div>
            </div>
            <div className="p-5">
              <label className="text-xs font-medium text-muted block mb-1">
                {integration.name === 'Google Analytics 4' ? 'Measurement ID' :
                 integration.name === 'Google Tag Manager' ? 'Container ID' :
                 'Verification Code'}
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={(settings.global as any)[integration.field] || ''}
                  onChange={e => setSettings((s: any) => ({
                    ...s,
                    global: { ...s.global, [integration.field]: e.target.value },
                  }))}
                  placeholder={integration.placeholder}
                  className="input-field flex-1"
                />
              </div>
              {integration.field === 'googleAnalyticsId' && settings.global.googleAnalyticsId && (
                <p className="text-[10px] text-muted mt-2">
                  GA4 script will be injected into &lt;head&gt; on all public pages. Data appears in your{' '}
                  <a href="https://analytics.google.com" target="_blank" className="text-gold hover:underline">Google Analytics dashboard</a>.
                </p>
              )}
              {integration.field === 'googleTagManagerId' && settings.global.googleTagManagerId && (
                <p className="text-[10px] text-muted mt-2">
                  GTM container will be loaded on all pages. Manage tags in{' '}
                  <a href="https://tagmanager.google.com" target="_blank" className="text-gold hover:underline">Google Tag Manager</a>.
                </p>
              )}
              {integration.field === 'googleVerification' && (
                <p className="text-[10px] text-muted mt-2">
                  Paste the content value from the meta tag Google provides: &lt;meta name=&quot;google-site-verification&quot; content=&quot;<strong>THIS_VALUE</strong>&quot; /&gt;
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary text-sm rounded-sm px-8">
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Implementation Notes */}
      <div className="bg-white border border-border rounded-sm mt-8">
        <div className="px-5 py-3 border-b border-border bg-light">
          <h2 className="text-sm font-semibold">Implementation Notes</h2>
        </div>
        <div className="p-5">
          <ul className="space-y-2 text-xs text-muted">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Google Analytics 4 uses gtag.js (loaded via next/script with strategy &quot;afterInteractive&quot;)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>GTM is injected in both &lt;head&gt; and &lt;body&gt; (noscript fallback)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Verification meta tags are added to the root layout &lt;head&gt;</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>All tracking scripts are loaded only in production (disabled in dev mode)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-600">!</span>
              <span>For GDPR compliance, consider adding a cookie consent banner before enabling tracking</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
