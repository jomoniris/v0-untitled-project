import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { NRTTable } from "@/components/nrt-table"
import { NRTDashboard } from "@/components/nrt-dashboard"
import { FleetMenu } from "@/components/fleet-menu"
import Link from "next/link"

export default function NRTPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Non-Revenue Time</h1>
          <p className="text-muted-foreground">Track and manage vehicle downtime and non-revenue periods</p>
        </div>
        <Button asChild>
          <Link href="/admin/fleet/nrt/new">
            <Plus className="mr-2 h-4 w-4" />
            Add NRT Entry
          </Link>
        </Button>
      </div>

      <FleetMenu />

      <div className="space-y-6">
        <NRTDashboard />
        <h2 className="text-2xl font-bold tracking-tight">NRT Entries</h2>
        <NRTTable />
      </div>
    </div>
  )
}
