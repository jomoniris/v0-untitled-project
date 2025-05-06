"use server"

import { db } from "@/lib/db"

// Function to delete a rental rate
export async function deleteRentalRate(id: string) {
  try {
    await db.query("DELETE FROM rental_rates WHERE id = $1", [id])
    return { success: true, message: "Rate deleted successfully" }
  } catch (error) {
    console.error("Error deleting rate:", error)
    return { success: false, error: "Failed to delete rate" }
  }
}

// Function to duplicate a rental rate
export async function duplicateRentalRate(id: string) {
  try {
    // Get the rate to duplicate
    const {
      rows: [rate],
    } = await db.query("SELECT * FROM rental_rates WHERE id = $1", [id])

    if (!rate) {
      return { success: false, error: "Rate not found" }
    }

    // Create a new rate with the same data but a different name
    const {
      rows: [newRate],
    } = await db.query(
      `INSERT INTO rental_rates 
       (rate_id, rate_name, pickup_start_date, pickup_end_date, rate_zone_id, 
        booking_start_date, booking_end_date, active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING id`,
      [
        rate.rate_id + "-copy",
        rate.rate_name + " (Copy)",
        rate.pickup_start_date,
        rate.pickup_end_date,
        rate.rate_zone_id,
        rate.booking_start_date,
        rate.booking_end_date,
        false, // Set as inactive by default
      ],
    )

    return {
      success: true,
      message: "Rate duplicated successfully",
      newRateId: newRate.id,
    }
  } catch (error) {
    console.error("Error duplicating rate:", error)
    return { success: false, error: "Failed to duplicate rate" }
  }
}

// Function to toggle a rental rate's status
export async function toggleRentalRateStatus(id: string) {
  try {
    // Get current status
    const {
      rows: [rate],
    } = await db.query("SELECT active FROM rental_rates WHERE id = $1", [id])

    if (!rate) {
      return { success: false, error: "Rate not found" }
    }

    // Toggle status
    const newStatus = !rate.active

    await db.query("UPDATE rental_rates SET active = $1, updated_at = NOW() WHERE id = $2", [newStatus, id])

    return {
      success: true,
      message: `Rate ${newStatus ? "activated" : "deactivated"} successfully`,
      newStatus,
    }
  } catch (error) {
    console.error("Error toggling rate status:", error)
    return { success: false, error: "Failed to update rate status" }
  }
}
