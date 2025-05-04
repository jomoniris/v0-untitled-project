"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { z } from "zod"

// Define the zone schema for validation
const zoneSchema = z.object({
  code: z.string().min(2).max(20),
  description: z.string().min(5).max(100),
  belongsTo: z.string().optional(),
  timeZone: z.string(),
  active: z.boolean().default(true),
})

export type ZoneFormValues = z.infer<typeof zoneSchema>
export type Zone = ZoneFormValues & { id: string }

// Get all zones
export async function getZones() {
  try {
    const zones = await sql<Zone[]>`
      SELECT id, code, description, belongs_to as "belongsTo", time_zone as "timeZone", active
      FROM zones
      ORDER BY code
    `
    return { zones, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { zones: [], error: "Failed to fetch zones" }
  }
}

// Get a zone by ID
export async function getZoneById(id: string) {
  try {
    const [zone] = await sql<Zone[]>`
      SELECT id, code, description, belongs_to as "belongsTo", time_zone as "timeZone", active
      FROM zones
      WHERE id = ${id}
    `
    return { zone, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { zone: null, error: "Failed to fetch zone" }
  }
}

// Create a new zone
export async function createZone(data: ZoneFormValues) {
  try {
    // Validate the data
    const validatedData = zoneSchema.parse(data)

    // Insert the zone into the database
    const [zone] = await sql<Zone[]>`
      INSERT INTO zones (code, description, belongs_to, time_zone, active)
      VALUES (
        ${validatedData.code},
        ${validatedData.description},
        ${validatedData.belongsTo || null},
        ${validatedData.timeZone},
        ${validatedData.active}
      )
      RETURNING id, code, description, belongs_to as "belongsTo", time_zone as "timeZone", active
    `

    revalidatePath("/admin/company/locations/zone")
    return { zone, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { zone: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { zone: null, error: "Failed to create zone" }
  }
}

// Update a zone
export async function updateZone(id: string, data: ZoneFormValues) {
  try {
    // Validate the data
    const validatedData = zoneSchema.parse(data)

    // Update the zone in the database
    const [zone] = await sql<Zone[]>`
      UPDATE zones
      SET 
        code = ${validatedData.code},
        description = ${validatedData.description},
        belongs_to = ${validatedData.belongsTo || null},
        time_zone = ${validatedData.timeZone},
        active = ${validatedData.active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, code, description, belongs_to as "belongsTo", time_zone as "timeZone", active
    `

    revalidatePath("/admin/company/locations/zone")
    revalidatePath(`/admin/company/locations/zone/${id}`)
    return { zone, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { zone: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { zone: null, error: "Failed to update zone" }
  }
}

// Delete a zone
export async function deleteZone(id: string) {
  try {
    await sql`
      DELETE FROM zones
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/locations/zone")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to delete zone" }
  }
}

// Toggle zone status
export async function toggleZoneStatus(id: string, currentStatus: boolean) {
  try {
    await sql`
      UPDATE zones
      SET active = ${!currentStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/locations/zone")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to update zone status" }
  }
}
