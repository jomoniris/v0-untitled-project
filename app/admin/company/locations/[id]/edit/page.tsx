"use client"

import { LocationForm } from "@/components/location-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Mock API function to get location data
async function getLocationById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const locations = [
    {
      id: "1",
      code: "NYC-DT",
      name: "Downtown Office",
      stationType: "full-service",
      metroplex: "new-york",
      address: "123 Main St",
      city: "New York",
      state: "ny",
      postalCode: "10001",
      country: "usa",
      operatingHours: "8:00 AM - 8:00 PM",
      email: "nyc.downtown@example.com",
      telephone: "+1 (212) 555-1234",
      fax: "+1 (212) 555-5678",
      latitude: "40.7128",
      longitude: "-74.0060",
      nominalAccount: "NYC-001",
      dbrNextNo: "10001",
      dbrDate: "2023-04-15",
      stationManager: "John Smith",
      tax1: "8.875",
      tax2: "0",
      active: true,
    },
    {
      id: "2",
      code: "NYC-AP",
      name: "Airport Terminal",
      stationType: "airport",
      metroplex: "new-york",
      address: "JFK Airport, Terminal 4",
      city: "New York",
      state: "ny",
      postalCode: "11430",
      country: "usa",
      operatingHours: "24/7",
      email: "nyc.airport@example.com",
      telephone: "+1 (212) 555-4321",
      fax: "+1 (212) 555-8765",
      latitude: "40.6413",
      longitude: "-73.7781",
      nominalAccount: "NYC-002",
      dbrNextNo: "10002",
      dbrDate: "2023-04-15",
      stationManager: "Jane Doe",
      tax1: "8.875",
      tax2: "0",
      active: true,
    },
  ]

  return locations.find((location) => location.id === id)
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
        const data = await getLocationById(id)
        if (data) {
          setLocation(data)
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
