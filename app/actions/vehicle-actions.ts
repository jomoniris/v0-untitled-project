"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { z } from "zod"

// Define the vehicle schema for validation
const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .min(1, "Year is required")
    .regex(/^\d{4}$/, "Must be a valid year"),
  licensePlate: z.string().min(1, "License plate is required"),
  vin: z.string().min(1, "VIN is required"),
  color: z.string().min(1, "Color is required"),
  transmission: z.enum(["automatic", "manual", "semi-automatic"]),
  fuelType: z.enum(["gasoline", "diesel", "electric", "hybrid", "plugin_hybrid"]),
  mileage: z.string().min(1, "Mileage is required").regex(/^\d+$/, "Must be a number"),
  seats: z.string().min(1, "Number of seats is required").regex(/^\d+$/, "Must be a number"),
  doors: z.string().min(1, "Number of doors is required").regex(/^\d+$/, "Must be a number"),
  engineSize: z.string().optional(),
  status: z.enum(["available", "rented", "maintenance", "cleaning", "transit"]),
  vehicleGroup: z.string().min(1, "Vehicle group is required"),
  location: z.string().min(1, "Location is required"),
  airConditioning: z.boolean().default(false),
  navigation: z.boolean().default(false),
  bluetooth: z.boolean().default(false),
  cruiseControl: z.boolean().default(false),
  parkingSensors: z.boolean().default(false),
  backupCamera: z.boolean().default(false),
  leatherSeats: z.boolean().default(false),
  sunroof: z.boolean().default(false),
  description: z.string().optional(),
  notes: z.string().optional(),
  insurancePolicy: z.string().optional(),
  lastMaintenanceDate: z.string().optional(),
  nextMaintenanceDate: z.string().optional(),
  maintenanceNotes: z.string().optional(),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>
export type Vehicle = VehicleFormValues & {
  id: string
  locationName?: string
  vehicleGroupName?: string
}

