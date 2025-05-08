"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { createNonRevenueMovement, updateNonRevenueMovement } from "@/app/actions/non-revenue-movement-actions"
import { toast } from "@/components/ui/use-toast"

// Mock data for master tables
const workOrderTypes = [
  { id: "WOT-001", name: "Preventive Maintenance" },
  { id: "WOT-002", name: "Corrective Maintenance" },
  { id: "WOT-003", name: "Transfer" },
  { id: "WOT-004", name: "Preparation" },
  { id: "WOT-005", name: "Inspection" },
]

const claims = [
  { id: "CLM-001", name: "Insurance Claim #INS-2023-001" },
  { id: "CLM-002", name: "Warranty Claim #WAR-2023-045" },
  { id: "CLM-003", name: "Damage Claim #DMG-2023-112" },
  { id: "CLM-004", name: "Accident Claim #ACC-2023-078" },
]

const drivers = [
  { id: "DRV-001", name: "John Smith" },
  { id: "DRV-002", name: "Sarah Johnson" },
  { id: "DRV-003", name: "Michael Brown" },
  { id: "DRV-004", name: "Emily Davis" },
  { id: "DRV-005", name: "Robert Wilson" },
]

const users = [
  { id: "USR-001", name: "Admin User" },
  { id: "USR-002", name: "Fleet Manager" },
  { id: "USR-003", name: "Maintenance Supervisor" },
  { id: "USR-004", name: "Operations Manager" },
]

const movementReasons = [
  { id: "RSN-001", name: "Scheduled Maintenance" },
  { id: "RSN-002", name: "Breakdown Repair" },
  { id: "RSN-003", name: "Location Transfer" },
  { id: "RSN-004", name: "Customer Delivery" },
  { id: "RSN-005", name: "Vehicle Preparation" },
  { id: "RSN-006", name: "Inspection" },
]

const statuses = [
  { id: "STS-001", name: "Scheduled" },
  { id: "STS-002", name: "In Progress" },
  { id: "STS-003", name: "Completed" },
  { id: "STS-004", name: "Cancelled" },
  { id: "STS-005", name: "On Hold" },
]

const locations = [
  { id: "LOC-001", name: "Main Garage" },
  { id: "LOC-002", name: "Downtown Branch" },
  { id: "LOC-003", name: "Airport Location" },
  { id: "LOC-004", name: "Service Center" },
  { id: "LOC-005", name: "North Branch" },
]

const tasks = [
  { id: "TSK-001", name: "Oil Change" },
  { id: "TSK-002", name: "Tire Rotation" },
  { id: "TSK-003", name: "Brake Inspection" },
  { id: "TSK-004", name: "Air Filter Replacement" },
  { id: "TSK-005", name: "Battery Check" },
]

const parts = [
  { id: "PRT-001", name: "Oil Filter" },
  { id: "PRT-002", name: "Air Filter" },
  { id: "PRT-003", name: "Brake Pads" },
  { id: "PRT-004", name: "Wiper Blades" },
  { id: "PRT-005", name: "Battery" },
]

// Form schema
const itemSchema = z.object({
  supplier: z.string().optional(),
  startDatetime: z.date().optional(),
  endDatetime: z.date().optional(),
  task: z.string({
    required_error: "Please select a task",
  }),
  parts: z.string({
    required_error: "Please select parts",
  }),
  cost: z.string().transform((val) => (val ? Number.parseFloat(val) : 0)),
  laborCost: z.string().transform((val) => (val ? Number.parseFloat(val) : 0)),
  vat: z.string().transform((val) => (val ? Number.parseFloat(val) : 0)),
  total: z.number().optional(),
  warranty: z.boolean().default(false),
})

const nonRevenueMovementSchema = z.object({
  workOrderType: z.string({
    required_error: "Please select a work order type",
  }),
  supplier: z.string().optional(),
  claim: z.string().optional(),
  vehicle: z.string({
    required_error: "Please enter a vehicle",
  }),
  driver: z.string({
    required_error: "Please select a driver",
  }),
  movementReason: z.string({
    required_error: "Please select a movement reason",
  }),
  createdBy: z.string({
    required_error: "Please select a creator",
  }),
  status: z.string({
    required_error: "Please select a status",
  }),
  checkoutLocation: z.string({
    required_error: "Please select a checkout location",
  }),
  checkinLocation: z.string().optional(),
  checkoutDatetime: z.date({
    required_error: "Please select a checkout date and time",
  }),
  checkoutMileage: z.string().transform((val) => (val ? Number.parseFloat(val) : 0)),
  checkoutTank: z.string().transform((val) => (val ? Number.parseFloat(val) : 0)),
  checkinDatetime: z.date().optional(),
  checkinMileage: z.string().transform((val) => (val ? Number.parseFloat(val) : 0)),
  checkinTank: z.string().transform((val) => (val ? Number.parseFloat(val) : 0)),
  notes: z.string().optional(),
  items: z.array(itemSchema).default([]),
})

type NonRevenueMovementFormValues = z.infer<typeof nonRevenueMovementSchema>

