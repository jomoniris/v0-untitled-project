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

// Update the imports to include the server actions
import { createZone, updateZone } from "@/app/actions/zone-actions"

// Define the form schema with validation
const zoneFormSchema = z.object({
  code: z
    .string()
    .min(2, {
      message: "Code must be at least 2 characters.",
    })
    .max(20, {
      message: "Code must not be longer than 20 characters.",
    }),
  description: z
    .string()
    .min(5, {
      message: "Description must be at least 5 characters.",
    })
    .max(100, {
      message: "Description must not be longer than 100 characters.",
    }),
  belongsTo: z.string().optional(),
  timeZone: z.string({
    required_error: "Please select a time zone.",
  }),
  active: z.boolean().default(true),
})

type ZoneFormValues = z.infer<typeof zoneFormSchema>

// This type defines the props for the ZoneForm component
interface ZoneFormProps {
  initialData?: ZoneFormValues & { id?: string }
  isEditing?: boolean
}

export function ZoneForm({ initialData, isEditing = false }: ZoneFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default form values
  const defaultValues: Partial<ZoneFormValues> = {
    code: "",
    description: "",
    belongsTo: "",
    timeZone: "",
    active: true,
    ...initialData,
  }

  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues,
  })

  // Replace the onSubmit function with this implementation
  async function onSubmit(data: ZoneFormValues) {
    setIsSubmitting(true)

    try {
      // Call the appropriate server action based on whether we're editing or creating
      const result = isEditing ? await updateZone(initialData?.id as string, data) : await createZone(data)

      if (result.error) {
        // Show error message if the server action failed
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        // Show success message
        toast({
          title: isEditing ? "Zone updated" : "Zone created",
          description: isEditing
            ? `Zone ${data.code} has been updated successfully.`
            : `Zone ${data.code} has been created successfully.`,
        })

        // Redirect back to zones list
        router.push("/admin/company/locations/zone")
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
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Zone" : "Zone Details"}</CardTitle>
            <CardDescription>
              {isEditing ? "Update the zone information" : "Enter the details for the new zone"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter zone code (e.g., NYC-DOWNTOWN)" {...field} />
                    </FormControl>
                    <FormDescription>A unique identifier for this zone.</FormDescription>
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
                      <Input placeholder="Enter zone description" {...field} />
                    </FormControl>
                    <FormDescription>A brief description of this zone.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="belongsTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Belongs To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        <SelectItem value="nyc">New York City</SelectItem>
                        <SelectItem value="la">Los Angeles</SelectItem>
                        <SelectItem value="chicago">Chicago</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The parent zone this zone belongs to (if any).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (ET)</SelectItem>
                        <SelectItem value="cst">Central Time (CT)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The time zone for this location zone.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>Determine if this zone is active and available for use.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/company/locations/zone">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Zone" : "Save Zone"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