// Get all vehicles
export async function getVehicles() {
  try {
    const vehicles = await sql<Vehicle[]>`
      SELECT 
        v.id, 
        v.license_plate as "licensePlate", 
        v.make, 
        v.model, 
        v.year, 
        v.vin, 
        v.color, 
        v.transmission, 
        v.fuel_type as "fuelType", 
        v.mileage, 
        v.seats, 
        v.doors, 
        v.engine_size as "engineSize", 
        v.status, 
        v.vehicle_group_id as "vehicleGroup", 
        v.location_id as "location",
        v.air_conditioning as "airConditioning", 
        v.navigation, 
        v.bluetooth, 
        v.cruise_control as "cruiseControl", 
        v.parking_sensors as "parkingSensors", 
        v.backup_camera as "backupCamera", 
        v.leather_seats as "leatherSeats", 
        v.sunroof, 
        v.description, 
        v.notes, 
        v.insurance_policy as "insurancePolicy", 
        v.last_maintenance_date as "lastMaintenanceDate", 
        v.next_maintenance_date as "nextMaintenanceDate", 
        v.maintenance_notes as "maintenanceNotes",
        l.name as "locationName",
        vg.description as "vehicleGroupName"
      FROM vehicles v
      LEFT JOIN locations l ON v.location_id = l.id
      LEFT JOIN vehicle_groups vg ON v.vehicle_group_id = vg.id
      ORDER BY v.make, v.model
    `
    return { vehicles, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { vehicles: [], error: "Failed to fetch vehicles" }
  }
}

// Get a vehicle by ID
export async function getVehicleById(id: string) {
  try {
    const [vehicle] = await sql<Vehicle[]>`
      SELECT 
        v.id, 
        v.license_plate as "licensePlate", 
        v.make, 
        v.model, 
        v.year, 
        v.vin, 
        v.color, 
        v.transmission, 
        v.fuel_type as "fuelType", 
        v.mileage, 
        v.seats, 
        v.doors, 
        v.engine_size as "engineSize", 
        v.status, 
        v.vehicle_group_id as "vehicleGroup", 
        v.location_id as "location",
        v.air_conditioning as "airConditioning", 
        v.navigation, 
        v.bluetooth, 
        v.cruise_control as "cruiseControl", 
        v.parking_sensors as "parkingSensors", 
        v.backup_camera as "backupCamera", 
        v.leather_seats as "leatherSeats", 
        v.sunroof, 
        v.description, 
        v.notes, 
        v.insurance_policy as "insurancePolicy", 
        v.last_maintenance_date as "lastMaintenanceDate", 
        v.next_maintenance_date as "nextMaintenanceDate", 
        v.maintenance_notes as "maintenanceNotes",
        l.name as "locationName",
        vg.description as "vehicleGroupName"
      FROM vehicles v
      LEFT JOIN locations l ON v.location_id = l.id
      LEFT JOIN vehicle_groups vg ON v.vehicle_group_id = vg.id
      WHERE v.id = ${id}
    `
    return { vehicle, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { vehicle: null, error: "Failed to fetch vehicle" }
  }
}

// Create a new vehicle
export async function createVehicle(data: VehicleFormValues) {
  try {
    // Validate the data
    const validatedData = vehicleSchema.parse(data)

    // Convert string values to numbers where needed
    const mileage = Number.parseInt(validatedData.mileage)
    const seats = Number.parseInt(validatedData.seats)
    const doors = Number.parseInt(validatedData.doors)
    const year = Number.parseInt(validatedData.year)

    // Insert the vehicle into the database
    const [vehicle] = await sql<{ id: string }[]>`
      INSERT INTO vehicles (
        make,
        model,
        year,
        license_plate,
        vin,
        color,
        transmission,
        fuel_type,
        mileage,
        seats,
        doors,
        engine_size,
        status,
        vehicle_group_id,
        location_id,
        air_conditioning,
        navigation,
        bluetooth,
        cruise_control,
        parking_sensors,
        backup_camera,
        leather_seats,
        sunroof,
        description,
        notes,
        insurance_policy,
        last_maintenance_date,
        next_maintenance_date,
        maintenance_notes
      )
      VALUES (
        ${validatedData.make},
        ${validatedData.model},
        ${year},
        ${validatedData.licensePlate},
        ${validatedData.vin},
        ${validatedData.color},
        ${validatedData.transmission},
        ${validatedData.fuelType},
        ${mileage},
        ${seats},
        ${doors},
        ${validatedData.engineSize || null},
        ${validatedData.status},
        ${validatedData.vehicleGroup},
        ${validatedData.location},
        ${validatedData.airConditioning},
        ${validatedData.navigation},
        ${validatedData.bluetooth},
        ${validatedData.cruiseControl},
        ${validatedData.parkingSensors},
        ${validatedData.backupCamera},
        ${validatedData.leatherSeats},
        ${validatedData.sunroof},
        ${validatedData.description || null},
        ${validatedData.notes || null},
        ${validatedData.insurancePolicy || null},
        ${validatedData.lastMaintenanceDate || null},
        ${validatedData.nextMaintenanceDate || null},
        ${validatedData.maintenanceNotes || null}
      )
      RETURNING id
    `

    revalidatePath("/admin/vehicles")
    return { vehicle, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { vehicle: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { vehicle: null, error: "Failed to create vehicle" }
  }
}

// Update a vehicle
export async function updateVehicle(id: string, data: VehicleFormValues) {
  try {
    // Validate the data
    const validatedData = vehicleSchema.parse(data)

    // Convert string values to numbers where needed
    const mileage = Number.parseInt(validatedData.mileage)
    const seats = Number.parseInt(validatedData.seats)
    const doors = Number.parseInt(validatedData.doors)
    const year = Number.parseInt(validatedData.year)

    // Update the vehicle in the database
    const [vehicle] = await sql<{ id: string }[]>`
      UPDATE vehicles
      SET 
        make = ${validatedData.make},
        model = ${validatedData.model},
        year = ${year},
        license_plate = ${validatedData.licensePlate},
        vin = ${validatedData.vin},
        color = ${validatedData.color},
        transmission = ${validatedData.transmission},
        fuel_type = ${validatedData.fuelType},
        mileage = ${mileage},
        seats = ${seats},
        doors = ${doors},
        engine_size = ${validatedData.engineSize || null},
        status = ${validatedData.status},
        vehicle_group_id = ${validatedData.vehicleGroup},
        location_id = ${validatedData.location},
        air_conditioning = ${validatedData.airConditioning},
        navigation = ${validatedData.navigation},
        bluetooth = ${validatedData.bluetooth},
        cruise_control = ${validatedData.cruiseControl},
        parking_sensors = ${validatedData.parkingSensors},
        backup_camera = ${validatedData.backupCamera},
        leather_seats = ${validatedData.leatherSeats},
        sunroof = ${validatedData.sunroof},
        description = ${validatedData.description || null},
        notes = ${validatedData.notes || null},
        insurance_policy = ${validatedData.insurancePolicy || null},
        last_maintenance_date = ${validatedData.lastMaintenanceDate || null},
        next_maintenance_date = ${validatedData.nextMaintenanceDate || null},
        maintenance_notes = ${validatedData.maintenanceNotes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `

    revalidatePath("/admin/vehicles")
    revalidatePath(`/admin/vehicles/${id}/view`)
    revalidatePath(`/admin/vehicles/${id}/edit`)
    return { vehicle, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { vehicle: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { vehicle: null, error: "Failed to update vehicle" }
  }
}

// Delete a vehicle
export async function deleteVehicle(id: string) {
  try {
    await sql`
      DELETE FROM vehicles
      WHERE id = ${id}
    `

    revalidatePath("/admin/vehicles")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to delete vehicle" }
  }
}

// Get vehicle groups for dropdown
export async function getVehicleGroups() {
  try {
    const groups = await sql<{ id: string; name: string }[]>`
      SELECT id, description as name
      FROM vehicle_groups
      ORDER BY description
    `
    return { groups, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { groups: [], error: "Failed to fetch vehicle groups" }
  }
}

// Get locations for dropdown
export async function getLocations() {
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
