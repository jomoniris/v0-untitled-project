"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RentalRatesTable } from "@/components/rental-rates-table"
import Link from "next/link"
import { AlertCircle, RefreshCw, Database } from "lucide-react"

export default function RentalRatesPage() {
  const [rates, setRates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const [connectionInfo, setConnectionInfo] = useState<any>(null)

  const fetchRates = async () => {
    console.log("Fetching rental rates...")
    setLoading(true)
    setError(null)
    setErrorDetails(null)
    setConnectionInfo(null)

    try {
      console.log("Sending request to /api/rental-rates")
      const response = await fetch("/api/rental-rates")
      console.log("Response received:", response.status, response.statusText)

      // Read the response body
      const text = await response.text()
      console.log("Response text (first 100 chars):", text.substring(0, 100))

      let data
      try {
        // Try to parse the response as JSON
        data = JSON.parse(text)
        console.log("Parsed JSON data:", data)
      } catch (e) {
        console.error("Failed to parse response as JSON:", e)
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`)
      }

      if (!response.ok) {
        console.error("Response not OK:", response.status, data)
        setErrorDetails(data)
        throw new Error(`Error fetching rates: ${response.status} - ${data.error || "Unknown error"}`)
      }

      if (data.error) {
        console.error("Error in response data:", data.error, data.details)
        setErrorDetails(data)
        throw new Error(data.error)
      }

      // Save connection info if available
      if (data.connectionInfo) {
        setConnectionInfo(data.connectionInfo)
      }

      // Ensure rates is an array
      const ratesArray = Array.isArray(data.rates) ? data.rates : []
      console.log("Setting rates array:", ratesArray.length, "items")
      setRates(ratesArray)
    } catch (error) {
      console.error("Error in fetchRates:", error)
      setError(error.message || "Failed to fetch rental rates")
      setErrorDetails(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  return (
    <div className="space-y-4 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rental Rates</h1>
        <div className="flex space-x-2">
          {connectionInfo && (
            <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded flex items-center">
              <Database className="h-3 w-3 mr-1" />
              {connectionInfo.type} ({connectionInfo.duration}ms)
            </div>
          )}
          <Link href="/admin/rate-and-policies/rental-rates/new">
            <Button>Add New Rate</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Manage Rental Rates</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="font-semibold">Error</p>
              </div>
              <p className="text-sm mb-2">{error}</p>
              {errorDetails && (
                <div className="text-xs bg-red-100 p-2 rounded mb-2 overflow-auto max-h-32">
                  <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
                </div>
              )}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={fetchRates} className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/api/test-db", "_blank")}
                  className="flex items-center"
                >
                  Test DB Connection
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : rates.length === 0 ? (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground">
                No rental rates found. Create your first rate by clicking the "Add Rate" button.
              </p>
            </div>
          ) : (
            <RentalRatesTable rates={rates} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
