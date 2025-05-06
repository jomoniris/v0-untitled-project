"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getLocationById } from "@/app/actions/location-actions"
import { toast } from "@/components/ui/use-toast"

export default function ViewLocationPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [location, setLocation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadLocation() {
      try {
        setLoading(true)
        const { location, error } = await getLocationById(id)

        if (error) {
          setError(error)
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        } else if (location) {
          setLocation(location)
        } else {
          setError("Location not found")
          toast({
            title: "Error",
            description: "Location not found",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Failed to load location data:", err)
        setError("Failed to load location data")
        toast({
          title: "Error",
          description: "Failed to load location data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadLocation()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Details</h1>
          <p className="text-muted-foreground">Loading location data...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">{location.name}</h1>
          <p className="text-muted-foreground">
            {location.code} - {location.stationType}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/company/locations">Back to Locations</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/company/locations/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Location
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>View detailed information about this location</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="address">Station Address</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
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
                      <dd>{location.code}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Name:</dt>
                      <dd>{location.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Metroplex:</dt>
                      <dd>{location.metroplex}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Station Type:</dt>
                      <dd>{location.stationType}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Operating Hours:</dt>
                      <dd>{location.operatingHours}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Tax Information</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Tax 1 (%):</dt>
                      <dd>{location.tax1}%</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Tax 2 (%):</dt>
                      <dd>{location.tax2 ? `${location.tax2}%` : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Status:</dt>
                      <dd>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            location.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {location.active ? "Active" : "Inactive"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium">Address Information</h3>
                  <Separator className="my-2" />
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Address:</dt>
                      <dd>{location.address}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">City:</dt>
                      <dd>{location.city}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">State:</dt>
                      <dd>{location.state}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Postal Code:</dt>
                      <dd>{location.postalCode}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">Country:</dt>
                      <dd>{location.country}</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex items-center justify-center bg-muted rounded-md p-4">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2">Map view would be displayed here</p>
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {location.latitude}, {location.longitude}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contact Details Tab */}
            <TabsContent value="contact" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Contact Information</h3>
                <Separator className="my-2" />
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Email:</dt>
                    <dd>{location.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Telephone:</dt>
                    <dd>{location.telephone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Fax:</dt>
                    <dd>{location.fax || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Latitude:</dt>
                    <dd>{location.latitude}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Longitude:</dt>
                    <dd>{location.longitude}</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>

            {/* Accounting Tab */}
            <TabsContent value="accounting" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium">Accounting Information</h3>
                <Separator className="my-2" />
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Nominal Account:</dt>
                    <dd>{location.nominalAccount}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">DBR Next No:</dt>
                    <dd>{location.dbrNextNo}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">DBR Date:</dt>
                    <dd>{location.dbrDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">Station Manager:</dt>
                    <dd>{location.stationManager}</dd>
                  </div>
                </dl>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link href={`/admin/company/locations/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Location
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
