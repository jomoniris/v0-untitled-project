"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

// Mock API function to get vehicle group data
async function getVehicleGroupById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const groups = [
    {
      id: "1",
      code: "ECON",
      description: "Economy",
      sipCode: "ECAR",
      class: "Economy",
      autoAllocate: true,
      fuelType: "Petrol",
      tankCapacity: 45,
      doors: 4,
      suitcases: 1,
      pax: 5,
      bags: 1,
      minAge: 21,
      youngDriverLimit: 25,
      maxAgeLimit: 75,
      drivingYears: 2,
      seniorLimit: 70,
      upgradeMode: "Automatic",
      alternateGroups: "Compact",
      image: "/urban-civic-night.png",
    },
    {
      id: "2",
      code: "COMP",
      description: "Compact",
      sipCode: "CCAR",
      class: "Compact",
      autoAllocate: true,
      fuelType: "Petrol",
      tankCapacity: 50,
      doors: 4,
      suitcases: 2,
      pax: 5,
      bags: 2,
      minAge: 21,
      youngDriverLimit: 25,
      maxAgeLimit: 75,
      drivingYears: 2,
      seniorLimit: 70,
      upgradeMode: "Automatic",
      alternateGroups: "Midsize",
      image: "/urban-rav4-adventure.png",
    },
  ]

  return groups.find((group) => group.id === id)
}

export default function ViewVehicleGroupPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVehicleGroup() {
      try {
        const data = await getVehicleGroupById(id)
        if (data) {
          setGroup(data)
        } else {
          setError("Vehicle group not found")
        }
      } catch (err) {
        setError("Failed to load vehicle group data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadVehicleGroup()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Group Details</h1>
          <p className="text-muted-foreground">Loading vehicle group data...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">{group.description}</h1>
          <p className="text-muted-foreground">
            {group.code} - {group.sipCode}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/company/fleet/vehicle-group">Back to Vehicle Groups</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/company/fleet/vehicle-group/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Vehicle Group
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Group Details</CardTitle>
              <CardDescription>View detailed information about this vehicle group</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Group Details</TabsTrigger>
                  <TabsTrigger value="age">Age Rental Limits</TabsTrigger>
                  <TabsTrigger value="features">Vehicle Features</TabsTrigger>
                  <TabsTrigger value="upgrades">Vehicle Upgrades</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-lg font-medium">General</h3>
                    <Separator className="my-2" />
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Code:</dt>
                        <dd>{group.code}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Description:</dt>
                        <dd>{group.description}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">SIP Code:</dt>
                        <dd>{group.sipCode}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Class:</dt>
                        <dd>{group.class}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Auto Allocate:</dt>
                        <dd>{group.autoAllocate ? "Yes" : "No"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Fuel Type:</dt>
                        <dd>{group.fuelType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Tank Capacity:</dt>
                        <dd>{group.tankCapacity} liters</dd>
                      </div>
                    </dl>
                  </div>
                </TabsContent>

                {/* Age Rental Limits Tab */}
                <TabsContent value="age" className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-lg font-medium">Age Rental Limits</h3>
                    <Separator className="my-2" />
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Minimum Age:</dt>
                        <dd>{group.minAge} years</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Young Driver Limit:</dt>
                        <dd>{group.youngDriverLimit} years</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Maximum Age Limit:</dt>
                        <dd>{group.maxAgeLimit} years</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Driving Years Required:</dt>
                        <dd>{group.drivingYears} years</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Senior Limit:</dt>
                        <dd>{group.seniorLimit} years</dd>
                      </div>
                    </dl>
                  </div>
                </TabsContent>

                {/* Vehicle Features Tab */}
                <TabsContent value="features" className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-lg font-medium">Vehicle Features</h3>
                    <Separator className="my-2" />
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Doors:</dt>
                        <dd>{group.doors}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Suitcases:</dt>
                        <dd>{group.suitcases}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Passengers (Pax):</dt>
                        <dd>{group.pax}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Bags:</dt>
                        <dd>{group.bags}</dd>
                      </div>
                    </dl>
                  </div>
                </TabsContent>

                {/* Vehicle Upgrades Tab */}
                <TabsContent value="upgrades" className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-lg font-medium">Vehicle Upgrades</h3>
                    <Separator className="my-2" />
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Upgrade Mode:</dt>
                        <dd>{group.upgradeMode}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Alternate Groups:</dt>
                        <dd>{group.alternateGroups}</dd>
                      </div>
                    </dl>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild>
                <Link href={`/admin/company/fleet/vehicle-group/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Vehicle Group
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Image</CardTitle>
              <CardDescription>Representative image for this vehicle group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 w-full overflow-hidden rounded-md">
                <Image src={group.image || "/placeholder.svg"} alt={group.description} fill className="object-cover" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
