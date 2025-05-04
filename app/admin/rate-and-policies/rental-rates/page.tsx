import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { RentalRatesTable } from "@/components/rental-rates-table"
import { getRentalRates } from "@/app/actions/rental-rate-actions"

export default async function RentalRatesPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const tab = searchParams.tab || "all"
  const { rates, error } = await getRentalRates(tab)

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

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/admin/rate-and-policies/rental-rates?tab=all">All Rates</Link>
          </TabsTrigger>
          <TabsTrigger value="active" asChild>
            <Link href="/admin/rate-and-policies/rental-rates?tab=active">Active</Link>
          </TabsTrigger>
          <TabsTrigger value="inactive" asChild>
            <Link href="/admin/rate-and-policies/rental-rates?tab=inactive">Inactive</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {tab === "active" ? "Active" : tab === "inactive" ? "Inactive" : "All"} Rental Rates
              </CardTitle>
              <CardDescription>
                View and manage {tab === "active" ? "active" : tab === "inactive" ? "inactive" : "all"} rental rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="p-4 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <RentalRatesTable rates={rates || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
