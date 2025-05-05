"use client"

import { Button } from "@/components/ui/button"
import { VehicleGroupTable } from "@/components/vehicle-group-table"
import { PlusCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getVehicleGroupsData } from "@/app/actions/vehicle-group-data"
import type { VehicleGroup } from "@/app/actions/vehicle-group-actions"

export default function VehicleGroupPage() {
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<VehicleGroup[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const { groups, error } = await getVehicleGroupsData()
        setGroups(groups)
        setError(error)
      } catch (err) {
        console.error("Failed to load vehicle groups:", err)
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Groups</h1>
          <p className="text-muted-foreground">Manage your vehicle groups and their specifications</p>
        </div>
        <Button asChild>
          <Link href="/admin/company/fleet/vehicle-group/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Group
          </Link>
        </Button>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <VehicleGroupTable initialGroups={groups} />
      )}
    </div>
  )
}
