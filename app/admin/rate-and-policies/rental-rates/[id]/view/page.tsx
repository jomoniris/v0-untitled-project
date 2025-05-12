import { getRentalRateById } from "@/app/actions/rental-rate-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ViewRentalRatePage({ params }: { params: { id: string } }) {
  // Properly await the params by using it in an async context
  const id = params.id

  // Fetch the rental rate to view
  const { rate, error } = await getRentalRateById(id)

  if (error || !rate) {
    console.error("Error fetching rental rate:", error)
    notFound()
  }

  // Format dates for display
  const formattedRate = {
    ...rate,
    pickupStartDate: formatDateForDisplay(rate.pickupStartDate),
    pickupEndDate: formatDateForDisplay(rate.pickupEndDate),
    bookingStartDate: formatDateForDisplay(rate.bookingStartDate),
    bookingEndDate: formatDateForDisplay(rate.bookingEndDate),
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Rate Details: {formattedRate.rateName}</CardTitle>
              <CardDescription>Rate ID: {formattedRate.rateId}</CardDescription>
            </div>
            <Badge variant={formattedRate.active ? "default" : "secondary"}>
              {formattedRate.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="rate-info">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rate-info">Rate Information</TabsTrigger>
              <TabsTrigger value="additional-options">Additional Options</TabsTrigger>
            </TabsList>

            {/* Rate Information Tab */}
            <TabsContent value="rate-info" className="space-y-6">
              {/* Basic Rate Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Rate Name</h4>
                    <p className="text-sm">{formattedRate.rateName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Rate Zone</h4>
                    <p className="text-sm">{formattedRate.rateZone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Pickup Date Range</h4>
                    <p className="text-sm">
                      {formattedRate.pickupStartDate} to {formattedRate.pickupEndDate}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Booking Date Range</h4>
                    <p className="text-sm">
                      {formattedRate.bookingStartDate} to {formattedRate.bookingEndDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Car Group Rates Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Car Group Rates</h3>

                <div className="border rounded-md">
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
                      {formattedRate.carGroupRates
                        .filter((group) => group.included)
                        .map((carGroup) => (
                          <TableRow key={carGroup.groupId}>
                            <TableCell className="font-medium">{carGroup.groupName}</TableCell>
                            <TableCell>{carGroup.milesPerDay}</TableCell>
                            <TableCell>${carGroup.milesRate.toFixed(2)}</TableCell>
                            <TableCell className="capitalize">{carGroup.ratePackage.type}</TableCell>
                            <TableCell>${carGroup.deliveryCharges.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Insurance Rates */}
                <h3 className="text-lg font-medium">Insurance Rates</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Car Group</TableHead>
                        <TableHead>CDW Deposit</TableHead>
                        <TableHead>CDW Policy</TableHead>
                        <TableHead>PAI Deposit</TableHead>
                        <TableHead>PAI Policy</TableHead>
                        <TableHead>SCDW Deposit</TableHead>
                        <TableHead>SCDW Policy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formattedRate.carGroupRates
                        .filter((group) => group.included)
                        .map((carGroup) => (
                          <TableRow key={carGroup.groupId}>
                            <TableCell className="font-medium">{carGroup.groupName}</TableCell>
                            <TableCell>${carGroup.depositRateCDW.toFixed(2)}</TableCell>
                            <TableCell>${carGroup.policyValueCDW.toFixed(2)}</TableCell>
                            <TableCell>${carGroup.depositRatePAI.toFixed(2)}</TableCell>
                            <TableCell>${carGroup.policyValuePAI.toFixed(2)}</TableCell>
                            <TableCell>${carGroup.depositRateSCDW.toFixed(2)}</TableCell>
                            <TableCell>${carGroup.policyValueSCDW.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Rate Packages */}
                <h3 className="text-lg font-medium">Rate Packages</h3>
                <div className="space-y-4">
                  {formattedRate.carGroupRates
                    .filter((group) => group.included)
                    .map((carGroup) => (
                      <div key={carGroup.groupId} className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">{carGroup.groupName}</h4>
                        <p className="text-sm mb-2">Rate Type: {carGroup.ratePackage.type}</p>

                        {carGroup.ratePackage.type === "daily" && carGroup.ratePackage.dailyRates && (
                          <div>
                            <h5 className="text-sm font-medium mb-2">Daily Rates</h5>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                              {carGroup.ratePackage.dailyRates
                                .filter((rate, index) => rate > 0)
                                .map((rate, index) => (
                                  <div key={index} className="text-sm">
                                    Day {index + 1}: ${rate.toFixed(2)}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {carGroup.ratePackage.type === "weekly" && carGroup.ratePackage.weeklyRate && (
                          <div className="text-sm">Weekly Rate: ${carGroup.ratePackage.weeklyRate.toFixed(2)}</div>
                        )}

                        {carGroup.ratePackage.type === "monthly" && carGroup.ratePackage.monthlyRate && (
                          <div className="text-sm">Monthly Rate: ${carGroup.ratePackage.monthlyRate.toFixed(2)}</div>
                        )}

                        {carGroup.ratePackage.type === "yearly" && carGroup.ratePackage.yearlyRate && (
                          <div className="text-sm">Yearly Rate: ${carGroup.ratePackage.yearlyRate.toFixed(2)}</div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* Additional Options Tab */}
            <TabsContent value="additional-options" className="space-y-4">
              <h3 className="text-lg font-medium">Additional Options</h3>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Customer Pays</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formattedRate.additionalOptions && formattedRate.additionalOptions.length > 0 ? (
                      formattedRate.additionalOptions
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
                        <TableCell colSpan={3} className="text-center py-4">
                          No additional options included
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/rate-and-policies/rental-rates">Back to Rates</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/rate-and-policies/rental-rates/${id}/edit`}>Edit Rate</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Helper function to format dates for display
function formatDateForDisplay(dateString: string | null | undefined): string {
  if (!dateString) return "N/A"

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date for display:", error)
    return dateString || "N/A"
  }
}
