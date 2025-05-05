"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Plus } from "lucide-react"
import dynamic from "next/dynamic"
import { ErrorBoundary } from "react-error-boundary"
import { toast } from "@/components/ui/use-toast"
import { getLocations } from "@/app/actions/location-actions"
import type { Location } from "@/app/actions/location-actions"

// Import with no SSR to avoid ref issues
const LocationsTable = dynamic(
  () => import("@/components/locations-table").then((mod) => ({ default: mod.LocationsTable })),
  {
    ssr: false,
    loading: () => <div className="flex justify-center p-4">Loading locations table...</div>,
  },
)

function ErrorFallback() {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="text-red-600">There was an error loading the locations table. Please try refreshing the page.</p>
    </div>
  )
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoading(true)
        const { locations, error } = await getLocations()

        if (error) {
          setError(error)
          toast({
            title: "Error loading locations",
            description: error,
            variant: "destructive",
          })
        } else {
          setLocations(locations)
        }
      } catch (err) {
        console.error("Failed to load locations:", err)
        setError("Failed to load locations. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load locations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">Manage your rental locations and zones</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/company/locations/zone">
              <MapPin className="mr-2 h-4 w-4" />
              Manage Zones
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/company/locations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Locations</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Rental Locations</CardTitle>
              <CardDescription>View and manage all your rental locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <LocationsTable
                  locations={locations}
                  loading={loading}
                  error={error}
                  onLocationDeleted={(deletedId) => {
                    setLocations((prev) => prev.filter((loc) => loc.id !== deletedId))
                  }}
                  onLocationStatusChanged={(locationId, newStatus) => {
                    setLocations((prev) =>
                      prev.map((loc) => (loc.id === locationId ? { ...loc, active: newStatus } : loc)),
                    )
                  }}
                />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Locations</CardTitle>
              <CardDescription>View and manage active rental locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <LocationsTable
                  locations={locations.filter((loc) => loc.active)}
                  loading={loading}
                  error={error}
                  onLocationDeleted={(deletedId) => {
                    setLocations((prev) => prev.filter((loc) => loc.id !== deletedId))
                  }}
                  onLocationStatusChanged={(locationId, newStatus) => {
                    setLocations((prev) =>
                      prev.map((loc) => (loc.id === locationId ? { ...loc, active: newStatus } : loc)),
                    )
                  }}
                />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Locations</CardTitle>
              <CardDescription>View and manage inactive rental locations</CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <LocationsTable
                  locations={locations.filter((loc) => !loc.active)}
                  loading={loading}
                  error={error}
                  onLocationDeleted={(deletedId) => {
                    setLocations((prev) => prev.filter((loc) => loc.id !== deletedId))
                  }}
                  onLocationStatusChanged={(locationId, newStatus) => {
                    setLocations((prev) =>
                      prev.map((loc) => (loc.id === locationId ? { ...loc, active: newStatus } : loc)),
                    )
                  }}
                />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
