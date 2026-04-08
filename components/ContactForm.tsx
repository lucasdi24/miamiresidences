'use client'
import { useState, FormEvent } from 'react'

interface ContactFormProps {
  subject?: string
  compact?: boolean
}

export default function ContactForm({ subject = 'Property Inquiry', compact = false }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Simulate sending
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
    }, 1200)
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-lg mb-1">Message Sent!</h3>
        <p className="text-sm text-muted mb-4">Thank you for your inquiry. One of our agents will contact you within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-muted hover:text-black underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" placeholder="First Name" required className="input-field" />
          <input type="text" placeholder="Last Name" required className="input-field" />
        </div>
      )}
      {compact && (
        <input type="text" placeholder="Your Name" required className="input-field w-full" />
      )}
      <input type="email" placeholder="Email Address" required className="input-field w-full" />
      <input type="tel" placeholder="Phone Number" className="input-field w-full" />
      <textarea
        placeholder={`I'm interested in ${subject}. Please send me more information.`}
        rows={compact ? 3 : 4}
        required
        className="input-field w-full resize-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? '⏳ Sending...' : '📧 Send Message'}
      </button>
    </form>
  )
}
