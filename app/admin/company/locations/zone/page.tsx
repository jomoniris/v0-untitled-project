import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ZoneTable } from "@/components/zone-table"
import { Plus, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function ZonePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zones</h1>
          <p className="text-muted-foreground">Manage location zones for your rental business</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/company/locations">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Locations
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground flex items-center">
              <Link href="/admin/company" className="hover:underline">
                Company
              </Link>
              <span className="mx-2">/</span>
              <Link href="/admin/company/locations" className="hover:underline">
                Locations
              </Link>
              <span className="mx-2">/</span>
              <span>Zones</span>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/company/locations/zone/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Zone
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zone Management</CardTitle>
          <CardDescription>View and manage zones for your rental locations</CardDescription>
        </CardHeader>
        <CardContent>
          <ZoneTable />
        </CardContent>
      </Card>
    </div>
  )
}
