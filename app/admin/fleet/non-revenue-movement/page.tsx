"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { NonRevenueMovementTable } from "@/components/non-revenue-movement-table"

export default function FleetNonRevenueMovementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Non-Revenue Movement</h1>
          <p className="text-muted-foreground">Manage non-revenue vehicle movements</p>
        </div>
        <Link href="/admin/fleet/non-revenue-movement/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Movement
          </Button>
        </Link>
      </div>

      <NonRevenueMovementTable />
    </div>
  )
}
