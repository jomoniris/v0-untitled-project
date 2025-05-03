import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { RentalRatesTable } from "@/components/rental-rates-table"

export default function RentalRatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Rates</h1>
          <p className="text-muted-foreground">Manage rental rates for different vehicle groups and periods</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/rate-and-policies/rental-rates/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Rates</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Rental Rates</CardTitle>
              <CardDescription>View and manage all rental rates</CardDescription>
            </CardHeader>
            <CardContent>
              <RentalRatesTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
