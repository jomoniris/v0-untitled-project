"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { z } from "zod"

// Define the vehicle group schema for validation
const vehicleGroupSchema = z.object({
  code: z.string().min(2).max(10),
  description: z.string().min(3).max(100),
  sipCode: z.string().min(2).max(10).optional(),
  class: z.string().min(1),
  autoAllocate: z.boolean().default(true),
  fuelType: z.string().min(1),
  tankCapacity: z.number().int().positive().optional(),
  doors: z.number().int().positive(),
  suitcases: z.number().int().nonnegative().optional(),
  pax: z.number().int().positive(),
  bags: z.number().int().nonnegative().optional(),
  minAge: z.number().int().positive().optional(),
  youngDriverLimit: z.number().int().positive().optional(),
  maxAgeLimit: z.number().int().positive().optional(),
  drivingYears: z.number().int().nonnegative().optional(),
  seniorLimit: z.number().int().positive().optional(),
  upgradeMode: z.string().optional(),
  alternateGroups: z.string().optional(),
  imagePath: z.string().optional().nullable(), // Updated to allow null values
})

export type VehicleGroupFormValues = z.infer<typeof vehicleGroupSchema>
export type VehicleGroup = VehicleGroupFormValues & { id: string }

// Get all vehicle groups
export async function getVehicleGroups() {
  try {
    const groups = await sql<VehicleGroup[]>`
      SELECT 
        id, 
        code, 
        description, 
        sip_code as "sipCode", 
        class, 
        auto_allocate as "autoAllocate",
        fuel_type as "fuelType",
        tank_capacity as "tankCapacity",
        doors,
        suitcases,
        pax,
        bags,
        min_age as "minAge",
        young_driver_limit as "youngDriverLimit",
        max_age_limit as "maxAgeLimit",
        driving_years as "drivingYears",
        senior_limit as "seniorLimit",
        upgrade_mode as "upgradeMode",
        alternate_groups as "alternateGroups",
        image_path as "imagePath"
      FROM vehicle_groups
      ORDER BY code
    `
    return { groups, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { groups: [], error: "Failed to fetch vehicle groups" }
  }
}

// Get a vehicle group by ID
export async function getVehicleGroupById(id: string) {
  try {
    const [group] = await sql<VehicleGroup[]>`
      SELECT 
        id, 
        code, 
        description, 
        sip_code as "sipCode", 
        class, 
        auto_allocate as "autoAllocate",
        fuel_type as "fuelType",
        tank_capacity as "tankCapacity",
        doors,
        suitcases,
        pax,
        bags,
        min_age as "minAge",
        young_driver_limit as "youngDriverLimit",
        max_age_limit as "maxAgeLimit",
        driving_years as "drivingYears",
        senior_limit as "seniorLimit",
        upgrade_mode as "upgradeMode",
        alternate_groups as "alternateGroups",
        image_path as "imagePath"
      FROM vehicle_groups
      WHERE id = ${id}
    `
    return { group, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { group: null, error: "Failed to fetch vehicle group" }
  }
}

// Create a new vehicle group
export async function createVehicleGroup(data: VehicleGroupFormValues) {
  try {
    // Validate the data
    const validatedData = vehicleGroupSchema.parse(data)

    // Insert the vehicle group into the database
    const [group] = await sql<{ id: string }[]>`
      INSERT INTO vehicle_groups (
        code, 
        description, 
        sip_code, 
        class, 
        auto_allocate,
        fuel_type,
        tank_capacity,
        doors,
        suitcases,
        pax,
        bags,
        min_age,
        young_driver_limit,
        max_age_limit,
        driving_years,
        senior_limit,
        upgrade_mode,
        alternate_groups,
        image_path
      )
      VALUES (
        ${validatedData.code},
        ${validatedData.description},
        ${validatedData.sipCode || null},
        ${validatedData.class},
        ${validatedData.autoAllocate},
        ${validatedData.fuelType},
        ${validatedData.tankCapacity || null},
        ${validatedData.doors},
        ${validatedData.suitcases || null},
        ${validatedData.pax},
        ${validatedData.bags || null},
        ${validatedData.minAge || null},
        ${validatedData.youngDriverLimit || null},
        ${validatedData.maxAgeLimit || null},
        ${validatedData.drivingYears || null},
        ${validatedData.seniorLimit || null},
        ${validatedData.upgradeMode || null},
        ${validatedData.alternateGroups || null},
        ${validatedData.imagePath || null}
      )
      RETURNING id
    `

    revalidatePath("/admin/company/fleet/vehicle-group")
    return { group, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { group: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { group: null, error: "Failed to create vehicle group" }
  }
}

// Update a vehicle group
export async function updateVehicleGroup(id: string, data: VehicleGroupFormValues) {
  try {
    // Validate the data
    const validatedData = vehicleGroupSchema.parse(data)

    // Update the vehicle group in the database
    const [group] = await sql<{ id: string }[]>`
      UPDATE vehicle_groups
      SET 
        code = ${validatedData.code},
        description = ${validatedData.description},
        sip_code = ${validatedData.sipCode || null},
        class = ${validatedData.class},
        auto_allocate = ${validatedData.autoAllocate},
        fuel_type = ${validatedData.fuelType},
        tank_capacity = ${validatedData.tankCapacity || null},
        doors = ${validatedData.doors},
        suitcases = ${validatedData.suitcases || null},
        pax = ${validatedData.pax},
        bags = ${validatedData.bags || null},
        min_age = ${validatedData.minAge || null},
        young_driver_limit = ${validatedData.youngDriverLimit || null},
        max_age_limit = ${validatedData.maxAgeLimit || null},
        driving_years = ${validatedData.drivingYears || null},
        senior_limit = ${validatedData.seniorLimit || null},
        upgrade_mode = ${validatedData.upgradeMode || null},
        alternate_groups = ${validatedData.alternateGroups || null},
        image_path = ${validatedData.imagePath || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `

    revalidatePath("/admin/company/fleet/vehicle-group")
    revalidatePath(`/admin/company/fleet/vehicle-group/${id}/view`)
    revalidatePath(`/admin/company/fleet/vehicle-group/${id}/edit`)
    return { group, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { group: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { group: null, error: "Failed to update vehicle group" }
  }
}

// Delete a vehicle group
export async function deleteVehicleGroup(id: string) {
  try {
    await sql`
      DELETE FROM vehicle_groups
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/fleet/vehicle-group")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to delete vehicle group" }
  }
}
