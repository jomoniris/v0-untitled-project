import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ReportsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue for the current year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Revenue chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Rental Trends</CardTitle>
          <CardDescription>Number of rentals per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Rental trends chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
