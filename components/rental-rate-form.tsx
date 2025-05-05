"use client"

import React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createRentalRate, updateRentalRate } from "@/app/actions/rental-rate-actions"

// Define rate package type
const ratePackageSchema = z.object({
  type: z.enum(["daily", "weekly", "monthly", "yearly"]),
  dailyRates: z.array(z.number().min(0)).optional(),
  weeklyRate: z.number().min(0).optional(),
  monthlyRate: z.number().min(0).optional(),
  yearlyRate: z.number().min(0).optional(),
})

// Define additional option schema
const additionalOptionSchema = z.object({
  id: z.string(),
  code: z.string(),
  description: z.string(),
  included: z.boolean().default(false),
  customerPays: z.boolean().default(true),
})

// Define the car group rate schema
const carGroupRateSchema = z.object({
  groupId: z.string(),
  groupName: z.string(),
  milesPerDay: z.number().min(0),
  milesRate: z.number().min(0),
  depositRateCDW: z.number().min(0),
  policyValueCDW: z.number().min(0).default(0),
  depositRatePAI: z.number().min(0),
  policyValuePAI: z.number().min(0).default(0),
  depositRateSCDW: z.number().min(0),
  policyValueSCDW: z.number().min(0).default(0),
  depositRateCPP: z.number().min(0),
  policyValueCPP: z.number().min(0).default(0),
  deliveryCharges: z.number().min(0),
  ratePackage: ratePackageSchema,
  included: z.boolean().default(true),
})

// Define the form schema with validation
const rentalRateFormSchema = z.object({
  // Rate Information
  rateName: z.string().min(3, {
    message: "Rate name must be at least 3 characters.",
  }),
  pickupStartDate: z.string(),
  pickupEndDate: z.string(),
  rateZone: z.string({
    required_error: "Rate zone is required.",
  }),
  bookingStartDate: z.string(),
  bookingEndDate: z.string(),
  active: z.boolean().default(true),

  // Car Group Rates
  carGroupRates: z.array(carGroupRateSchema),

  // Additional Options (common for all car groups)
  additionalOptions: z.array(additionalOptionSchema).default([]),
})

type RentalRateFormValues = z.infer<typeof rentalRateFormSchema>

// This type defines the props for the RentalRateForm component
interface RentalRateFormProps {
  initialData?: Partial<RentalRateFormValues>
  isEditing?: boolean
  rateId?: string
  rateZones: { id: string; code: string; name: string }[]
  vehicleGroups: { id: string; name: string }[]
  additionalOptions: { id: string; code: string; description: string; optionType: string }[]
}

