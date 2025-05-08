"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

const sql = neon(process.env.DATABASE_URL!)

// Type definitions
export type NonRevenueMovementItem = {
  id?: string
  movement_id?: string
  supplier?: string
  start_datetime?: Date
  end_datetime?: Date
  task: string
  parts: string
  cost: number
  labor_cost: number
  vat: number
  total: number
  warranty: boolean
}

export type NonRevenueMovement = {
  id?: string
  work_order_type: string
  supplier?: string
  claim?: string
  vehicle: string
  driver: string
  movement_reason: string
  created_by: string
  status: string
  checkout_location: string
  checkin_location?: string
  checkout_datetime: Date
  checkout_mileage: number
  checkout_tank: number
  checkin_datetime?: Date
  checkin_mileage?: number
  checkin_tank?: number
  notes?: string
  items: NonRevenueMovementItem[]
}

// Create a new non-revenue movement
export async function createNonRevenueMovement(data: NonRevenueMovement) {
  try {
    // Generate a unique ID for the movement
    const movementId = `NRM-${Date.now().toString().slice(-6)}`

    // Insert the movement
    const result = await sql`
      INSERT INTO non_revenue_movements (
        id, work_order_type, supplier, claim, vehicle, driver, 
        movement_reason, created_by, status, checkout_location, 
        checkin_location, checkout_datetime, checkout_mileage, 
        checkout_tank, checkin_datetime, checkin_mileage, 
        checkin_tank, notes
      ) VALUES (
        ${movementId}, ${data.work_order_type}, ${data.supplier || null}, 
        ${data.claim || null}, ${data.vehicle}, ${data.driver}, 
        ${data.movement_reason}, ${data.created_by}, ${data.status}, 
        ${data.checkout_location}, ${data.checkin_location || null}, 
        ${data.checkout_datetime}, ${data.checkout_mileage}, 
        ${data.checkout_tank}, ${data.checkin_datetime || null}, 
        ${data.checkin_mileage || 0}, ${data.checkin_tank || 0}, 
        ${data.notes || null}
      ) RETURNING id
    `

    // Insert items if any
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        await sql`
          INSERT INTO non_revenue_movement_items (
            movement_id, supplier, start_datetime, end_datetime, 
            task, parts, cost, labor_cost, vat, total, warranty
          ) VALUES (
            ${movementId}, ${item.supplier || null}, 
            ${item.start_datetime || null}, ${item.end_datetime || null}, 
            ${item.task}, ${item.parts}, ${item.cost}, 
            ${item.labor_cost}, ${item.vat}, ${item.total}, 
            ${item.warranty}
          )
        `
      }
    }

    revalidatePath("/admin/fleet/non-revenue-movement")
    return { success: true, id: movementId }
  } catch (error) {
    console.error("Error creating non-revenue movement:", error)
    return { success: false, error: "Failed to create non-revenue movement" }
  }
}

// Get a non-revenue movement by ID
export async function getNonRevenueMovementById(id: string) {
  try {
    // Get the movement
    const movement = await sql`
      SELECT * FROM non_revenue_movements WHERE id = ${id}
    `

    if (!movement || movement.length === 0) {
      return { success: false, error: "Non-revenue movement not found" }
    }

    // Get the items
    const items = await sql`
      SELECT * FROM non_revenue_movement_items WHERE movement_id = ${id}
    `

    return {
      success: true,
      data: {
        ...movement[0],
        items: items || [],
      },
    }
  } catch (error) {
    console.error("Error getting non-revenue movement:", error)
    return { success: false, error: "Failed to get non-revenue movement" }
  }
}

// Update a non-revenue movement
export async function updateNonRevenueMovement(id: string, data: NonRevenueMovement) {
  try {
    // Update the movement
    await sql`
      UPDATE non_revenue_movements SET
        work_order_type = ${data.work_order_type},
        supplier = ${data.supplier || null},
        claim = ${data.claim || null},
        vehicle = ${data.vehicle},
        driver = ${data.driver},
        movement_reason = ${data.movement_reason},
        created_by = ${data.created_by},
        status = ${data.status},
        checkout_location = ${data.checkout_location},
        checkin_location = ${data.checkin_location || null},
        checkout_datetime = ${data.checkout_datetime},
        checkout_mileage = ${data.checkout_mileage},
        checkout_tank = ${data.checkout_tank},
        checkin_datetime = ${data.checkin_datetime || null},
        checkin_mileage = ${data.checkin_mileage || 0},
        checkin_tank = ${data.checkin_tank || 0},
        notes = ${data.notes || null}
      WHERE id = ${id}
    `

    // Delete existing items
    await sql`DELETE FROM non_revenue_movement_items WHERE movement_id = ${id}`

    // Insert new items
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        await sql`
          INSERT INTO non_revenue_movement_items (
            movement_id, supplier, start_datetime, end_datetime, 
            task, parts, cost, labor_cost, vat, total, warranty
          ) VALUES (
            ${id}, ${item.supplier || null}, 
            ${item.start_datetime || null}, ${item.end_datetime || null}, 
            ${item.task}, ${item.parts}, ${item.cost}, 
            ${item.labor_cost}, ${item.vat}, ${item.total}, 
            ${item.warranty}
          )
        `
      }
    }

    revalidatePath("/admin/fleet/non-revenue-movement")
    revalidatePath(`/admin/fleet/non-revenue-movement/${id}/view`)
    revalidatePath(`/admin/fleet/non-revenue-movement/${id}/edit`)

    return { success: true }
  } catch (error) {
    console.error("Error updating non-revenue movement:", error)
    return { success: false, error: "Failed to update non-revenue movement" }
  }
}

// Delete a non-revenue movement
export async function deleteNonRevenueMovement(id: string) {
  try {
    // Delete items first (foreign key constraint)
    await sql`DELETE FROM non_revenue_movement_items WHERE movement_id = ${id}`

    // Delete the movement
    await sql`DELETE FROM non_revenue_movements WHERE id = ${id}`

    revalidatePath("/admin/fleet/non-revenue-movement")
    return { success: true }
  } catch (error) {
    console.error("Error deleting non-revenue movement:", error)
    return { success: false, error: "Failed to delete non-revenue movement" }
  }
}

// Get all non-revenue movements
export async function getAllNonRevenueMovements() {
  try {
    const movements = await sql`
      SELECT * FROM non_revenue_movements ORDER BY checkout_datetime DESC
    `

    return { success: true, data: movements }
  } catch (error) {
    console.error("Error getting non-revenue movements:", error)
    return { success: false, error: "Failed to get non-revenue movements" }
  }
}

// Mark a non-revenue movement as completed
export async function markNonRevenueMovementAsCompleted(
  id: string,
  checkinData: {
    checkin_datetime: Date
    checkin_location: string
    checkin_mileage: number
    checkin_tank: number
  },
) {
  try {
    await sql`
      UPDATE non_revenue_movements SET
        status = 'STS-003', -- Completed
        checkin_datetime = ${checkinData.checkin_datetime},
        checkin_location = ${checkinData.checkin_location},
        checkin_mileage = ${checkinData.checkin_mileage},
        checkin_tank = ${checkinData.checkin_tank}
      WHERE id = ${id}
    `

    revalidatePath("/admin/fleet/non-revenue-movement")
    revalidatePath(`/admin/fleet/non-revenue-movement/${id}/view`)
    revalidatePath(`/admin/fleet/non-revenue-movement/${id}/edit`)

    return { success: true }
  } catch (error) {
    console.error("Error marking non-revenue movement as completed:", error)
    return { success: false, error: "Failed to mark non-revenue movement as completed" }
  }
}
