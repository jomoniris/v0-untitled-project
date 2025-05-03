"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock API function to get option data
async function getOptionById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const options = [
    {
      id: "1",
      code: "GPS",
      description: "GPS Navigation System",
      optionType: "Equipment",
      calculationType: "Daily",
      excessWeight: 2,
      limitationType: "None",
      minimumCharge: 10,
      maximumCharge: 50,
      replacementFee: 150,
      nominalAccount: "EQ-GPS-001",
      active: true,
      mandatorySurcharge: false,
      multipleItems: true,
      primaryTaxExempt: false,
      secondaryTaxExempt: false,
      preventPriceChange: false,
      leasing: false,
      commissionRate: 5,
      printText: "GPS Navigation System",
      printMemo: "Please return the GPS unit with all accessories.",
    },
    {
      id: "2",
      code: "WIFI",
      description: "Mobile WiFi Hotspot",
      optionType: "Equipment",
      calculationType: "Daily",
      excessWeight: 1,
      limitationType: "Weekly",
      minimumCharge: 5,
      maximumCharge: 35,
      replacementFee: 100,
      nominalAccount: "EQ-WIFI-001",
      active: true,
      mandatorySurcharge: false,
      multipleItems: false,
      primaryTaxExempt: true,
      secondaryTaxExempt: true,
      preventPriceChange: true,
      leasing: false,
      commissionRate: 0,
      printText: "Mobile WiFi Hotspot",
      printMemo: "Unlimited data for the duration of your rental.",
    },
  ]

  return options.find((option) => option.id === id)
}

export default function ViewAdditionalOptionPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [option, setOption] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOption() {
      try {
        const data = await getOptionById(id)
        if (data) {
          setOption(data)
        } else {
          setError("Option not found")
        }
      } catch (err) {
        setError("Failed to load option data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadOption()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Option Details</h1>
          <p className="text-muted-foreground">Loading option data...</p>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{option.description}</h1>
          <p className="text-muted-foreground">
            {option.code} - {option.optionType}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/company/finance/additional-options">Back to Options</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/company/finance/additional-options/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Option
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Option Details</CardTitle>
          <CardDescription>View detailed information about this additional option</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="settings">Additional Settings</TabsTrigger>
              <TabsTrigger value="print">Print Options</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">General</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Code:</dt>
                      <dd>{option.code}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Description:</dt>
                      <dd>{option.description}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Option Type:</dt>
                      <dd>{option.optionType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Calculation Type:</dt>
                      <dd>{option.calculationType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Excess Weight:</dt>
                      <dd>{option.excessWeight}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Mandatory Surcharge:</dt>
                      <dd>{option.mandatorySurcharge ? "Yes" : "No"}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Pricing</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Limitation Type:</dt>
                      <dd>{option.limitationType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Minimum Charge:</dt>
                      <dd>${option.minimumCharge?.toFixed(2) || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Maximum Charge:</dt>
                      <dd>${option.maximumCharge?.toFixed(2) || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Replacement Fee:</dt>
                      <dd>${option.replacementFee?.toFixed(2) || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Nominal Account:</dt>
                      <dd>{option.nominalAccount || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Status:</dt>
                      <dd>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            option.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {option.active ? "Active" : "Inactive"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>

            {/* Additional Settings Tab */}
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <Separator className="my-2" />
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Multiple Items:</dt>
                    <dd>{option.multipleItems ? "Yes" : "No"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Primary Tax Exempt:</dt>
                    <dd>{option.primaryTaxExempt ? "Yes" : "No"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Secondary Tax Exempt:</dt>
                    <dd>{option.secondaryTaxExempt ? "Yes" : "No"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Prevent Price Change:</dt>
                    <dd>{option.preventPriceChange ? "Yes" : "No"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Leasing:</dt>
                    <dd>{option.leasing ? "Yes" : "No"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Commission Rate:</dt>
                    <dd>{option.commissionRate !== undefined ? `${option.commissionRate}%` : "N/A"}</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>

            {/* Print Options Tab */}
            <TabsContent value="print" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Print Information</h3>
                <Separator className="my-2" />
                <dl className="space-y-4">
                  <div>
                    <dt className="font-medium text-muted-foreground mb-1">Print Text:</dt>
                    <dd className="bg-muted p-2 rounded">{option.printText || "N/A"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground mb-1">Print Memo:</dt>
                    <dd className="bg-muted p-2 rounded whitespace-pre-wrap">{option.printMemo || "N/A"}</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link href={`/admin/company/finance/additional-options/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Option
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
