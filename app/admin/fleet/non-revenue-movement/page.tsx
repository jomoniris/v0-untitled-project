import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NonRevenueMovementTable } from "@/components/non-revenue-movement-table"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Non Revenue Movement",
  description: "Manage vehicle movements that don't generate revenue",
}

export default function NonRevenueMovementPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Non Revenue Movement</h1>
        <Link href="/admin/fleet/non-revenue-movement/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Movement
          </Button>
        </Link>
      </div>

      <p className="text-muted-foreground mb-6">
        Manage and track vehicle movements that don't generate revenue, such as transfers between locations, maintenance
        trips, and other operational movements.
      </p>

      <NonRevenueMovementTable />
    </div>
  )
}
