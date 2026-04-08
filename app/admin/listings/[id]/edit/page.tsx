'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ListingForm from '@/components/admin/ListingForm'
import { Listing } from '@/lib/types'

export default function EditListing() {
  const params = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/listings/${params.id}`).then(r => r.json()).then(data => {
      if (data.error) setListing(null)
      else setListing(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="text-muted">Loading...</div>
  if (!listing) return <div className="text-red-500">Listing not found</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
      <ListingForm listing={listing} isEdit />
    </div>
  )
}
