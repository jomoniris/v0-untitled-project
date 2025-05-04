import { Button } from "@/components/ui/button"
import { VehicleGroupTable } from "@/components/vehicle-group-table"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getVehicleGroups } from "@/app/actions/vehicle-group-actions"

export default async function VehicleGroupPage() {
  const { groups, error } = await getVehicleGroups()

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

      <VehicleGroupTable initialGroups={groups} />
    </div>
  )
}
