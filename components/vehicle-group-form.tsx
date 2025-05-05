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
import Image from "next/image"
import {
  createVehicleGroup,
  updateVehicleGroup,
  type VehicleGroupFormValues,
} from "@/app/actions/vehicle-group-actions"
import { Loader2 } from "lucide-react"

// Define the form schema with validation
const vehicleGroupFormSchema = z
  .object({
    // Basic Information
    code: z
      .string()
      .min(2, {
        message: "Code must be at least 2 characters.",
      })
      .max(10, {
        message: "Code must not be longer than 10 characters.",
      })
      .toUpperCase()
      .refine((value) => /^[A-Z0-9]+$/.test(value), {
        message: "Code must contain only uppercase letters and numbers.",
      }),
    description: z
      .string()
      .min(3, {
        message: "Description must be at least 3 characters.",
      })
      .max(100, {
        message: "Description must not be longer than 100 characters.",
      }),
    sipCode: z
      .string()
      .min(2, {
        message: "SIP code must be at least 2 characters.",
      })
      .max(10, {
        message: "SIP code must not be longer than 10 characters.",
      })
      .toUpperCase()
      .refine((value) => /^[A-Z0-9]+$/.test(value), {
        message: "SIP code must contain only uppercase letters and numbers.",
      }),
    class: z.string({
      required_error: "Class is required.",
    }),
    autoAllocate: z.boolean().default(false),
    fuelType: z.string({
      required_error: "Fuel type is required.",
    }),
    tankCapacity: z.coerce.number().min(0).optional(),

    // Age Rental Limits
    minAge: z.coerce.number().min(16, { message: "Minimum age must be at least 16" }).max(100).default(21),
    youngDriverLimit: z.coerce.number().min(16).max(100).default(25),
    maxAgeLimit: z.coerce.number().min(16).max(100).default(75),
    drivingYears: z.coerce.number().min(0).max(50).default(2),
    seniorLimit: z.coerce.number().min(16).max(100).default(70),

    // Vehicle Features
    doors: z.coerce.number().min(1, { message: "Vehicle must have at least 1 door" }).max(10),
    suitcases: z.coerce.number().min(0).max(10),
    pax: z.coerce.number().min(1, { message: "Vehicle must accommodate at least 1 passenger" }).max(50),
    bags: z.coerce.number().min(0).max(20),

    // Vehicle Upgrades
    upgradeMode: z.string().optional(),
    alternateGroups: z.string().optional(),

    // Website Photo
    imagePath: z.string().optional(),
  })
  .refine((data) => data.youngDriverLimit >= data.minAge, {
    message: "Young driver limit must be greater than or equal to minimum age",
    path: ["youngDriverLimit"],
  })
  .refine((data) => data.maxAgeLimit > data.youngDriverLimit, {
    message: "Maximum age limit must be greater than young driver limit",
    path: ["maxAgeLimit"],
  })
  .refine((data) => data.seniorLimit <= data.maxAgeLimit, {
    message: "Senior limit must be less than or equal to maximum age limit",
    path: ["seniorLimit"],
  })

// This type defines the props for the VehicleGroupForm component
interface VehicleGroupFormProps {
  initialData?: Partial<VehicleGroupFormValues> & { id?: string }
  isEditing?: boolean
}

