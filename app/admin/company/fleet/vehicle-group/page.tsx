"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function VehicleGroupPage() {
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

      <div className="p-8 text-center border rounded-md">
        <p className="text-muted-foreground">
          Vehicle groups will appear here once the database is properly configured.
        </p>
      </div>
    </div>
  )
}