export function RentalRateForm({
  initialData,
  isEditing = false,
  rateId,
  rateZones = [],
  vehicleGroups = [],
  additionalOptions = [],
}: RentalRateFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [expandedDayRates, setExpandedDayRates] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<string>("rate-info")

  // Initialize car group rates with default values
  const defaultCarGroupRates = vehicleGroups.map((group) => ({
    groupId: group.id.toString(),
    groupName: group.name,
    milesPerDay: 0,
    milesRate: 0,
    depositRateCDW: 0,
    policyValueCDW: 0,
    depositRatePAI: 0,
    policyValuePAI: 0,
    depositRateSCDW: 0,
    policyValueSCDW: 0,
    depositRateCPP: 0,
    policyValueCPP: 0,
    deliveryCharges: 0,
    ratePackage: {
      type: "daily" as const,
      dailyRates: Array(30).fill(0),
      weeklyRate: 0,
      monthlyRate: 0,
      yearlyRate: 0,
    },
    included: group.id === "1", // Only include Economy by default
  }))

  // Initialize additional options with default values
  const defaultAdditionalOptionsData = additionalOptions.map((option) => ({
    id: option.id.toString(),
    code: option.code,
    description: option.description,
    included: false,
    customerPays: true,
  }))

  // Default form values
  const defaultValues: Partial<RentalRateFormValues> = {
    rateName: "",
    pickupStartDate: new Date().toISOString().split("T")[0],
    pickupEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    rateZone: rateZones.length > 0 ? rateZones[0].code : "",
    bookingStartDate: new Date().toISOString().split("T")[0],
    bookingEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    active: true,
    carGroupRates: vehicleGroups.map((group) => ({
      groupId: group.id.toString(),
      groupName: group.name,
      milesPerDay: 0,
      milesRate: 0,
      depositRateCDW: 0,
      policyValueCDW: 0,
      depositRatePAI: 0,
      policyValuePAI: 0,
      depositRateSCDW: 0,
      policyValueSCDW: 0,
      depositRateCPP: 0,
      policyValueCPP: 0,
      deliveryCharges: 0,
      ratePackage: {
        type: "daily" as const,
        dailyRates: Array(30).fill(0),
        weeklyRate: 0,
        monthlyRate: 0,
        yearlyRate: 0,
      },
      included: group.id === "1", // Only include Economy by default
    })),
    additionalOptions: additionalOptions.map((option) => ({
      id: option.id.toString(),
      code: option.code,
      description: option.description,
      included: false,
      customerPays: true,
    })),
    ...initialData,
  }

  const form = useForm<RentalRateFormValues>({
    resolver: zodResolver(rentalRateFormSchema),
    defaultValues,
  })

  // Initialize expanded state for all groups
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {}
    const initialDayRatesState: Record<string, boolean> = {}

    vehicleGroups.forEach((group) => {
      initialExpandedState[group.id] = false
      initialDayRatesState[group.id] = false
    })

    setExpandedGroups(initialExpandedState)
    setExpandedDayRates(initialDayRatesState)
  }, [vehicleGroups])

  const toggleGroupExpanded = useCallback((groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }, [])

  const toggleDayRatesExpanded = useCallback((groupId: string) => {
    setExpandedDayRates((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }, [])

  const toggleGroupInclusion = useCallback(
    (groupId: string, included: boolean) => {
      const carGroupRates = form.getValues().carGroupRates
      const updatedRates = carGroupRates.map((rate) => (rate.groupId === groupId ? { ...rate, included } : rate))
      form.setValue("carGroupRates", updatedRates, { shouldValidate: true })
    },
    [form],
  )

  const handleRateTypeChange = useCallback(
    (groupId: string, type: "daily" | "weekly" | "monthly" | "yearly") => {
      const carGroupRates = form.getValues().carGroupRates
      const groupIndex = carGroupRates.findIndex((rate) => rate.groupId === groupId)

      if (groupIndex !== -1) {
        const updatedRates = [...carGroupRates]
        updatedRates[groupIndex].ratePackage.type = type
        form.setValue("carGroupRates", updatedRates, { shouldValidate: true })
      }
    },
    [form],
  )

  const updateCarGroupRate = useCallback(
    (index: number, field: string, value: number) => {
      const updatedRates = [...form.getValues().carGroupRates]
      // @ts-ignore - Dynamic field access
      updatedRates[index][field] = value
      form.setValue("carGroupRates", updatedRates, { shouldValidate: true })
    },
    [form],
  )

  const updateDailyRate = useCallback(
    (groupIndex: number, dayIndex: number, value: number) => {
      const updatedRates = [...form.getValues().carGroupRates]
      if (!updatedRates[groupIndex].ratePackage.dailyRates) {
        updatedRates[groupIndex].ratePackage.dailyRates = Array(30).fill(0)
      }
      updatedRates[groupIndex].ratePackage.dailyRates![dayIndex] = value
      form.setValue("carGroupRates", updatedRates, { shouldValidate: true })
    },
    [form],
  )

  const updateRatePackageValue = useCallback(
    (groupIndex: number, field: string, value: number) => {
      const updatedRates = [...form.getValues().carGroupRates]
      // @ts-ignore - Dynamic field access
      updatedRates[groupIndex].ratePackage[field] = value
      form.setValue("carGroupRates", updatedRates, { shouldValidate: true })
    },
    [form],
  )

  const updateAdditionalOption = useCallback(
    (index: number, field: string, value: boolean) => {
      const updatedOptions = [...form.getValues().additionalOptions]
      // @ts-ignore - Dynamic field access
      updatedOptions[index][field] = value
      form.setValue("additionalOptions", updatedOptions, { shouldValidate: true })
    },
    [form],
  )

  async function onSubmit(data: RentalRateFormValues) {
    setIsSubmitting(true)

    try {
      // Create FormData object
      const formData = new FormData()

      // Add basic rate information
      formData.append("rateName", data.rateName)
      formData.append("pickupStartDate", data.pickupStartDate)
      formData.append("pickupEndDate", data.pickupEndDate)
      formData.append("rateZone", data.rateZone)
      formData.append("bookingStartDate", data.bookingStartDate)
      formData.append("bookingEndDate", data.bookingEndDate)
      formData.append("active", data.active.toString())

      // Add car group rates as JSON
      formData.append("carGroupRates", JSON.stringify(data.carGroupRates))

      // Add additional options as JSON
      formData.append("additionalOptions", JSON.stringify(data.additionalOptions))

      let result

      if (isEditing && rateId) {
        // Update existing rate
        result = await updateRentalRate(rateId, formData)
      } else {
        // Create new rate
        result = await createRentalRate(formData)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Show success message
        toast({
          title: isEditing ? "Rate updated" : "Rate created",
          description: result.message,
        })

        // Redirect back to rates list
        router.push("/admin/rate-and-policies/rental-rates")
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
              <CardTitle>{isEditing ? "Edit Rental Rate" : "New Rental Rate"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update rental rate information" : "Enter details for the new rental rate"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="rate-info">Rate Information</TabsTrigger>
                  <TabsTrigger value="additional-options">Additional Options</TabsTrigger>
                </TabsList>

                {/* Rate Information Tab */}
                <TabsContent value="rate-info" className="space-y-6">
                  {/* Basic Rate Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>

                    <FormField
                      control={form.control}
                      name="rateName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rate Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter rate name" {...field} />
                          </FormControl>
                          <FormDescription>
                            A descriptive name for this rate (e.g., "Summer 2023 Special")
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rateZone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rate Zone</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select rate zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {rateZones.map((zone) => (
                                  <SelectItem key={zone.id} value={zone.code}>
                                    {zone.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              <FormDescription>Determine if this rate is active and available for use.</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pickupStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pickupEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pickup End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bookingStartDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Booking Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bookingEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Booking End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Car Group Rates Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Car Group Rates</h3>
                    </div>

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Include</TableHead>
                            <TableHead>Car Group</TableHead>
                            <TableHead>Miles/Day</TableHead>
                            <TableHead>Miles Rate</TableHead>
                            <TableHead>Rate Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {form.watch("carGroupRates").map((carGroup, index) => (
                            <React.Fragment key={carGroup.groupId}>
                              <TableRow>
                                <TableCell>
                                  <Checkbox
                                    checked={carGroup.included}
                                    onCheckedChange={(checked) =>
                                      toggleGroupInclusion(carGroup.groupId, checked === true)
                                    }
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{carGroup.groupName}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min={0}
                                    value={carGroup.milesPerDay}
                                    onChange={(e) =>
                                      updateCarGroupRate(index, "milesPerDay", e.target.valueAsNumber || 0)
                                    }
                                    className="w-20"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={carGroup.milesRate}
                                    onChange={(e) =>
                                      updateCarGroupRate(index, "milesRate", e.target.valueAsNumber || 0)
                                    }
                                    className="w-20"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Select
                                    defaultValue={carGroup.ratePackage.type}
                                    onValueChange={(value) =>
                                      handleRateTypeChange(
                                        carGroup.groupId,
                                        value as "daily" | "weekly" | "monthly" | "yearly",
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-[120px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="daily">Daily</SelectItem>
                                      <SelectItem value="weekly">Weekly</SelectItem>
                                      <SelectItem value="monthly">Monthly</SelectItem>
                                      <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleGroupExpanded(carGroup.groupId)}
                                  >
                                    {expandedGroups[carGroup.groupId] ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">Toggle details</span>
                                  </Button>
                                </TableCell>
                              </TableRow>

                              {/* Expanded details row */}
                              {expandedGroups[carGroup.groupId] && (
                                <TableRow>
                                  <TableCell colSpan={6} className="p-0">
                                    <div className="p-4 bg-muted/50">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                          <h4 className="font-medium mb-2">Insurance Rates</h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="text-sm">CDW Deposit</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.depositRateCDW}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "depositRateCDW",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <label className="text-sm">CDW Policy</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.policyValueCDW}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "policyValueCDW",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>

                                            <div>
                                              <label className="text-sm">PAI Deposit</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.depositRatePAI}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "depositRatePAI",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <label className="text-sm">PAI Policy</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.policyValuePAI}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "policyValuePAI",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>

                                            <div>
                                              <label className="text-sm">SCDW Deposit</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.depositRateSCDW}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "depositRateSCDW",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <label className="text-sm">SCDW Policy</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.policyValueSCDW}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "policyValueSCDW",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>

                                            <div>
                                              <label className="text-sm">CPP Deposit</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.depositRateCPP}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "depositRateCPP",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>
                                            <div>
                                              <label className="text-sm">CPP Policy</label>
                                              <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={carGroup.policyValueCPP}
                                                onChange={(e) =>
                                                  updateCarGroupRate(
                                                    index,
                                                    "policyValueCPP",
                                                    e.target.valueAsNumber || 0,
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        <div>
                                          <h4 className="font-medium mb-2">Additional Charges</h4>
                                          <div>
                                            <label className="text-sm">Delivery Charges</label>
                                            <Input
                                              type="number"
                                              min={0}
                                              step="0.01"
                                              value={carGroup.deliveryCharges}
                                              onChange={(e) =>
                                                updateCarGroupRate(
                                                  index,
                                                  "deliveryCharges",
                                                  e.target.valueAsNumber || 0,
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Rate Package Section */}
                                      <div>
                                        <h4 className="font-medium mb-2">Rate Package</h4>

                                        {carGroup.ratePackage.type === "daily" && (
                                          <div>
                                            <div className="flex justify-between items-center mb-2">
                                              <h5 className="text-sm font-medium">Daily Rates</h5>
                                              <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleDayRatesExpanded(carGroup.groupId)}
                                              >
                                                {expandedDayRates[carGroup.groupId] ? "Collapse" : "Expand"}
                                              </Button>
                                            </div>

                                            {!expandedDayRates[carGroup.groupId] ? (
                                              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                                {[0, 1, 2, 3, 4].map((dayIndex) => (
                                                  <div key={dayIndex}>
                                                    <label className="text-sm">Day {dayIndex + 1}</label>
                                                    <Input
                                                      type="number"
                                                      min={0}
                                                      step="0.01"
                                                      value={carGroup.ratePackage.dailyRates?.[dayIndex] || 0}
                                                      onChange={(e) =>
                                                        updateDailyRate(index, dayIndex, e.target.valueAsNumber || 0)
                                                      }
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                                {Array.from({ length: 30 }).map((_, dayIndex) => (
                                                  <div key={dayIndex}>
                                                    <label className="text-sm">Day {dayIndex + 1}</label>
                                                    <Input
                                                      type="number"
                                                      min={0}
                                                      step="0.01"
                                                      value={carGroup.ratePackage.dailyRates?.[dayIndex] || 0}
                                                      onChange={(e) =>
                                                        updateDailyRate(index, dayIndex, e.target.valueAsNumber || 0)
                                                      }
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {carGroup.ratePackage.type === "weekly" && (
                                          <div>
                                            <label className="text-sm">Weekly Rate</label>
                                            <Input
                                              type="number"
                                              min={0}
                                              step="0.01"
                                              value={carGroup.ratePackage.weeklyRate || 0}
                                              onChange={(e) =>
                                                updateRatePackageValue(index, "weeklyRate", e.target.valueAsNumber || 0)
                                              }
                                              className="mt-1"
                                            />
                                          </div>
                                        )}

                                        {carGroup.ratePackage.type === "monthly" && (
                                          <div>
                                            <label className="text-sm">Monthly Rate</label>
                                            <Input
                                              type="number"
                                              min={0}
                                              step="0.01"
                                              value={carGroup.ratePackage.monthlyRate || 0}
                                              onChange={(e) =>
                                                updateRatePackageValue(
                                                  index,
                                                  "monthlyRate",
                                                  e.target.valueAsNumber || 0,
                                                )
                                              }
                                              className="mt-1"
                                            />
                                          </div>
                                        )}

                                        {carGroup.ratePackage.type === "yearly" && (
                                          <div>
                                            <label className="text-sm">Yearly Rate</label>
                                            <Input
                                              type="number"
                                              min={0}
                                              step="0.01"
                                              value={carGroup.ratePackage.yearlyRate || 0}
                                              onChange={(e) =>
                                                updateRatePackageValue(index, "yearlyRate", e.target.valueAsNumber || 0)
                                              }
                                              className="mt-1"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                {/* Additional Options Tab */}
                <TabsContent value="additional-options" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Additional Options</h3>
                    <p className="text-sm text-muted-foreground">These options apply to all car groups in this rate</p>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Include</TableHead>
                          <TableHead className="w-[120px]">Customer Pays</TableHead>
                          <TableHead className="w-[100px]">Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Option Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {form.watch("additionalOptions").map((option, index) => (
                          <TableRow key={option.id}>
                            <TableCell>
                              <Checkbox
                                checked={option.included}
                                onCheckedChange={(checked) =>
                                  updateAdditionalOption(index, "included", checked === true)
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={option.customerPays}
                                onCheckedChange={(checked) =>
                                  updateAdditionalOption(index, "customerPays", checked === true)
                                }
                              />
                            </TableCell>
                            <TableCell>{option.code}</TableCell>
                            <TableCell>{option.description}</TableCell>
                            <TableCell>{additionalOptions[index]?.optionType || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/rate-and-policies/rental-rates">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Rate" : "Save Rate"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
