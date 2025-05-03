"use client"

import { TabsContent } from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Update the mock data to include common additional options
async function getRateById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const rates = [
    {
      id: "1",
      rateName: "Summer 2023 Special",
      pickupStartDate: "2023-06-01",
      pickupEndDate: "2023-09-30",
      rateZone: "NYC-DOWNTOWN",
      bookingStartDate: "2023-05-01",
      bookingEndDate: "2023-09-15",
      active: true,
      carGroupRates: [
        {
          groupId: "1",
          groupName: "Economy",
          milesPerDay: 150,
          milesRate: 0.25,
          depositRateCDW: 500,
          policyValueCDW: 25.5,
          depositRatePAI: 300,
          policyValuePAI: 15.75,
          depositRateSCDW: 200,
          policyValueSCDW: 35.0,
          depositRateCPP: 100,
          policyValueCPP: 10.25,
          deliveryCharges: 50,
          ratePackage: {
            type: "daily",
            dailyRates: [
              45, 43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23, 21, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
              18, 18, 18, 18,
            ],
          },
          included: true,
        },
        {
          groupId: "2",
          groupName: "Compact",
          milesPerDay: 200,
          milesRate: 0.2,
          depositRateCDW: 600,
          policyValueCDW: 30.0,
          depositRatePAI: 350,
          policyValuePAI: 18.5,
          depositRateSCDW: 250,
          policyValueSCDW: 40.0,
          depositRateCPP: 120,
          policyValueCPP: 12.75,
          deliveryCharges: 60,
          ratePackage: {
            type: "weekly",
            weeklyRate: 299.99,
          },
          included: true,
        },
        {
          groupId: "6",
          groupName: "Premium",
          milesPerDay: 250,
          milesRate: 0.18,
          depositRateCDW: 800,
          policyValueCDW: 45.0,
          depositRatePAI: 450,
          policyValuePAI: 25.0,
          depositRateSCDW: 350,
          policyValueSCDW: 55.0,
          depositRateCPP: 150,
          policyValueCPP: 18.5,
          deliveryCharges: 75,
          ratePackage: {
            type: "monthly",
            monthlyRate: 1299.99,
          },
          included: true,
        },
      ],
      additionalOptions: [
        {
          id: "1",
          code: "GPS",
          description: "GPS Navigation System",
          optionType: "Equipment",
          calculationType: "Daily",
          included: true,
          customerPays: true,
        },
        {
          id: "3",
          code: "CSEAT",
          description: "Child Safety Seat",
          optionType: "Equipment",
          calculationType: "Rental",
          included: true,
          customerPays: false,
        },
        {
          id: "5",
          code: "ROADSIDE",
          description: "Roadside Assistance",
          optionType: "Service",
          calculationType: "Rental",
          included: true,
          customerPays: true,
        },
      ],
    },
    {
      id: "2",
      rateName: "Winter 2023 Promotion",
      pickupStartDate: "2023-12-01",
      pickupEndDate: "2024-02-28",
      rateZone: "NYC-MIDTOWN",
      bookingStartDate: "2023-11-01",
      bookingEndDate: "2024-02-15",
      active: true,
      carGroupRates: [
        {
          groupId: "1",
          groupName: "Economy",
          milesPerDay: 120,
          milesRate: 0.3,
          depositRateCDW: 450,
          policyValueCDW: 22.5,
          depositRatePAI: 250,
          policyValuePAI: 12.25,
          depositRateSCDW: 180,
          policyValueSCDW: 30.0,
          depositRateCPP: 90,
          policyValueCPP: 8.75,
          deliveryCharges: 45,
          ratePackage: {
            type: "daily",
            dailyRates: [
              40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
              15, 15, 15, 15,
            ],
          },
          included: true,
        },
        {
          groupId: "8",
          groupName: "SUV",
          milesPerDay: 180,
          milesRate: 0.25,
          depositRateCDW: 700,
          policyValueCDW: 40.0,
          depositRatePAI: 400,
          policyValuePAI: 22.5,
          depositRateSCDW: 300,
          policyValueSCDW: 50.0,
          depositRateCPP: 130,
          policyValueCPP: 15.25,
          deliveryCharges: 65,
          ratePackage: {
            type: "yearly",
            yearlyRate: 9999.99,
          },
          included: true,
        },
      ],
      additionalOptions: [
        {
          id: "2",
          code: "WIFI",
          description: "Mobile WiFi Hotspot",
          optionType: "Equipment",
          calculationType: "Daily",
          included: true,
          customerPays: true,
        },
        {
          id: "4",
          code: "INSUR",
          description: "Additional Insurance",
          optionType: "Insurance",
          calculationType: "Daily",
          included: true,
          customerPays: false,
        },
      ],
    },
  ]

  return rates.find((rate) => rate.id === id)
}

