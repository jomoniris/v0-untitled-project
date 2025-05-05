"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getLocationById } from "@/app/actions/location-actions"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "react-error-boundary"
import { toast } from "@/components/ui/use-toast"

// Import with no SSR to avoid ref issues
const LocationForm = dynamic(
  () => import("@/components/location-form").then((mod) => ({ default: mod.LocationForm })),
  {
    ssr: false,
    loading: () => <div className="flex justify-center p-4">Loading form...</div>,
  },
)

function ErrorFallback() {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="text-red-600">There was an error loading the location form. Please try refreshing the page.</p>
    </div>
  )
}

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
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        } else if (location) {
          setLocation(location)
        } else {
          setError("Location not found")
          toast({
            title: "Error",
            description: "Location not found",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Failed to load location data:", err)
        setError("Failed to load location data")
        toast({
          title: "Error",
          description: "Failed to load location data. Please try again.",
          variant: "destructive",
        })
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

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <LocationForm initialData={location} isEditing={true} />
      </ErrorBoundary>
    </div>
  )
}
