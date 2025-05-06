"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getLocationById } from "@/app/actions/location-actions"
import { ErrorBoundary } from "@/components/error-boundary"
import { toast } from "@/components/ui/use-toast"
import { LocationForm } from "@/components/location-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

function ErrorFallbackUI() {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="text-red-600">There was an error loading the location form. Please try refreshing the page.</p>
    </div>
  )
}

export default function EditLocationPage() {
  const params = useParams()
  const router = useRouter()
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Location</h1>
            <p className="text-muted-foreground">Loading location data...</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/company/locations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Locations
            </Link>
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Error</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/company/locations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Locations
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Location</h1>
          <p className="text-muted-foreground">Update location information</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/company/locations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Locations
          </Link>
        </Button>
      </div>

      <ErrorBoundary fallback={<ErrorFallbackUI />}>
        <LocationForm initialData={location} isEditing={true} />
      </ErrorBoundary>
    </div>
  )
}
