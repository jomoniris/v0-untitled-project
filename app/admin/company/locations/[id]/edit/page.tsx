"use client"

import { LocationForm } from "@/components/location-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getLocationById } from "@/app/actions/location-actions"

export default function EditLocationPage() {
  const params = useParams()
  const id = params.id as string
  const [location, setLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLocation() {
      try {
        setLoading(true)
        const { location, error } = await getLocationById(id)

        if (error) {
          setError(error)
        } else if (location) {
          setLocation(location)
        } else {
          setError("Location not found")
        }
      } catch (err) {
        setError("Failed to load location data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadLocation()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Location</h1>
          <p className="text-muted-foreground">Loading location data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Location</h1>
        <p className="text-muted-foreground">Update location information</p>
      </div>

      <LocationForm initialData={location} isEditing={true} />
    </div>
  )
}
