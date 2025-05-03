"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the form schema with validation
const additionalOptionFormSchema = z.object({
  // Basic Information
  code: z
    .string()
    .min(2, {
      message: "Code must be at least 2 characters.",
    })
    .max(10, {
      message: "Code must not be longer than 10 characters.",
    }),
  description: z
    .string()
    .min(3, {
      message: "Description must be at least 3 characters.",
    })
    .max(100, {
      message: "Description must not be longer than 100 characters.",
    }),
  optionType: z.string({
    required_error: "Option type is required.",
  }),
  mandatorySurcharge: z.boolean().default(false),
  calculationType: z.string({
    required_error: "Calculation type is required.",
  }),
  excessWeight: z
    .number()
    .min(1, {
      message: "Excess weight must be at least 1.",
    })
    .max(250, {
      message: "Excess weight must not be greater than 250.",
    }),
  limitationType: z.string().optional(),
  minimumCharge: z.number().optional(),
  maximumCharge: z.number().optional(),
  replacementFee: z.number().optional(),
  nominalAccount: z.string().optional(),

  // Additional Settings
  multipleItems: z.boolean().default(false),
  primaryTaxExempt: z.boolean().default(false),
  secondaryTaxExempt: z.boolean().default(false),
  active: z.boolean().default(true),
  preventPriceChange: z.boolean().default(false),
  leasing: z.boolean().default(false),
  commissionRate: z.number().optional(),

  // Print Options
  printText: z.string().optional(),
  printMemo: z.string().optional(),
})

type AdditionalOptionFormValues = z.infer<typeof additionalOptionFormSchema>

// This type defines the props for the AdditionalOptionForm component
interface AdditionalOptionFormProps {
  initialData?: Partial<AdditionalOptionFormValues>
  isEditing?: boolean
}

export function AdditionalOptionForm({ initialData, isEditing = false }: AdditionalOptionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default form values
  const defaultValues: Partial<AdditionalOptionFormValues> = {
    code: "",
    description: "",
    optionType: "",
    mandatorySurcharge: false,
    calculationType: "",
    excessWeight: 1,
    limitationType: "",
    minimumCharge: undefined,
    maximumCharge: undefined,
    replacementFee: undefined,
    nominalAccount: "",
    multipleItems: false,
    primaryTaxExempt: false,
    secondaryTaxExempt: false,
    active: true,
    preventPriceChange: false,
    leasing: false,
    commissionRate: undefined,
    printText: "",
    printMemo: "",
    ...initialData,
  }

  const form = useForm<AdditionalOptionFormValues>({
    resolver: zodResolver(additionalOptionFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AdditionalOptionFormValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Form submitted:", data)

      // Show success message
      toast({
        title: isEditing ? "Option updated" : "Option created",
        description: isEditing
          ? `Option ${data.code} has been updated successfully.`
          : `Option ${data.code} has been created successfully.`,
      })

      // Redirect back to options list
      router.push("/admin/company/finance/additional-options")
      router.refresh()
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
              <CardTitle>{isEditing ? "Edit Additional Option" : "New Additional Option"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update additional option information" : "Enter details for the new additional option"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="settings">Additional Settings</TabsTrigger>
                  <TabsTrigger value="print">Print Options</TabsTrigger>
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
                            <Input placeholder="Enter option code" {...field} />
                          </FormControl>
                          <FormDescription>A unique identifier for this option.</FormDescription>
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
                            <Input placeholder="Enter option description" {...field} />
                          </FormControl>
                          <FormDescription>A brief description of this option.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="optionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Option Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select option type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="service">Service</SelectItem>
                              <SelectItem value="insurance">Insurance</SelectItem>
                              <SelectItem value="fee">Fee</SelectItem>
                              <SelectItem value="discount">Discount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="calculationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calculation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select calculation type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="rental">Per Rental</SelectItem>
                              <SelectItem value="percentage">Percentage</SelectItem>
                              <SelectItem value="fixed">Fixed Amount</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="excessWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excess Weight (1-250)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={250}
                            placeholder="Enter excess weight"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormDescription>Weight value between 1 and 250.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="limitationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limitation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select limitation type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="rental">Per Rental</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="minimumCharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Charge</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter minimum charge"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              value={field.value === undefined ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maximumCharge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Charge</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter maximum charge"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              value={field.value === undefined ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="replacementFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Replacement Fee</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="Enter replacement fee"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              value={field.value === undefined ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="mandatorySurcharge"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Mandatory Surcharge</FormLabel>
                          <FormDescription>Is this option a mandatory surcharge?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Additional Settings Tab */}
                <TabsContent value="settings" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="multipleItems"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Customer may rent more than one item</FormLabel>
                          <FormDescription>Allow customers to rent multiple items of this option.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryTaxExempt"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Primary Tax Exempt</FormLabel>
                          <FormDescription>Exempt this option from primary tax.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryTaxExempt"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Secondary Tax Exempt</FormLabel>
                          <FormDescription>Exempt this option from secondary tax.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>Is this option active and available for use?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preventPriceChange"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Prevent User Price Change</FormLabel>
                          <FormDescription>Prevent users from changing the price of this option.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leasing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Leasing</FormLabel>
                          <FormDescription>Is this option available for leasing?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter commission rate"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            value={field.value === undefined ? "" : field.value}
                          />
                        </FormControl>
                        <FormDescription>Commission rate percentage for this option.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Print Options Tab */}
                <TabsContent value="print" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="printText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Print Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter text to print on documents" {...field} />
                        </FormControl>
                        <FormDescription>Text to be printed on rental documents.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="printMemo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Print Memo</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter memo text to print on documents"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Additional memo text to be printed on rental documents.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/company/finance/additional-options">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Option" : "Save Option"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  )
}
