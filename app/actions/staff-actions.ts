"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { z } from "zod"

// Define the staff schema for validation
const staffSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  passwordHash: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .optional(),
  mobile: z.string().optional(),
  workPhone: z.string().optional(),
  role: z.string({
    required_error: "Please select a role.",
  }),
  reportsTo: z.number().optional().nullable(),
  team: z.string({
    required_error: "Please select a team.",
  }),
  active: z.boolean().default(true),
})

export type StaffFormValues = z.infer<typeof staffSchema>
export type Staff = Omit<StaffFormValues, "passwordHash"> & {
  id: string
  accessLocations?: string[]
}

// Get all staff members
export async function getStaffMembers() {
  try {
    const staff = await sql<Staff[]>`
      SELECT 
        id, 
        full_name as "fullName", 
        username, 
        email, 
        mobile, 
        work_phone as "workPhone", 
        role, 
        reports_to as "reportsTo", 
        team, 
        active
      FROM staff
      ORDER BY full_name
    `
    return { staff, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { staff: [], error: "Failed to fetch staff members" }
  }
}

// Get a staff member by ID
export async function getStaffMemberById(id: string) {
  try {
    const [staff] = await sql<Staff[]>`
      SELECT 
        id, 
        full_name as "fullName", 
        username, 
        email, 
        mobile, 
        work_phone as "workPhone", 
        role, 
        reports_to as "reportsTo", 
        team, 
        active
      FROM staff
      WHERE id = ${id}
    `

    // Get access locations for this staff member
    const accessLocations = await sql<{ location_id: string }[]>`
      SELECT location_id
      FROM staff_access_locations
      WHERE staff_id = ${id}
    `

    if (staff) {
      staff.accessLocations = accessLocations.map((loc) => loc.location_id)
    }

    return { staff, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { staff: null, error: "Failed to fetch staff member" }
  }
}

// Get all locations for dropdown
export async function getLocationsForDropdown() {
  try {
    const locations = await sql<{ id: string; name: string }[]>`
      SELECT id, name
      FROM locations
      WHERE active = true
      ORDER BY name
    `
    return { locations, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { locations: [], error: "Failed to fetch locations" }
  }
}

// Get all staff members for reports-to dropdown
export async function getStaffForDropdown() {
  try {
    const staff = await sql<{ id: string; fullName: string }[]>`
      SELECT id, full_name as "fullName"
      FROM staff
      WHERE active = true
      ORDER BY full_name
    `
    return { staff, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { staff: [], error: "Failed to fetch staff members" }
  }
}

// Create a new staff member
export async function createStaffMember(data: StaffFormValues & { accessLocations: string[] }) {
  try {
    // Validate the data
    const { accessLocations, ...validatedData } = staffSchema.parse(data)

    // Insert the staff member into the database
    const [staff] = await sql<{ id: string }[]>`
      INSERT INTO staff (
        full_name, 
        username, 
        email, 
        password_hash, 
        mobile, 
        work_phone, 
        role, 
        reports_to, 
        team, 
        active
      )
      VALUES (
        ${validatedData.fullName},
        ${validatedData.username},
        ${validatedData.email},
        ${validatedData.passwordHash},
        ${validatedData.mobile || null},
        ${validatedData.workPhone || null},
        ${validatedData.role},
        ${validatedData.reportsTo || null},
        ${validatedData.team},
        ${validatedData.active}
      )
      RETURNING id
    `

    // Insert access locations
    if (accessLocations && accessLocations.length > 0) {
      for (const locationId of accessLocations) {
        await sql`
          INSERT INTO staff_access_locations (staff_id, location_id)
          VALUES (${staff.id}, ${locationId})
        `
      }
    }

    revalidatePath("/admin/company/staff")
    return { staff, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { staff: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { staff: null, error: "Failed to create staff member" }
  }
}

// Update a staff member
export async function updateStaffMember(id: string, data: StaffFormValues & { accessLocations: string[] }) {
  try {
    // Validate the data
    const { accessLocations, ...validatedData } = staffSchema.parse(data)

    // Update the staff member in the database
    const [staff] = await sql<{ id: string }[]>`
      UPDATE staff
      SET 
        full_name = ${validatedData.fullName},
        username = ${validatedData.username},
        email = ${validatedData.email},
        ${validatedData.passwordHash ? sql`password_hash = ${validatedData.passwordHash},` : sql``}
        mobile = ${validatedData.mobile || null},
        work_phone = ${validatedData.workPhone || null},
        role = ${validatedData.role},
        reports_to = ${validatedData.reportsTo || null},
        team = ${validatedData.team},
        active = ${validatedData.active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `

    // Update access locations
    // First, delete all existing access locations
    await sql`
      DELETE FROM staff_access_locations
      WHERE staff_id = ${id}
    `

    // Then, insert new access locations
    if (accessLocations && accessLocations.length > 0) {
      for (const locationId of accessLocations) {
        await sql`
          INSERT INTO staff_access_locations (staff_id, location_id)
          VALUES (${id}, ${locationId})
        `
      }
    }

    revalidatePath("/admin/company/staff")
    revalidatePath(`/admin/company/staff/${id}/view`)
    revalidatePath(`/admin/company/staff/${id}/edit`)
    return { staff, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { staff: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { staff: null, error: "Failed to update staff member" }
  }
}

// Delete a staff member
export async function deleteStaffMember(id: string) {
  try {
    // First, delete all access locations for this staff member
    await sql`
      DELETE FROM staff_access_locations
      WHERE staff_id = ${id}
    `

    // Then, delete the staff member
    await sql`
      DELETE FROM staff
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/staff")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to delete staff member" }
  }
}

// Toggle staff member status
export async function toggleStaffStatus(id: string, currentStatus: boolean) {
  try {
    await sql`
      UPDATE staff
      SET active = ${!currentStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/staff")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to update staff member status" }
  }
}
