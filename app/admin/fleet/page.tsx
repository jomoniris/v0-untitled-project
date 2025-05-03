import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { VehiclesTable } from "@/components/vehicles-table"
import { FleetMenu } from "@/components/fleet-menu"
import Link from "next/link"

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet and maintenance</p>
        </div>
        <Button asChild>
          <Link href="/admin/vehicles/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      <FleetMenu />

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
      <VehiclesTable />
    </div>
  )
}
