import { getRentalRateById } from "@/app/actions/rental-rate-actions"
import { getZones } from "@/app/actions/zone-actions"
import { getAdditionalOptions } from "@/app/actions/additional-option-actions"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function ViewRentalRatePage({ params }: { params: { id: string } }) {
  const { id } = params

  console.log("Fetching rental rate with ID:", id)

  // Fetch the rental rate to view
  const { rate, error } = await getRentalRateById(id)

  if (error || !rate) {
    console.error("Error fetching rental rate:", error)
    notFound()
  }

  console.log("Fetched rental rate:", rate)
  console.log("Additional options from rate:", rate.additionalOptions)

  // Fetch zones from Zone Management to get the zone name
  const { zones } = await getZones()
  const zoneMap = new Map(zones.map((zone) => [zone.code, zone.description]))

  // Get the zone name from the map
  const zoneName = zoneMap.get(rate.rateZone) || rate.rateZone

  // Fetch all additional options to ensure we have complete data
  const { options: allAdditionalOptions } = await getAdditionalOptions()
  console.log("All additional options:", allAdditionalOptions)

  // Ensure additionalOptions is always an array
  const additionalOptions = Array.isArray(rate.additionalOptions) ? rate.additionalOptions : []

  console.log("Processed additional options:", additionalOptions)

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{rate.rateName}</CardTitle>
            <CardDescription>Rate ID: {rate.rateId}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/admin/rate-and-policies/rental-rates/${id}/edit`}>Edit</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/rate-and-policies/rental-rates">Back to List</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Rate Details</TabsTrigger>
              <TabsTrigger value="car-groups">Car Groups</TabsTrigger>
              <TabsTrigger value="additional-options">Additional Options</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Rate Name</TableCell>
                        <TableCell>{rate.rateName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rate Zone</TableCell>
                        <TableCell>{zoneName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        <TableCell>
                          <Badge variant={rate.active ? "default" : "secondary"}>
                            {rate.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Date Information</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Pickup Period</TableCell>
                        <TableCell>
                          {format(new Date(rate.pickupStartDate), "MMM d, yyyy")} -{" "}
                          {format(new Date(rate.pickupEndDate), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Booking Period</TableCell>
                        <TableCell>
                          {format(new Date(rate.bookingStartDate), "MMM d, yyyy")} -{" "}
                          {format(new Date(rate.bookingEndDate), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="car-groups">
              <h3 className="text-lg font-medium mb-2">Car Group Rates</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car Group</TableHead>
                    <TableHead>Miles/Day</TableHead>
                    <TableHead>Miles Rate</TableHead>
                    <TableHead>Rate Type</TableHead>
                    <TableHead>Delivery Charges</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rate.carGroupRates &&
                    rate.carGroupRates
                      .filter((group) => group.included)
                      .map((group) => (
                        <TableRow key={group.groupId}>
                          <TableCell className="font-medium">{group.groupName}</TableCell>
                          <TableCell>{group.milesPerDay}</TableCell>
                          <TableCell>${group.milesRate.toFixed(2)}</TableCell>
                          <TableCell className="capitalize">{group.ratePackage.type}</TableCell>
                          <TableCell>${group.deliveryCharges.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                  {(!rate.carGroupRates || rate.carGroupRates.filter((group) => group.included).length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No car groups included
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="additional-options">
              <h3 className="text-lg font-medium mb-2">Additional Options</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Customer Pays</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {additionalOptions && additionalOptions.length > 0 ? (
                    additionalOptions
                      .filter((option) => option.included)
                      .map((option) => (
                        <TableRow key={option.id}>
                          <TableCell className="font-medium">{option.code}</TableCell>
                          <TableCell>{option.description}</TableCell>
                          <TableCell>{option.customerPays ? "Yes" : "No"}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No additional options included
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
