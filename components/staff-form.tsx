"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelectBasic } from "@/components/ui/multi-select-basic"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import {
  createStaffMember,
  updateStaffMember,
  getLocationsForDropdown,
  getStaffForDropdown,
} from "@/app/actions/staff-actions"

// Define roles
const roles = [
  { label: "Administrator", value: "Administrator" },
  { label: "Manager", value: "Manager" },
  { label: "Agent", value: "Agent" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Finance", value: "Finance" },
  { label: "Customer Support", value: "Customer Support" },
]

// Define teams
const teams = [
  { label: "Operations", value: "Operations" },
  { label: "Sales", value: "Sales" },
  { label: "Customer Service", value: "Customer Service" },
  { label: "Fleet Management", value: "Fleet Management" },
  { label: "Administration", value: "Administration" },
]

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  active: z.boolean().default(true),
  accessLocations: z.array(z.string()).min(1, {
    message: "Please select at least one location.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  mobile: z
    .string()
    .min(10, {
      message: "Mobile number must be at least 10 characters.",
    })
    .optional(),
  workPhone: z
    .string()
    .min(10, {
      message: "Work phone must be at least 10 characters.",
    })
    .optional(),
  role: z.string({
    required_error: "Please select a role.",
  }),
  reportsTo: z.string().optional(),
  team: z.string({
    required_error: "Please select a team.",
  }),
})

type StaffFormValues = z.infer<typeof formSchema>

interface StaffFormProps {
  initialData?: Partial<StaffFormValues>
  id?: string
}

export function StaffForm({ initialData, id }: StaffFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState<{ label: string; value: string }[]>([])
  const [staffMembers, setStaffMembers] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    async function loadData() {
      // Load locations for dropdown
      const { locations, error: locError } = await getLocationsForDropdown()
      if (!locError) {
        setLocations(locations.map((loc) => ({ label: loc.name, value: loc.id })))
      }

      // Load staff members for reports-to dropdown
      const { staff, error: staffError } = await getStaffForDropdown()
      if (!staffError) {
        setStaffMembers(staff.map((s) => ({ label: s.fullName, value: s.id })))
      }
    }

    loadData()
  }, [])

  const defaultValues: Partial<StaffFormValues> = {
    fullName: "",
    username: "",
    active: true,
    accessLocations: [],
    password: "",
    email: "",
    mobile: "",
    workPhone: "",
    role: "",
    reportsTo: "",
    team: "",
    ...initialData,
  }

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(data: StaffFormValues) {
    setIsLoading(true)

    try {
      // Prepare data for API
      const staffData = {
        ...data,
        passwordHash: data.password, // Rename for API
      }

      let result
      if (id) {
        // Update existing staff member
        result = await updateStaffMember(id, staffData)
      } else {
        // Create new staff member
        result = await createStaffMember(staffData)
      }

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: id ? "Staff updated" : "Staff created",
          description: id
            ? `${data.fullName} has been updated successfully.`
            : `${data.fullName} has been added to the staff.`,
        })

        router.push("/admin/company/staff")
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
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? "Edit Staff Member" : "Create Staff Member"}</CardTitle>
        <CardDescription>
          {id ? "Update the staff member details." : "Add a new staff member to your company."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johnsmith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.smith@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{id ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 987-6543" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
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
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.value} value={team.value}>
                            {team.label}
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
                name="reportsTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reports To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.value} value={staff.value}>
                            {staff.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accessLocations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Locations</FormLabel>
                  <FormControl>
                    <MultiSelectBasic
                      options={locations}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select locations"
                    />
                  </FormControl>
                  <FormDescription>Select the locations this staff member can access.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>This staff member will be able to log in and access the system.</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/company/staff")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : id ? "Update Staff" : "Create Staff"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
