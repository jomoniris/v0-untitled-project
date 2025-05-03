import { VehiclesTable } from "@/components/vehicles-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">Manage your fleet of rental vehicles</p>
        </div>
        <Link href="/admin/vehicles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Link>
      </div>
      <VehiclesTable />
    </div>
  )
}
