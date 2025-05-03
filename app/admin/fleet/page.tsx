import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { VehiclesTable } from "@/components/vehicles-table"

export default function FleetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground">Manage your vehicle fleet and maintenance</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>
      <VehiclesTable />
    </div>
  )
}
