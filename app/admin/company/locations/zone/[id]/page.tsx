"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "react-error-boundary"
import { getZoneById } from "@/app/actions/zone-actions"
import { toast } from "@/components/ui/use-toast"

// Import ZoneForm with no SSR to avoid ref issues
const ZoneForm = dynamic(() => import("@/components/zone-form"), { ssr: false })

function ErrorFallback() {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <p className="text-red-800">There was an error loading the zone data. Please try again later.</p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="p-4 border rounded-md">
      <p className="text-gray-500">Loading zone data...</p>
    </div>
  )
}

export default function EditZonePage() {
  const params = useParams()
  const zoneId = params.id as string

  const [zoneData, setZoneData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadZoneData() {
      try {
        setLoading(true)
        const { zone, error } = await getZoneById(zoneId)

        if (error) {
          setError(error)
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        } else if (!zone) {
          setError("Zone not found")
          toast({
            title: "Error",
            description: "Zone not found",
            variant: "destructive",
          })
        } else {
          setZoneData(zone)
        }
      } catch (err) {
        console.error("Failed to load zone:", err)
        setError("Failed to load zone data. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load zone data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadZoneData()
  }, [zoneId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Zone</h1>
        <p className="text-muted-foreground">Update zone information</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorFallback />
      ) : (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ZoneForm initialData={zoneData} isEditing={true} />
        </ErrorBoundary>
      )}
    </div>
  )
}
