"use server"

import { revalidatePath } from "next/cache"
import { neon } from "@neondatabase/serverless"
import { z } from "zod"

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL!)

// Define the location schema for validation
const locationSchema = z.object({
  code: z
    .string()
    .min(2, { message: "Code must be at least 2 characters" })
    .max(10, { message: "Code must not exceed 10 characters" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(100, { message: "Name must not exceed 100 characters" }),
  metroplex: z.string().min(1, { message: "Metroplex is required" }),
  stationType: z.string().min(1, { message: "Station type is required" }),
  operatingHours: z.string().min(1, { message: "Operating hours are required" }),
  tax1: z.string().optional(),
  tax2: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  postalCode: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
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
    const locations = await sql`
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

    // Fallback to static data if database is not available
    const staticLocations = [
      {
        id: "1",
        code: "NYC-DT",
        name: "Downtown Office",
        metroplex: "New York",
        stationType: "Full Service",
        operatingHours: "8:00 AM - 8:00 PM",
        tax1: "8.875",
        tax2: "0",
        address: "123 Main St",
        city: "New York",
        postalCode: "10001",
        country: "USA",
        state: "NY",
        email: "nyc.downtown@example.com",
        telephone: "+1 (212) 555-1234",
        fax: "+1 (212) 555-5678",
        latitude: "40.7128",
        longitude: "-74.0060",
        nominalAccount: "NYC-001",
        dbrNextNo: "10001",
        dbrDate: "2023-04-15",
        stationManager: "John Smith",
        active: true,
      },
      {
        id: "2",
        code: "NYC-AP",
        name: "Airport Terminal",
        metroplex: "New York",
        stationType: "Airport",
        operatingHours: "24/7",
        tax1: "8.875",
        tax2: "0",
        address: "JFK Airport, Terminal 4",
        city: "New York",
        postalCode: "11430",
        country: "USA",
        state: "NY",
        email: "nyc.airport@example.com",
        telephone: "+1 (212) 555-4321",
        fax: "+1 (212) 555-8765",
        latitude: "40.6413",
        longitude: "-73.7781",
        nominalAccount: "NYC-002",
        dbrNextNo: "10002",
        dbrDate: "2023-04-15",
        stationManager: "Jane Doe",
        active: true,
      },
    ]

    return { locations: staticLocations, error: "Using static data. Database connection failed." }
  }
}

// Get a location by ID
export async function getLocationById(id: string) {
  try {
    const [location] = await sql`
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

    if (!location) {
      return { location: null, error: "Location not found" }
    }

    return { location, error: null }
  } catch (error) {
    console.error("Database error:", error)

    // Fallback to static data if database is not available
    if (id === "1") {
      const location = {
        id: "1",
        code: "NYC-DT",
        name: "Downtown Office",
        metroplex: "New York",
        stationType: "Full Service",
        operatingHours: "8:00 AM - 8:00 PM",
        tax1: "8.875",
        tax2: "0",
        address: "123 Main St",
        city: "New York",
        postalCode: "10001",
        country: "USA",
        state: "NY",
        email: "nyc.downtown@example.com",
        telephone: "+1 (212) 555-1234",
        fax: "+1 (212) 555-5678",
        latitude: "40.7128",
        longitude: "-74.0060",
        nominalAccount: "NYC-001",
        dbrNextNo: "10001",
        dbrDate: "2023-04-15",
        stationManager: "John Smith",
        active: true,
      }
      return { location, error: "Using static data. Database connection failed." }
    }

    return { location: null, error: "Location not found or database error occurred" }
  }
}

// Create a new location
export async function createLocation(data: LocationFormValues) {
  try {
    // Validate the data
    const validatedData = locationSchema.parse(data)

    // Insert the location into the database
    const [location] = await sql`
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
    return { success: true, location, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, location: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { success: false, location: null, error: "Failed to create location" }
  }
}

// Update a location
export async function updateLocation(id: string, data: LocationFormValues) {
  try {
    // Validate the data
    const validatedData = locationSchema.parse(data)

    // Update the location in the database
    const [location] = await sql`
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
    return { success: true, location, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { success: false, location: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { success: false, location: null, error: "Failed to update location" }
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
    return { success: true, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to delete location" }
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
    return { success: true, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to update location status" }
  }
}
