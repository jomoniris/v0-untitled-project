"use server"

import { db } from "@/lib/db"
import type { VehicleGroup } from "./vehicle-group-actions"

export async function getVehicleGroupsData() {
  try {
    const result = await db.query(`
      SELECT * FROM vehicle_groups
      ORDER BY code ASC
    `)

    return {
      groups: result.rows as VehicleGroup[],
      error: null,
    }
  } catch (error) {
    console.error("Database error:", error)
    return {
      groups: [],
      error: "Failed to fetch vehicle groups. Please try again.",
    }
  }
}
