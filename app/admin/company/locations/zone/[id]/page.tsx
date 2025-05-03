"use client"

import { ZoneForm } from "@/components/zone-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Mock API function to get zone data
async function getZoneById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const zones = [
    {
      id: "1",
      code: "NYC-DOWNTOWN",
      description: "New York City Downtown Area",
      belongsTo: "nyc",
      timeZone: "est",
      active: true,
    },
    {
      id: "2",
      code: "NYC-MIDTOWN",
      description: "New York City Midtown Area",
      belongsTo: "nyc",
      timeZone: "est",
      active: true,
    },
    {
      id: "3",
      code: "NYC-AIRPORT",
      description: "New York City Airport Zone",
      belongsTo: "nyc",
      timeZone: "est",
      active: true,
    },
    {
      id: "4",
      code: "LA-DOWNTOWN",
      description: "Los Angeles Downtown Area",
      belongsTo: "la",
      timeZone: "pst",
      active: false,
    },
    {
      id: "5",
      code: "CHI-NORTH",
      description: "Chicago North Side",
      belongsTo: "chicago",
      timeZone: "cst",
      active: true,
    },
  ]

  return zones.find((zone) => zone.id === id)
}

export default function EditZonePage() {
  const params = useParams()
  const id = params.id as string
  const [zone, setZone] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadZone() {
      try {
        const data = await getZoneById(id)
        if (data) {
          setZone(data)
        } else {
          setError("Zone not found")
        }
      } catch (err) {
        setError("Failed to load zone data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadZone()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Zone</h1>
          <p className="text-muted-foreground">Loading zone data...</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Zone</h1>
        <p className="text-muted-foreground">Update zone information</p>
      </div>

      <ZoneForm initialData={zone} isEditing={true} />
    </div>
  )
}
