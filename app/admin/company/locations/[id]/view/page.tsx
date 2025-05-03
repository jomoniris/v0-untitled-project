"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock API function to get location data
async function getLocationById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const locations = [
    {
      id: "1",
      code: "NYC-DT",
      name: "Downtown Office",
      stationType: "Full Service",
      metroplex: "New York",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      operatingHours: "8:00 AM - 8:00 PM",
      email: "nyc.downtown@example.com",
      telephone: "+1 (212) 555-1234",
      fax: "+1 (212) 555-5678",
      latitude: "40.7128",
      longitude: "-74.0060",
      nominalAccount: "NYC-001",
      dbrNextNo: "10001",
      dbrDate: "2023-04-15",
      stationManager: "John Smith",
      tax1: "8.875",
      tax2: "0",
      active: true,
    },
    {
      id: "2",
      code: "NYC-AP",
      name: "Airport Terminal",
      stationType: "Airport",
      metroplex: "New York",
      address: "JFK Airport, Terminal 4",
      city: "New York",
      state: "NY",
      postalCode: "11430",
      country: "USA",
      operatingHours: "24/7",
      email: "nyc.airport@example.com",
      telephone: "+1 (212) 555-4321",
      fax: "+1 (212) 555-8765",
      latitude: "40.6413",
      longitude: "-73.7781",
      nominalAccount: "NYC-002",
      dbrNextNo: "10002",
      dbrDate: "2023-04-15",
      stationManager: "Jane Doe",
      tax1: "8.875",
      tax2: "0",
      active: true,
    },
  ]

  return locations.find((location) => location.id === id)
}

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
        const data = await getLocationById(id)
        if (data) {
          setLocation(data)
        } else {
          setError("Location not found")
        }
      } catch (err) {
        setError("Failed to load location data")
        console.error(err)
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
