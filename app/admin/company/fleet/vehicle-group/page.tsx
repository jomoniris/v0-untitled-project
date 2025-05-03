import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { VehicleGroupTable } from "@/components/vehicle-group-table"

export default function VehicleGroupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Groups</h1>
          <p className="text-muted-foreground">Manage vehicle groups for your rental fleet</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/company/fleet/vehicle-group/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle Group
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicle Groups</CardTitle>
          <CardDescription>View and manage all vehicle groups in your fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleGroupTable />
        </CardContent>
      </Card>
    </div>
  )
}
