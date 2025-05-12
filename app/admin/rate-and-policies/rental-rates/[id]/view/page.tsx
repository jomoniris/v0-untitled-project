import { getRentalRateById } from "@/app/actions/rental-rate-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface PageParams {
  id: string
}

export default async function ViewRentalRatePage({
  params,
}: {
  params: PageParams
}) {
  try {
    // Access the ID safely
    const id = params?.id

    if (!id) {
      console.error("No ID provided in params")
      notFound()
    }

    // Fetch the rental rate to view
    const { rate, error } = await getRentalRateById(id)

    if (error || !rate) {
      console.error("Error fetching rental rate:", error)
      notFound()
    }

    // Format dates for display
    const formatDate = (dateString: string | null | undefined) => {
      if (!dateString) return "N/A"
      return new Date(dateString).toLocaleDateString()
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Rate details and validity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate ID</p>
                <p>{rate.rateId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate Zone</p>
                <p>{rate.rateZone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      rate.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rate.active ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pickup Period</p>
                <p>
                  {formatDate(rate.pickupStartDate)} - {formatDate(rate.pickupEndDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Booking Period</p>
                <p>
                  {formatDate(rate.bookingStartDate)} - {formatDate(rate.bookingEndDate)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Car Group Rates */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Car Group Rates</CardTitle>
              <CardDescription>Rates for different car groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rate.carGroupRates && rate.carGroupRates.length > 0 ? (
                  rate.carGroupRates
                    .filter((group) => group.included)
                    .map((group) => (
                      <div key={group.groupId} className="border rounded-md p-4">
                        <h3 className="text-lg font-semibold mb-2">{group.groupName}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Miles Per Day</p>
                            <p>{group.milesPerDay}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Miles Rate</p>
                            <p>{formatCurrency(group.milesRate)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Rate Type</p>
                            <p className="capitalize">{group.ratePackage.type}</p>
                          </div>
                        </div>

                        {/* Rate Package Details */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Rate Package</h4>
                          {group.ratePackage.type === "daily" && group.ratePackage.dailyRates && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {group.ratePackage.dailyRates.slice(0, 7).map((rate, index) =>
                                rate > 0 ? (
                                  <div key={index}>
                                    <p className="text-xs text-muted-foreground">Day {index + 1}</p>
                                    <p>{formatCurrency(rate)}</p>
                                  </div>
                                ) : null,
                              )}
                              {group.ratePackage.dailyRates.slice(7).some((rate) => rate > 0) && (
                                <div>
                                  <p className="text-xs text-muted-foreground">More days...</p>
                                </div>
                              )}
                            </div>
                          )}

                          {group.ratePackage.type === "weekly" && (
                            <div>
                              <p className="text-xs text-muted-foreground">Weekly Rate</p>
                              <p>{formatCurrency(group.ratePackage.weeklyRate || 0)}</p>
                            </div>
                          )}

                          {group.ratePackage.type === "monthly" && (
                            <div>
                              <p className="text-xs text-muted-foreground">Monthly Rate</p>
                              <p>{formatCurrency(group.ratePackage.monthlyRate || 0)}</p>
                            </div>
                          )}

                          {group.ratePackage.type === "yearly" && (
                            <div>
                              <p className="text-xs text-muted-foreground">Yearly Rate</p>
                              <p>{formatCurrency(group.ratePackage.yearlyRate || 0)}</p>
                            </div>
                          )}
                        </div>

                        {/* Insurance Rates */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Insurance Rates</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">CDW Deposit</p>
                              <p>{formatCurrency(group.depositRateCDW)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">CDW Policy</p>
                              <p>{formatCurrency(group.policyValueCDW)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">PAI Deposit</p>
                              <p>{formatCurrency(group.depositRatePAI)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">PAI Policy</p>
                              <p>{formatCurrency(group.policyValuePAI)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">SCDW Deposit</p>
                              <p>{formatCurrency(group.depositRateSCDW)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">SCDW Policy</p>
                              <p>{formatCurrency(group.policyValueSCDW)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">CPP Deposit</p>
                              <p>{formatCurrency(group.depositRateCPP)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">CPP Policy</p>
                              <p>{formatCurrency(group.policyValueCPP)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Charges */}
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Additional Charges</h4>
                          <div>
                            <p className="text-xs text-muted-foreground">Delivery Charges</p>
                            <p>{formatCurrency(group.deliveryCharges)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No car group rates defined for this rate.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
              <CardDescription>Options included in this rate</CardDescription>
            </CardHeader>
            <CardContent>
              {rate.additionalOptions && rate.additionalOptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rate.additionalOptions
                    .filter((option) => option.included)
                    .map((option) => (
                      <div key={option.id} className="border rounded-md p-4">
                        <h3 className="font-medium">{option.description}</h3>
                        <p className="text-sm text-muted-foreground">Code: {option.code}</p>
                        <p className="text-sm mt-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              option.customerPays ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {option.customerPays ? "Customer Pays" : "Included in Rate"}
                          </span>
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No additional options included in this rate.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in ViewRentalRatePage:", error)
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <h2 className="text-lg font-semibold">Error Loading Rental Rate</h2>
          <p>There was a problem loading the rental rate. Please try again or contact support.</p>
        </div>
      </div>
    )
  }
}
