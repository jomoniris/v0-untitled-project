import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { getVehicleGroupById } from "@/app/actions/vehicle-group-actions"

// Function to get the display name for class
const getClassDisplayName = (classValue: string) => {
  const classMap: Record<string, string> = {
    economy: "Economy",
    compact: "Compact",
    midsize: "Midsize",
    standard: "Standard",
    fullsize: "Full Size",
    premium: "Premium",
    luxury: "Luxury",
    suv: "SUV",
    van: "Van",
  }
  return classMap[classValue.toLowerCase()] || classValue
}

export default async function ViewVehicleGroupPage({ params }: { params: { id: string } }) {
  const { group, error } = await getVehicleGroupById(params.id)

  if (error || !group) {
    notFound()
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
            <Link href={`/admin/company/fleet/vehicle-group/${group.id}/edit`}>
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
                        <dd>{getClassDisplayName(group.class)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Auto Allocate:</dt>
                        <dd>{group.autoAllocate ? "Yes" : "No"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Fuel Type:</dt>
                        <dd>{group.fuelType.charAt(0).toUpperCase() + group.fuelType.slice(1)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Tank Capacity:</dt>
                        <dd>{group.tankCapacity ? `${group.tankCapacity} liters` : "N/A"}</dd>
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
                        <dd>
                          {group.upgradeMode
                            ? group.upgradeMode.charAt(0).toUpperCase() + group.upgradeMode.slice(1)
                            : "None"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-muted-foreground">Alternate Groups:</dt>
                        <dd>
                          {group.alternateGroups
                            ? group.alternateGroups.charAt(0).toUpperCase() + group.alternateGroups.slice(1)
                            : "None"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button asChild>
                <Link href={`/admin/company/fleet/vehicle-group/${group.id}/edit`}>
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
                <Image
                  src={group.imagePath || "/placeholder.svg"}
                  alt={group.description}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
