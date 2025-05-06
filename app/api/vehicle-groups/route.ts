import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Fetching vehicle groups...")

    const groups = await sql`
      SELECT 
        id, 
        code,
        name,
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
        image_path as "imagePath",
        active
      FROM vehicle_groups
      ORDER BY code ASC
    `

    console.log(`Found ${groups.length} vehicle groups`)
    return NextResponse.json({ groups })
  } catch (error) {
    console.error("Error fetching vehicle groups:", error)
    return NextResponse.json({ error: "Failed to fetch vehicle groups", details: error.message }, { status: 500 })
  }
}
