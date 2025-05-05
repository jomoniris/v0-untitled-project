"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet and maintenance</p>
        </div>
        <Button asChild>
          <Link href="/admin/vehicles/new">Add Vehicle</Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <h3 className="text-sm font-medium mb-3">Fleet Management</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/vehicles"
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span>Vehicles</span>
          </Link>
          <Link
            href="/admin/company/fleet/vehicle-group"
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span>Vehicle Groups</span>
          </Link>
          <Link
            href="/admin/fleet/utilization"
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span>Utilization</span>
          </Link>
          <Link
            href="/admin/fleet/settings"
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Fleet Overview Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-bold">42</h3>
            <p className="text-xs text-muted-foreground">Total Vehicles</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-bold">36</h3>
            <p className="text-xs text-muted-foreground">Available Vehicles</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-bold">85.7%</h3>
            <p className="text-xs text-muted-foreground">Fleet Utilization</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mt-8">Vehicle List</h2>
      <div className="rounded-md border p-4">
        <p className="text-center text-muted-foreground">
          Vehicle list is temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  )
}
