"use server"

import { sql } from "@/lib/db"

// Get all rate zones
export async function getRateZones() {
  try {
    const zones = await sql`
      SELECT id, code, name, description, active
      FROM rate_zones
      ORDER BY name
    `
    return { zones }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to fetch rate zones" }
  }
}
