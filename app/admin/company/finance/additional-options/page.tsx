"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { AdditionalOptionsTable } from "@/components/additional-options-table"
import { useToast } from "@/components/ui/use-toast"

export default function AdditionalOptionsPage() {
  const { toast } = useToast()
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOptions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/additional-options")

      if (!response.ok) {
        throw new Error(`Error fetching additional options: ${response.status}`)
      }

      const data = await response.json()
      setOptions(data.options || [])
    } catch (err) {
      console.error("Failed to fetch additional options:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load additional options. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOptions()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Additional Options</h1>
          <p className="text-muted-foreground">Manage additional options for rentals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOptions} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/company/finance/additional-options/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-muted-foreground">Loading additional options...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center border rounded-md border-destructive">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={fetchOptions} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <AdditionalOptionsTable options={options} />
      )}
    </div>
  )
}
