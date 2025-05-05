"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { RentalRatesTable } from "@/components/rental-rates-table"
import { getRentalRates } from "@/app/actions/rental-rate-actions"

export default function RentalRatesPage() {
  const [tabValue, setTabValue] = useState("all")
  const [rates, setRates] = useState([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true)
        const result = await getRentalRates(tabValue)
        if (result.error) {
          setError(result.error)
          setRates([])
        } else {
          setRates(result.rates || [])
          setError(null)
        }
      } catch (err) {
        console.error("Error fetching rates:", err)
        setError("Failed to load rental rates. Please try again.")
        setRates([])
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [tabValue])

  const handleTabChange = (value: string) => {
    setTabValue(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Rates</h1>
          <p className="text-muted-foreground">Manage rental rates for different vehicle groups and periods</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/rate-and-policies/rental-rates/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={tabValue} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Rates</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value={tabValue} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {tabValue === "active" ? "Active" : tabValue === "inactive" ? "Inactive" : "All"} Rental Rates
              </CardTitle>
              <CardDescription>
                View and manage {tabValue === "active" ? "active" : tabValue === "inactive" ? "inactive" : "all"} rental
                rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Loading rental rates...</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <RentalRatesTable rates={rates} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
