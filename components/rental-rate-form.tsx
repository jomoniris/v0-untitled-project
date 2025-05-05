"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createRentalRate, updateRentalRate } from "@/app/actions/rental-rate-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

// Define the form schema
const rentalRateSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  vehicleGroupId: z.string().min(1, {
    message: "Vehicle group is required.",
  }),
  dailyRate: z.coerce.number().min(0, {
    message: "Daily rate must be a positive number.",
  }),
  weeklyRate: z.coerce.number().min(0, {
    message: "Weekly rate must be a positive number.",
  }),
  monthlyRate: z.coerce.number().min(0, {
    message: "Monthly rate must be a positive number.",
  }),
  weekendRate: z.coerce.number().min(0, {
    message: "Weekend rate must be a positive number.",
  }),
  isActive: z.boolean().default(true),
})

export type RentalRateFormValues = z.infer<typeof rentalRateSchema>

// This can come from your database
const vehicleGroups = [
  { id: "1", name: "Economy" },
  { id: "2", name: "Compact" },
  { id: "3", name: "Mid-size" },
  { id: "4", name: "Full-size" },
  { id: "5", name: "SUV" },
  { id: "6", name: "Luxury" },
]

export function RentalRateForm({
  initialData,
}: {
  initialData?: RentalRateFormValues
}) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with default values or initial data
  const form = useForm<RentalRateFormValues>({
    resolver: zodResolver(rentalRateSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      vehicleGroupId: "",
      dailyRate: 0,
      weeklyRate: 0,
      monthlyRate: 0,
      weekendRate: 0,
      isActive: true,
    },
  })

  // Handle form submission
  async function onSubmit(data: RentalRateFormValues) {
    try {
      setIsSubmitting(true)

      if (initialData) {
        // Update existing rental rate
        await updateRentalRate(data)
        toast({
          title: "Rental rate updated",
          description: "The rental rate has been updated successfully.",
        })
      } else {
        // Create new rental rate
        await createRentalRate(data)
        toast({
          title: "Rental rate created",
          description: "The rental rate has been created successfully.",
        })
      }

      // Redirect to rental rates list
      router.push("/admin/rate-and-policies/rental-rates")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter rate name" {...field} />
                </FormControl>
                <FormDescription>The name of the rental rate plan.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""} // Ensure we have a string value
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The vehicle group this rate applies to.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter rate description"
                  {...field}
                  value={field.value || ""} // Ensure we have a string value
                />
              </FormControl>
              <FormDescription>Optional description of the rental rate plan.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="dailyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Rate</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weeklyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekly Rate</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="monthlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Rate</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weekendRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekend Rate</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <FormDescription>This rate plan is available for booking.</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/rate-and-policies/rental-rates")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Rate" : "Create Rate"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
