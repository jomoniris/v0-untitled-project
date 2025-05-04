"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { z } from "zod"

// Define the location schema for validation
const locationSchema = z.object({
  code: z.string().min(2).max(10),
  name: z.string().min(3).max(100),
  metroplex: z.string().min(1),
  stationType: z.string().min(1),
  operatingHours: z.string().min(1),
  tax1: z.string().optional(),
  tax2: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  state: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  telephone: z.string().optional(),
  fax: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  nominalAccount: z.string().optional(),
  dbrNextNo: z.string().optional(),
  dbrDate: z.string().optional(),
  stationManager: z.string().optional(),
  active: z.boolean().default(true),
})

export type LocationFormValues = z.infer<typeof locationSchema>
export type Location = LocationFormValues & { id: string }

// Get all locations
export async function getLocations() {
  try {
    const locations = await sql<Location[]>`
      SELECT 
        id, 
        code, 
        name, 
        metroplex, 
        station_type as "stationType", 
        operating_hours as "operatingHours",
        tax1,
        tax2,
        address,
        city,
        postal_code as "postalCode",
        country,
        state,
        email,
        telephone,
        fax,
        latitude,
        longitude,
        nominal_account as "nominalAccount",
        dbr_next_no as "dbrNextNo",
        dbr_date as "dbrDate",
        station_manager as "stationManager",
        active
      FROM locations
      ORDER BY name
    `
    return { locations, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { locations: [], error: "Failed to fetch locations" }
  }
}

// Get a location by ID
export async function getLocationById(id: string) {
  try {
    const [location] = await sql<Location[]>`
      SELECT 
        id, 
        code, 
        name, 
        metroplex, 
        station_type as "stationType", 
        operating_hours as "operatingHours",
        tax1,
        tax2,
        address,
        city,
        postal_code as "postalCode",
        country,
        state,
        email,
        telephone,
        fax,
        latitude,
        longitude,
        nominal_account as "nominalAccount",
        dbr_next_no as "dbrNextNo",
        dbr_date as "dbrDate",
        station_manager as "stationManager",
        active
      FROM locations
      WHERE id = ${id}
    `
    return { location, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { location: null, error: "Failed to fetch location" }
  }
}

// Create a new location
export async function createLocation(data: LocationFormValues) {
  try {
    // Validate the data
    const validatedData = locationSchema.parse(data)

    // Insert the location into the database
    const [location] = await sql<Location[]>`
      INSERT INTO locations (
        code, 
        name, 
        metroplex, 
        station_type, 
        operating_hours,
        tax1,
        tax2,
        address,
        city,
        postal_code,
        country,
        state,
        email,
        telephone,
        fax,
        latitude,
        longitude,
        nominal_account,
        dbr_next_no,
        dbr_date,
        station_manager,
        active
      )
      VALUES (
        ${validatedData.code},
        ${validatedData.name},
        ${validatedData.metroplex},
        ${validatedData.stationType},
        ${validatedData.operatingHours},
        ${validatedData.tax1 || null},
        ${validatedData.tax2 || null},
        ${validatedData.address},
        ${validatedData.city},
        ${validatedData.postalCode},
        ${validatedData.country},
        ${validatedData.state},
        ${validatedData.email || null},
        ${validatedData.telephone || null},
        ${validatedData.fax || null},
        ${validatedData.latitude || null},
        ${validatedData.longitude || null},
        ${validatedData.nominalAccount || null},
        ${validatedData.dbrNextNo || null},
        ${validatedData.dbrDate || null},
        ${validatedData.stationManager || null},
        ${validatedData.active}
      )
      RETURNING id
    `

    revalidatePath("/admin/company/locations")
    return { location, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { location: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { location: null, error: "Failed to create location" }
  }
}

// Update a location
export async function updateLocation(id: string, data: LocationFormValues) {
  try {
    // Validate the data
    const validatedData = locationSchema.parse(data)

    // Update the location in the database
    const [location] = await sql<Location[]>`
      UPDATE locations
      SET 
        code = ${validatedData.code},
        name = ${validatedData.name},
        metroplex = ${validatedData.metroplex},
        station_type = ${validatedData.stationType},
        operating_hours = ${validatedData.operatingHours},
        tax1 = ${validatedData.tax1 || null},
        tax2 = ${validatedData.tax2 || null},
        address = ${validatedData.address},
        city = ${validatedData.city},
        postal_code = ${validatedData.postalCode},
        country = ${validatedData.country},
        state = ${validatedData.state},
        email = ${validatedData.email || null},
        telephone = ${validatedData.telephone || null},
        fax = ${validatedData.fax || null},
        latitude = ${validatedData.latitude || null},
        longitude = ${validatedData.longitude || null},
        nominal_account = ${validatedData.nominalAccount || null},
        dbr_next_no = ${validatedData.dbrNextNo || null},
        dbr_date = ${validatedData.dbrDate || null},
        station_manager = ${validatedData.stationManager || null},
        active = ${validatedData.active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `

    revalidatePath("/admin/company/locations")
    revalidatePath(`/admin/company/locations/${id}/view`)
    revalidatePath(`/admin/company/locations/${id}/edit`)
    return { location, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { location: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { location: null, error: "Failed to update location" }
  }
}

// Delete a location
export async function deleteLocation(id: string) {
  try {
    await sql`
      DELETE FROM locations
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/locations")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to delete location" }
  }
}

// Toggle location status
export async function toggleLocationStatus(id: string, currentStatus: boolean) {
  try {
    await sql`
      UPDATE locations
      SET active = ${!currentStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/locations")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to update location status" }
  }
}
