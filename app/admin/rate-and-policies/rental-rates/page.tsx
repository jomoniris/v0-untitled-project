"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { RentalRatesTable } from "@/components/rental-rates-table"
import { toast } from "@/components/ui/use-toast"

export default function RentalRatesPage() {
  const [rates, setRates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true)
        const response = await fetch(
          "/api/rental-rates?" +
            new URLSearchParams({
              cache: "no-store",
              t: Date.now().toString(), // Add timestamp to prevent caching
            }),
        )

        if (!response.ok) {
          throw new Error(`Error fetching rates: ${response.status}`)
        }

        const data = await response.json()
        console.log("API response:", data)

        if (data.error) {
          throw new Error(data.error)
        }

        // Ensure rates is an array
        setRates(Array.isArray(data.rates) ? data.rates : [])
      } catch (err) {
        console.error("Error fetching rental rates:", err)
        setError(err instanceof Error ? err.message : "Failed to load rental rates")
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    toast({
      title: "Refreshing data",
      description: "Fetching the latest rental rates...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Rates</h1>
          <p className="text-muted-foreground">Manage rental rates for different vehicle groups and periods</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/rate-and-policies/rental-rates/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center border rounded-md">
          <p>Loading rental rates...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center border rounded-md bg-red-50">
          <p className="text-red-600">{error}</p>
          <p className="text-muted-foreground mt-2">Please check your database connection and try again.</p>
          <Button variant="outline" className="mt-4" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      ) : rates.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-muted-foreground">
            No rental rates found. Create your first rate by clicking the "Add Rate" button.
          </p>
        </div>
      ) : (
        <RentalRatesTable rates={rates} />
      )}
    </div>
  )
}