export default function ViewRentalRatePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [rate, setRate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("rate-info")

  useEffect(() => {
    async function loadRate() {
      try {
        const data = await getRateById(id)
        if (data) {
          setRate(data)
          if (data.carGroupRates.length > 0) {
            setSelectedGroup(data.carGroupRates[0].groupId)
          }
        } else {
          setError("Rate not found")
        }
      } catch (err) {
        setError("Failed to load rate data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRate()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Rate Details</h1>
          <p className="text-muted-foreground">Loading rate data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const selectedGroupData = rate.carGroupRates.find((group: any) => group.groupId === selectedGroup)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{rate.rateName}</h1>
          <p className="text-muted-foreground">
            {new Date(rate.pickupStartDate).toLocaleDateString()} - {new Date(rate.pickupEndDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/rate-and-policies/rental-rates">Back to Rates</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/rate-and-policies/rental-rates/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Rate
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rate Details</CardTitle>
          <CardDescription>View detailed information about this rental rate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rate-info">Rate Information</TabsTrigger>
              <TabsTrigger value="additional-options">Additional Options</TabsTrigger>
            </TabsList>

            {/* Rate Information Tab */}
            <TabsContent value="rate-info" className="space-y-6">
              {/* Rate Information */}
              <div>
                <h3 className="text-lg font-medium">Basic Information</h3>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Rate Name:</dt>
                      <dd>{rate.rateName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Rate Zone:</dt>
                      <dd>{rate.rateZone}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Status:</dt>
                      <dd>
                        <Badge variant={rate.active ? "default" : "secondary"}>
                          {rate.active ? "Active" : "Inactive"}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Pickup Period:</dt>
                      <dd>
                        {new Date(rate.pickupStartDate).toLocaleDateString()} -{" "}
                        {new Date(rate.pickupEndDate).toLocaleDateString()}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Booking Period:</dt>
                      <dd>
                        {new Date(rate.bookingStartDate).toLocaleDateString()} -{" "}
                        {new Date(rate.bookingEndDate).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Car Group Rates */}
              <div>
                <h3 className="text-lg font-medium">Car Group Rates</h3>
                <Separator className="my-2" />

                <div className="mb-4">
                  <Tabs
                    value={selectedGroup || ""}
                    onValueChange={(value) => setSelectedGroup(value)}
                    className="w-full"
                  >
                    <TabsList className="w-full flex flex-wrap h-auto">
                      {rate.carGroupRates
                        .filter((group: any) => group.included)
                        .map((group: any) => (
                          <TabsTrigger key={group.groupId} value={group.groupId} className="flex-grow">
                            {group.groupName}
                          </TabsTrigger>
                        ))}
                    </TabsList>
                  </Tabs>
                </div>

                {selectedGroupData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Basic Information</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">Miles Per Day:</dt>
                            <dd>{selectedGroupData.milesPerDay}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">Miles Rate:</dt>
                            <dd>${selectedGroupData.milesRate.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">Delivery Charges:</dt>
                            <dd>${selectedGroupData.deliveryCharges.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">Rate Type:</dt>
                            <dd>
                              <Badge variant="outline" className="capitalize">
                                {selectedGroupData.ratePackage.type}
                              </Badge>
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Insurance Information</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">CDW Deposit:</dt>
                            <dd>${selectedGroupData.depositRateCDW.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">CDW Policy:</dt>
                            <dd>${selectedGroupData.policyValueCDW.toFixed(2)}</dd>
                          </div>

                          <div className="flex justify-between mt-4">
                            <dt className="font-medium text-muted-foreground">PAI Deposit:</dt>
                            <dd>${selectedGroupData.depositRatePAI.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">PAI Policy:</dt>
                            <dd>${selectedGroupData.policyValuePAI.toFixed(2)}</dd>
                          </div>

                          <div className="flex justify-between mt-4">
                            <dt className="font-medium text-muted-foreground">SCDW Deposit:</dt>
                            <dd>${selectedGroupData.depositRateSCDW.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">SCDW Policy:</dt>
                            <dd>${selectedGroupData.policyValueSCDW.toFixed(2)}</dd>
                          </div>

                          <div className="flex justify-between mt-4">
                            <dt className="font-medium text-muted-foreground">CPP Deposit:</dt>
                            <dd>${selectedGroupData.depositRateCPP.toFixed(2)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium text-muted-foreground">CPP Policy:</dt>
                            <dd>${selectedGroupData.policyValueCPP.toFixed(2)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Rate Package Section */}
                    <div>
                      <h4 className="font-medium mb-2">Rate Package</h4>

                      {selectedGroupData.ratePackage.type === "daily" && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Daily Rates</h5>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {selectedGroupData.ratePackage.dailyRates.map((rate: number, index: number) => (
                              <div key={index} className="flex justify-between p-2 border rounded">
                                <span className="font-medium text-muted-foreground">Day {index + 1}:</span>
                                <span>${rate.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedGroupData.ratePackage.type === "weekly" && (
                        <div className="p-4 border rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">Weekly Rate:</span>
                            <span className="text-lg font-bold">
                              ${selectedGroupData.ratePackage.weeklyRate.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedGroupData.ratePackage.type === "monthly" && (
                        <div className="p-4 border rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">Monthly Rate:</span>
                            <span className="text-lg font-bold">
                              ${selectedGroupData.ratePackage.monthlyRate.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      {selectedGroupData.ratePackage.type === "yearly" && (
                        <div className="p-4 border rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">Yearly Rate:</span>
                            <span className="text-lg font-bold">
                              ${selectedGroupData.ratePackage.yearlyRate.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Additional Options Tab */}
            <TabsContent value="additional-options" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Additional Options</h3>
                <p className="text-sm text-muted-foreground mb-4">These options apply to all car groups in this rate</p>

                {rate.additionalOptions && rate.additionalOptions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Option Type</TableHead>
                          <TableHead>Calculation</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rate.additionalOptions
                          .filter((option: any) => option.included)
                          .map((option: any) => (
                            <TableRow key={option.id}>
                              <TableCell className="font-medium">{option.code}</TableCell>
                              <TableCell>{option.description}</TableCell>
                              <TableCell>{option.optionType}</TableCell>
                              <TableCell>{option.calculationType}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Included
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {option.customerPays ? (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    Customer Pays
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                                  >
                                    Complimentary
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center border rounded-md">
                    <p className="text-muted-foreground">No additional options included in this rate.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link href={`/admin/rate-and-policies/rental-rates/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Rate
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
