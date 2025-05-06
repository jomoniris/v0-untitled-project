import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    // Use the pool directly for compatibility with existing code
    const query = `
      SELECT 
        rr.id, 
        rr.rate_id as "rateId", 
        rr.rate_name as "rateName", 
        rr.pickup_start_date as "pickupStartDate", 
        rr.pickup_end_date as "pickupEndDate", 
        rz.code as "rateZone", 
        rr.rate_zone_id as "rateZoneId",
        rr.booking_start_date as "bookingStartDate", 
        rr.booking_end_date as "bookingEndDate", 
        rr.active
      FROM 
        rental_rates rr
      LEFT JOIN 
        rate_zones rz ON rr.rate_zone_id = rz.id
    `

    const result = await db.query(query)
    const rates = result.rows || []

    return NextResponse.json({ rates })
  } catch (error) {
    console.error("Error fetching rental rates:", error)
    return NextResponse.json({ error: "Failed to fetch rental rates", details: String(error) }, { status: 500 })
  }
}
