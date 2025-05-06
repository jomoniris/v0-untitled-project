"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { VehicleGroupTable } from "@/components/vehicle-group-table"
import { toast } from "@/components/ui/use-toast"

export default function VehicleGroupPage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGroups = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/vehicle-groups")

      if (!response.ok) {
        throw new Error(`Error fetching vehicle groups: ${response.status}`)
      }

      const data = await response.json()
      setGroups(data.groups || [])
    } catch (error) {
      console.error("Error fetching vehicle groups:", error)
      setError("Failed to load vehicle groups. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load vehicle groups. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Groups</h1>
          <p className="text-muted-foreground">Manage your vehicle groups and their specifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchGroups} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/admin/company/fleet/vehicle-group/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Group
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <p>Loading vehicle groups...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center border rounded-md bg-destructive/10 text-destructive">
          <p>{error}</p>
          <Button variant="outline" onClick={fetchGroups} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <VehicleGroupTable initialGroups={groups} />
      )}
    </div>
  )
}
