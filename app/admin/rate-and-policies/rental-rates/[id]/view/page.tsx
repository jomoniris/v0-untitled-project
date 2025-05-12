import { getRentalRateById } from "@/app/actions/rental-rate-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ViewRentalRatePageProps {
  params: {
    id: string
  }
}

export default async function ViewRentalRatePage({ params }: ViewRentalRatePageProps) {
  // Use the id directly from params without destructuring
  const id = params.id

  console.log("Fetching rental rate for view, ID:", id)

  // Fetch the rental rate to view
  const { rate, error } = await getRentalRateById(id)

  if (error || !rate) {
    console.error("Error fetching rental rate:", error)
    notFound()
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{rate.rateName}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/rate-and-policies/rental-rates">Back to Rates</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/rate-and-policies/rental-rates/${id}/edit`}>Edit Rate</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rate Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Rate ID:</dt>
                <dd>{rate.rateId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Status:</dt>
                <dd>
                  <Badge variant={rate.active ? "default" : "secondary"}>{rate.active ? "Active" : "Inactive"}</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Rate Zone:</dt>
                <dd>{rate.rateZone}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pickup Period</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Start Date:</dt>
                <dd>{formatDate(rate.pickupStartDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">End Date:</dt>
                <dd>{formatDate(rate.pickupEndDate)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Booking Period</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Start Date:</dt>
                <dd>{formatDate(rate.bookingStartDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">End Date:</dt>
                <dd>{formatDate(rate.bookingEndDate)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="car-groups" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="car-groups">Car Group Rates</TabsTrigger>
          <TabsTrigger value="additional-options">Additional Options</TabsTrigger>
        </TabsList>

        <TabsContent value="car-groups" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Car Group Rates</CardTitle>
              <CardDescription>Rates for each car group included in this rate</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car Group</TableHead>
                    <TableHead>Rate Type</TableHead>
                    <TableHead>Miles/Day</TableHead>
                    <TableHead>Miles Rate</TableHead>
                    <TableHead>Delivery Charges</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rate.carGroupRates
                    .filter((group) => group.included)
                    .map((group) => (
                      <TableRow key={group.groupId}>
                        <TableCell className="font-medium">{group.groupName}</TableCell>
                        <TableCell className="capitalize">{group.ratePackage.type}</TableCell>
                        <TableCell>{group.milesPerDay}</TableCell>
                        <TableCell>{formatCurrency(group.milesRate)}</TableCell>
                        <TableCell>{formatCurrency(group.deliveryCharges)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Detailed rates for each car group */}
          {rate.carGroupRates
            .filter((group) => group.included)
            .map((group) => (
              <Card key={`${group.groupId}-details`}>
                <CardHeader>
                  <CardTitle>{group.groupName} - Detailed Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Insurance Rates</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Insurance Type</TableHead>
                            <TableHead>Deposit Rate</TableHead>
                            <TableHead>Policy Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>CDW</TableCell>
                            <TableCell>{formatCurrency(group.depositRateCDW)}</TableCell>
                            <TableCell>{formatCurrency(group.policyValueCDW)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>PAI</TableCell>
                            <TableCell>{formatCurrency(group.depositRatePAI)}</TableCell>
                            <TableCell>{formatCurrency(group.policyValuePAI)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>SCDW</TableCell>
                            <TableCell>{formatCurrency(group.depositRateSCDW)}</TableCell>
                            <TableCell>{formatCurrency(group.policyValueSCDW)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>CPP</TableCell>
                            <TableCell>{formatCurrency(group.depositRateCPP)}</TableCell>
                            <TableCell>{formatCurrency(group.policyValueCPP)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Rate Package</h3>
                      {group.ratePackage.type === "daily" && group.ratePackage.dailyRates && (
                        <div>
                          <h4 className="font-medium mb-2">Daily Rates</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {group.ratePackage.dailyRates.slice(0, 10).map((rate, index) => (
                              <div key={index} className="flex justify-between">
                                <span>Day {index + 1}:</span>
                                <span>{formatCurrency(rate)}</span>
                              </div>
                            ))}
                            {group.ratePackage.dailyRates.length > 10 && (
                              <div className="col-span-full text-center text-muted-foreground">
                                ... and {group.ratePackage.dailyRates.length - 10} more days
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {group.ratePackage.type === "weekly" && (
                        <div className="flex justify-between">
                          <span>Weekly Rate:</span>
                          <span>{formatCurrency(group.ratePackage.weeklyRate || 0)}</span>
                        </div>
                      )}

                      {group.ratePackage.type === "monthly" && (
                        <div className="flex justify-between">
                          <span>Monthly Rate:</span>
                          <span>{formatCurrency(group.ratePackage.monthlyRate || 0)}</span>
                        </div>
                      )}

                      {group.ratePackage.type === "yearly" && (
                        <div className="flex justify-between">
                          <span>Yearly Rate:</span>
                          <span>{formatCurrency(group.ratePackage.yearlyRate || 0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="additional-options" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
              <CardDescription>Options included in this rate</CardDescription>
            </CardHeader>
            <CardContent>
              {rate.additionalOptions && rate.additionalOptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Customer Pays</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rate.additionalOptions
                      .filter((option) => option.included)
                      .map((option) => (
                        <TableRow key={option.id}>
                          <TableCell>{option.code}</TableCell>
                          <TableCell>{option.description}</TableCell>
                          <TableCell>{option.customerPays ? "Yes" : "No"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No additional options included in this rate.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
