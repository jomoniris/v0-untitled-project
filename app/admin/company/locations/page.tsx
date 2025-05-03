import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Plus } from "lucide-react"
import { LocationsTable } from "@/components/locations-table"

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">Manage your rental locations and zones</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/company/locations/zone">
              <MapPin className="mr-2 h-4 w-4" />
              Manage Zones
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/company/locations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Locations</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Rental Locations</CardTitle>
              <CardDescription>View and manage all your rental locations</CardDescription>
            </CardHeader>
            <CardContent>
              <LocationsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
