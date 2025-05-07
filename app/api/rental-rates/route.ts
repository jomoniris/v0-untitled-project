import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    console.log("Fetching rental rates with filter:", filter)

    // First, get the basic rental rates data
    let query = `
      SELECT 
        rr.id, 
        rr.rate_id as "rateId", 
        rr.rate_name as "rateName", 
        rr.pickup_start_date as "pickupStartDate", 
        rr.pickup_end_date as "pickupEndDate", 
        COALESCE(rz.code, z.code) as "rateZone", 
        rr.rate_zone_id as "rateZoneId",
        rr.booking_start_date as "bookingStartDate", 
        rr.booking_end_date as "bookingEndDate", 
        rr.active,
        rr.created_at as "createdAt"
      FROM 
        rental_rates rr
      LEFT JOIN 
        rate_zones rz ON rr.rate_zone_id = rz.id
      LEFT JOIN
        zones z ON rz.code = z.code
    `

    if (filter === "active") {
      query += ` WHERE rr.active = true`
    } else if (filter === "inactive") {
      query += ` WHERE rr.active = false`
    }

    query += ` ORDER BY rr.created_at DESC`

    console.log("Executing query:", query)
    const rates = await sql.unsafe(query)
    console.log("Query result count:", rates.length)

    // Return the full rates data
    return NextResponse.json({ rates })
  } catch (error) {
    console.error("Error fetching rental rates:", error)
    return NextResponse.json({ error: "Failed to fetch rental rates", details: String(error) }, { status: 500 })
  }
}
