"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createLocation, updateLocation } from "@/app/actions/location-actions"

// Define the form schema with validation
const locationFormSchema = z.object({
  // Basic Information
  code: z
    .string()
    .min(2, {
      message: "Code must be at least 2 characters.",
    })
    .max(10, {
      message: "Code must not be longer than 10 characters.",
    }),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(100, {
      message: "Name must not be longer than 100 characters.",
    }),
  metroplex: z.string().min(1, { message: "Metroplex is required" }),
  stationType: z.string().min(1, { message: "Station type is required" }),
  operatingHours: z.string().min(1, { message: "Operating hours are required" }),
  tax1: z.string().optional(),
  tax2: z.string().optional(),

  // Address
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),

  // Contact Details
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  telephone: z.string().optional(),
  fax: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),

  // Accounting Information
  nominalAccount: z.string().optional(),
  dbrNextNo: z.string().optional(),
  dbrDate: z.string().optional(),
  stationManager: z.string().optional(),

  // Status
  active: z.boolean().default(true),
})

type LocationFormValues = z.infer<typeof locationFormSchema>

// This type defines the props for the LocationForm component
interface LocationFormProps {
  initialData?: any
  isEditing?: boolean
}

export function LocationForm({ initialData, isEditing = false }: LocationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default form values
  const defaultValues: Partial<LocationFormValues> = {
    code: "",
    name: "",
    metroplex: "",
    stationType: "",
    operatingHours: "",
    tax1: "",
    tax2: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    state: "",
    email: "",
    telephone: "",
    fax: "",
    latitude: "",
    longitude: "",
    nominalAccount: "",
    dbrNextNo: "",
    dbrDate: "",
    stationManager: "",
    active: true,
    ...initialData,
  }

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues,
  })

  async function onSubmit(data: LocationFormValues) {
    setIsSubmitting(true)

    try {
      const result = isEditing ? await updateLocation(initialData?.id, data) : await createLocation(data)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Show success message
        toast({
          title: isEditing ? "Location updated" : "Location created",
          description: isEditing
            ? `Location ${data.name} has been updated successfully.`
            : `Location ${data.name} has been created successfully.`,
        })

        // Redirect back to locations list
        router.push("/admin/company/locations")
        router.refresh()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Location" : "New Location"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update location information" : "Enter details for the new location"}
              </CardDescription>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location code" {...field} />
                          </FormControl>
                          <FormDescription>A unique identifier for this location.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter location name" {...field} />
                          </FormControl>
                          <FormDescription>The name of this location.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tax1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax 1 (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tax 1 percentage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tax2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax 2 (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter tax 2 percentage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="metroplex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Metroplex</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select metroplex" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="new-york">New York</SelectItem>
                              <SelectItem value="los-angeles">Los Angeles</SelectItem>
                              <SelectItem value="chicago">Chicago</SelectItem>
                              <SelectItem value="miami">Miami</SelectItem>
                              <SelectItem value="dallas">Dallas</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Station Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select station type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full-service">Full Service</SelectItem>
                              <SelectItem value="express">Express</SelectItem>
                              <SelectItem value="airport">Airport</SelectItem>
                              <SelectItem value="downtown">Downtown</SelectItem>
                              <SelectItem value="suburban">Suburban</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="operatingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 8:00 AM - 8:00 PM or 24/7" {...field} />
                        </FormControl>
                        <FormDescription>The operating hours for this location.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active Status</FormLabel>
                          <FormDescription>Determine if this location is active and available for use.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Address Tab */}
                <TabsContent value="address" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter postal code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="usa">United States</SelectItem>
                              <SelectItem value="canada">Canada</SelectItem>
                              <SelectItem value="mexico">Mexico</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ny">New York</SelectItem>
                              <SelectItem value="ca">California</SelectItem>
                              <SelectItem value="tx">Texas</SelectItem>
                              <SelectItem value="fl">Florida</SelectItem>
                              <SelectItem value="il">Illinois</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Contact Details Tab */}
                <TabsContent value="contact" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter telephone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter fax number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter latitude coordinates" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter longitude coordinates" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Accounting Tab */}
                <TabsContent value="accounting" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="nominalAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nominal Account</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter nominal account" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dbrNextNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DBR Next No</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter DBR next number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dbrDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DBR Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="stationManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Station Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter station manager name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/company/locations">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Location" : "Save Location"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
