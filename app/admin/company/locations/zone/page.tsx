"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ErrorBoundary } from "@/components/error-boundary"
import dynamic from "next/dynamic"
import { getZones, type Zone } from "@/app/actions/zone-actions"
import { toast } from "@/components/ui/use-toast"

// Import ZoneTable with no SSR to avoid ref issues
const ZoneTable = dynamic(() => import("@/components/zone-table"), { ssr: false })

function ErrorFallback() {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <p className="text-red-800">There was an error loading the zone data. Please try again later.</p>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="p-4 border rounded-md">
      <p className="text-gray-500">Loading zones...</p>
    </div>
  )
}

export default function ZonePage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadZones() {
      try {
        setLoading(true)
        const { zones, error } = await getZones()

        if (error) {
          setError(error)
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        } else {
          setZones(zones)
        }
      } catch (err) {
        console.error("Failed to load zones:", err)
        setError("Failed to load zones. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load zones. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadZones()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zones</h1>
          <p className="text-muted-foreground">Manage location zones for your rental business</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/company/locations">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Locations
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground flex items-center">
              <Link href="/admin/company" className="hover:underline">
                Company
              </Link>
              <span className="mx-2">/</span>
              <Link href="/admin/company/locations" className="hover:underline">
                Locations
              </Link>
              <span className="mx-2">/</span>
              <span>Zones</span>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/company/locations/zone/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Zone
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zone Management</CardTitle>
          <CardDescription>View and manage zones for your rental locations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingFallback />
          ) : error ? (
            <ErrorFallback />
          ) : (
            <ErrorBoundary fallback={<ErrorFallback />}>
              <ZoneTable initialZones={zones} />
            </ErrorBoundary>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