export function VehicleGroupForm({ initialData, isEditing = false }: VehicleGroupFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Default form values
  const defaultValues: Partial<VehicleGroupFormValues> = {
    code: "",
    description: "",
    sipCode: "",
    class: "",
    autoAllocate: false,
    fuelType: "petrol",
    tankCapacity: 0,
    minAge: 21,
    youngDriverLimit: 25,
    maxAgeLimit: 75,
    drivingYears: 2,
    seniorLimit: 70,
    doors: 4,
    suitcases: 1,
    pax: 5,
    bags: 1,
    upgradeMode: "none",
    alternateGroups: "none",
    imagePath: "",
    ...initialData,
  }

  const form = useForm<z.infer<typeof vehicleGroupFormSchema>>({
    resolver: zodResolver(vehicleGroupFormSchema),
    defaultValues,
  })

  async function onSubmit(data: z.infer<typeof vehicleGroupFormSchema>) {
    setIsSubmitting(true)
    setServerError(null)

    try {
      // Transform the data for the database
      const transformedData: VehicleGroupFormValues = {
        ...data,
        // Convert empty strings to null for optional fields
        tankCapacity: data.tankCapacity || null,
        upgradeMode: data.upgradeMode || null,
        alternateGroups: data.alternateGroups || null,
        imagePath: data.imagePath && data.imagePath.trim() !== "" ? data.imagePath : null,
      }

      if (isEditing && initialData?.id) {
        // Update existing vehicle group
        const { error } = await updateVehicleGroup(initialData.id, transformedData)

        if (error) {
          setServerError(error)
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Vehicle group updated",
          description: `Vehicle group ${data.code} has been updated successfully.`,
        })
      } else {
        // Create new vehicle group
        const { error } = await createVehicleGroup(transformedData)

        if (error) {
          setServerError(error)
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Vehicle group created",
          description: `Vehicle group ${data.code} has been created successfully.`,
        })
      }

      // Redirect back to vehicle groups list
      router.push("/admin/company/fleet/vehicle-group")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      setServerError("An unexpected error occurred. Please try again.")
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
          {serverError && <div className="bg-destructive/15 text-destructive p-3 rounded-md">{serverError}</div>}

          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Vehicle Group" : "New Vehicle Group"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update vehicle group information" : "Enter details for the new vehicle group"}
              </CardDescription>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter group code"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              disabled={isEditing}
                            />
                          </FormControl>
                          <FormDescription>A unique identifier for this vehicle group.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter group description" {...field} />
                          </FormControl>
                          <FormDescription>A brief description of this vehicle group.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SIP Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter SIP code"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <FormDescription>Standard Industry Product code.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="economy">Economy</SelectItem>
                              <SelectItem value="compact">Compact</SelectItem>
                              <SelectItem value="midsize">Midsize</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="fullsize">Full Size</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="luxury">Luxury</SelectItem>
                              <SelectItem value="suv">SUV</SelectItem>
                              <SelectItem value="van">Van</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fuelType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fuel type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="petrol">Petrol</SelectItem>
                              <SelectItem value="diesel">Diesel</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                              <SelectItem value="electric">Electric</SelectItem>
                              <SelectItem value="lpg">LPG</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tankCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tank Capacity (liters)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Enter tank capacity"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="autoAllocate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Auto Allocate</FormLabel>
                          <FormDescription>
                            Allow system to automatically allocate vehicles from this group.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imagePath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website Photo</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Input type="text" placeholder="Enter image URL or upload an image" {...field} />
                            {field.value && (
                              <div className="relative h-40 w-full overflow-hidden rounded-md border">
                                <Image
                                  src={field.value || "/placeholder.svg"}
                                  alt="Vehicle group"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>Image to display on the website for this vehicle group.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Age Rental Limits Tab */}
                <TabsContent value="age" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="minAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={16}
                              max={100}
                              placeholder="Enter minimum age"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Minimum age required to rent vehicles in this group.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="youngDriverLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Young Driver Limit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={16}
                              max={100}
                              placeholder="Enter young driver limit"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Age below which young driver surcharge applies.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxAgeLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Age Limit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={16}
                              max={100}
                              placeholder="Enter maximum age limit"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Maximum age allowed to rent vehicles in this group.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seniorLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senior Limit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={16}
                              max={100}
                              placeholder="Enter senior limit"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Age above which senior driver surcharge applies.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="drivingYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driving Years</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={50}
                            placeholder="Enter minimum driving years"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormDescription>Minimum years of driving experience required.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Vehicle Features Tab */}
                <TabsContent value="features" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="doors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doors</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              placeholder="Enter number of doors"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Number of doors on vehicles in this group.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="suitcases"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suitcases</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              placeholder="Enter number of suitcases"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Number of large suitcases that can fit in the trunk.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passengers (Pax)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={50}
                              placeholder="Enter number of passengers"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Maximum number of passengers.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bags</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={20}
                              placeholder="Enter number of bags"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                          <FormDescription>Number of small bags that can fit in the trunk.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Vehicle Upgrades Tab */}
                <TabsContent value="upgrades" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="upgradeMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upgrade Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select upgrade mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="restricted">Restricted</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How upgrades are handled for this vehicle group.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alternateGroups"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Groups</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select alternate groups" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="midsize">Midsize</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="fullsize">Full Size</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Alternative vehicle groups that can be used for substitution.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/company/fleet/vehicle-group">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : isEditing ? (
                  "Update Group"
                ) : (
                  "Save Group"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