// Default values for the form
const defaultValues: Partial<NonRevenueMovementFormValues> = {
  status: "STS-001", // Scheduled
  checkoutDatetime: new Date(),
  checkoutMileage: 0,
  checkoutTank: 0,
  checkinMileage: 0,
  checkinTank: 0,
  notes: "",
  items: [],
}

interface NonRevenueMovementFormProps {
  initialData?: any
}

export function NonRevenueMovementForm({ initialData }: NonRevenueMovementFormProps) {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with default values or initial data
  const form = useForm<NonRevenueMovementFormValues>({
    resolver: zodResolver(nonRevenueMovementSchema),
    defaultValues: initialData || defaultValues,
  })

  // Set items when initialData changes
  useEffect(() => {
    if (initialData?.items) {
      setItems(initialData.items)
    }
  }, [initialData])

  async function onSubmit(data: NonRevenueMovementFormValues) {
    setIsSubmitting(true)
    try {
      // Map form data to API format
      const formattedData = {
        work_order_type: data.workOrderType,
        supplier: data.supplier,
        claim: data.claim,
        vehicle: data.vehicle,
        driver: data.driver,
        movement_reason: data.movementReason,
        created_by: data.createdBy,
        status: data.status,
        checkout_location: data.checkoutLocation,
        checkin_location: data.checkinLocation,
        checkout_datetime: data.checkoutDatetime,
        checkout_mileage: data.checkoutMileage,
        checkout_tank: data.checkoutTank,
        checkin_datetime: data.checkinDatetime,
        checkin_mileage: data.checkinMileage,
        checkin_tank: data.checkinTank,
        notes: data.notes,
        items: data.items.map((item) => ({
          supplier: item.supplier,
          start_datetime: item.startDatetime,
          end_datetime: item.endDatetime,
          task: item.task,
          parts: item.parts,
          cost: item.cost,
          labor_cost: item.laborCost,
          vat: item.vat,
          total: item.total || item.cost + item.laborCost + item.vat,
          warranty: item.warranty,
        })),
      }

      let result
      if (initialData?.id) {
        // Update existing movement
        result = await updateNonRevenueMovement(initialData.id, formattedData)
      } else {
        // Create new movement
        result = await createNonRevenueMovement(formattedData)
      }

      if (result.success) {
        toast({
          title: initialData ? "Movement updated" : "Movement created",
          description: initialData
            ? "The non-revenue movement has been updated successfully."
            : "The non-revenue movement has been created successfully.",
        })
        router.push("/admin/fleet/non-revenue-movement")
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItem = () => {
    const newItem = {
      supplier: "",
      startDatetime: undefined,
      endDatetime: undefined,
      task: "",
      parts: "",
      cost: "0",
      laborCost: "0",
      vat: "0",
      total: 0,
      warranty: false,
    }
    setItems([...items, newItem])
    form.setValue("items", [...items, newItem])
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
    form.setValue("items", newItems)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Calculate total
    if (field === "cost" || field === "laborCost" || field === "vat") {
      const cost = Number(newItems[index].cost) || 0
      const laborCost = Number(newItems[index].laborCost) || 0
      const vat = Number(newItems[index].vat) || 0
      newItems[index].total = cost + laborCost + vat
    }

    setItems(newItems)
    form.setValue("items", newItems)
  }

  // Setup database tables when the component mounts
  useEffect(() => {
    const setupTables = async () => {
      try {
        await fetch("/api/setup-non-revenue-movements")
      } catch (error) {
        console.error("Error setting up tables:", error)
      }
    }

    setupTables()
  }, [])

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4">
        <CardDescription>Record vehicle movements that don't generate revenue.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 px-4">
            {/* Movement Details Section */}
            <div>
              <h3 className="text-lg font-medium mb-2">Movement Details</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <FormField
                    control={form.control}
                    name="workOrderType"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Work Order Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="h-9">
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {workOrderTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
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
                    name="supplier"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Supplier</FormLabel>
                        <FormControl className="h-9">
                          <Input placeholder="Enter supplier name" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="claim"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Claim</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="h-9">
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select claim" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {claims.map((claim) => (
                              <SelectItem key={claim.id} value={claim.id}>
                                {claim.name}
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
                    name="vehicle"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Vehicle</FormLabel>
                        <FormControl className="h-9">
                          <Input placeholder="Enter vehicle ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <FormField
                    control={form.control}
                    name="driver"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Driver</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="h-9">
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select driver" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
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
                    name="movementReason"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Movement Reason</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="h-9">
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {movementReasons.map((reason) => (
                              <SelectItem key={reason.id} value={reason.id}>
                                {reason.name}
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
                    name="createdBy"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Created By</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="h-9">
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-sm font-medium">Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl className="h-9">
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Checkout Details Section */}
            <div className="border p-2 rounded-md">
              <h3 className="font-medium mb-2">Checkout Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="checkoutLocation"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkout Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="h-9">
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
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
                  name="checkoutDatetime"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkout Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className="h-9">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-9 pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkoutMileage"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkout Mileage</FormLabel>
                      <FormControl className="h-9">
                        <Input type="number" placeholder="Enter mileage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkoutTank"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkout Tank (%)</FormLabel>
                      <FormControl className="h-9">
                        <Input type="number" placeholder="Enter tank %" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Checkin Details Section */}
            <div className="border p-2 rounded-md">
              <h3 className="font-medium mb-2">Checkin Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="checkinLocation"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkin Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="h-9">
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">Optional for scheduled movements</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkinDatetime"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkin Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl className="h-9">
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-9 pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-xs">Optional for scheduled movements</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkinMileage"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkin Mileage</FormLabel>
                      <FormControl className="h-9">
                        <Input type="number" placeholder="Enter mileage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checkinTank"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-sm font-medium">Checkin Tank (%)</FormLabel>
                      <FormControl className="h-9">
                        <Input type="number" placeholder="Enter tank %" min="0" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium">Notes</FormLabel>
                  <FormControl className="h-9">
                    <Textarea
                      placeholder="Enter any additional details..."
                      className="resize-none h-20"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-2" />

            {/* Item List Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Item List</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="py-1 px-2">Supplier</TableHead>
                      <TableHead className="py-1 px-2">Start Date</TableHead>
                      <TableHead className="py-1 px-2">End Date</TableHead>
                      <TableHead className="py-1 px-2">Task</TableHead>
                      <TableHead className="py-1 px-2">Parts</TableHead>
                      <TableHead className="py-1 px-2">Cost</TableHead>
                      <TableHead className="py-1 px-2">Labor</TableHead>
                      <TableHead className="py-1 px-2">VAT</TableHead>
                      <TableHead className="py-1 px-2">Total</TableHead>
                      <TableHead className="py-1 px-2 w-[60px]">Warranty</TableHead>
                      <TableHead className="py-1 px-2 w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center text-muted-foreground py-2">
                          No items added. Click "Add Item" to add a new item.
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="py-1 px-2 align-middle">
                            <Input
                              placeholder="Supplier"
                              value={item.supplier || ""}
                              onChange={(e) => updateItem(index, "supplier", e.target.value)}
                              className="w-full h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-8 pl-2 text-left text-sm font-normal",
                                    !item.startDatetime && "text-muted-foreground",
                                  )}
                                >
                                  {item.startDatetime ? format(item.startDatetime, "MM/dd/yy") : <span>Select</span>}
                                  <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={item.startDatetime}
                                  onSelect={(date) => updateItem(index, "startDatetime", date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-8 pl-2 text-left text-sm font-normal",
                                    !item.endDatetime && "text-muted-foreground",
                                  )}
                                >
                                  {item.endDatetime ? format(item.endDatetime, "MM/dd/yy") : <span>Select</span>}
                                  <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={item.endDatetime}
                                  onSelect={(date) => updateItem(index, "endDatetime", date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Select value={item.task} onValueChange={(value) => updateItem(index, "task", value)}>
                              <SelectTrigger className="w-full h-8 text-sm">
                                <SelectValue placeholder="Task" />
                              </SelectTrigger>
                              <SelectContent>
                                {tasks.map((task) => (
                                  <SelectItem key={task.id} value={task.id}>
                                    {task.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Select value={item.parts} onValueChange={(value) => updateItem(index, "parts", value)}>
                              <SelectTrigger className="w-full h-8 text-sm">
                                <SelectValue placeholder="Parts" />
                              </SelectTrigger>
                              <SelectContent>
                                {parts.map((part) => (
                                  <SelectItem key={part.id} value={part.id}>
                                    {part.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Input
                              type="number"
                              value={item.cost}
                              onChange={(e) => updateItem(index, "cost", e.target.value)}
                              className="w-full h-8 text-sm"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Input
                              type="number"
                              value={item.laborCost}
                              onChange={(e) => updateItem(index, "laborCost", e.target.value)}
                              className="w-full h-8 text-sm"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Input
                              type="number"
                              value={item.vat}
                              onChange={(e) => updateItem(index, "vat", e.target.value)}
                              className="w-full h-8 text-sm"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Input type="number" value={item.total} readOnly className="w-full h-8 text-sm bg-muted" />
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle text-center">
                            <input
                              type="checkbox"
                              checked={item.warranty}
                              onChange={(e) => updateItem(index, "warranty", e.target.checked)}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell className="py-1 px-2 align-middle">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              aria-label="Remove item"
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {items.length > 0 && (
                <div className="flex justify-end mt-3">
                  <div className="border rounded-md p-2 w-64">
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Subtotal:</span>
                      <span>
                        $
                        {items
                          .reduce((sum, item) => sum + (Number(item.cost) || 0) + (Number(item.laborCost) || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>VAT:</span>
                      <span>${items.reduce((sum, item) => sum + (Number(item.vat) || 0), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm">
                      <span>Total:</span>
                      <span>${items.reduce((sum, item) => sum + (Number(item.total) || 0), 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between py-3 px-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/fleet/non-revenue-movement")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update Movement" : "Create Movement"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
