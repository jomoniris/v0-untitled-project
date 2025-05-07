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
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true)
        console.log("Fetching rental rates, refresh key:", refreshKey)

        const timestamp = Date.now()
        const url = `/api/rental-rates?cache=no-store&t=${timestamp}`
        console.log("Fetching from URL:", url)

        const response = await fetch(url)
        console.log("Response status:", response.status)

        const contentType = response.headers.get("content-type")
        console.log("Response content type:", contentType)

        const data = await response.json()
        console.log("API response:", data)

        // Store debug info
        setDebugInfo({
          timestamp,
          status: response.status,
          contentType,
          dataKeys: Object.keys(data),
          ratesLength: Array.isArray(data.rates) ? data.rates.length : "not an array",
          firstRate: Array.isArray(data.rates) && data.rates.length > 0 ? data.rates[0] : null,
        })

        if (!response.ok) {
          throw new Error(`Error fetching rates: ${response.status}`)
        }

        if (data.error) {
          throw new Error(data.error)
        }

        // Ensure rates is an array
        if (Array.isArray(data.rates)) {
          console.log(`Setting ${data.rates.length} rates`)
          setRates(data.rates)
        } else {
          console.error("data.rates is not an array:", data.rates)
          setRates([])
        }
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
    console.log("Manual refresh triggered")
    setRefreshKey((prev) => prev + 1)
    toast({
      title: "Refreshing data",
      description: "Fetching the latest rental rates...",
    })
  }

  // Function to directly check the database
  const checkDatabase = async () => {
    try {
      console.log("Checking database directly")
      const response = await fetch("/api/check-rental-rates")
      const data = await response.json()
      console.log("Database check result:", data)

      toast({
        title: "Database Check",
        description: `Found ${data.count || 0} rates in database`,
      })

      // Refresh after check
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error checking database:", error)
      toast({
        title: "Database Check Failed",
        description: "Could not check database directly",
        variant: "destructive",
      })
    }
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
          <Button variant="outline" onClick={checkDatabase}>
            Check DB
          </Button>
          <Button asChild>
            <Link href="/admin/rate-and-policies/rental-rates/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Link>
          </Button>
        </div>
      </div>

      {debugInfo && (
        <div className="p-4 border rounded-md bg-slate-50 text-xs font-mono">
          <details>
            <summary className="cursor-pointer">Debug Info (Click to expand)</summary>
            <pre className="mt-2 overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
          </details>
        </div>
      )}

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
