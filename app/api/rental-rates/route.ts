import { executeQuery, testConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.log("GET /api/rental-rates - Request received")

  try {
    // First test the database connection
    console.log("Testing database connection before query...")
    const connectionTest = await testConnection()

    if (!connectionTest.success) {
      console.error("Database connection test failed:", connectionTest)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: connectionTest.error || "Unknown error",
          connectionType: connectionTest.connectionType,
        },
        { status: 500 },
      )
    }

    console.log("Database connection test successful:", connectionTest)

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    console.log("Request filter parameter:", filter)

    // Basic query to get rental rates
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

    console.log("Executing rental rates query...")
    const rates = await executeQuery(query)
    console.log("Rental rates query completed, found", rates?.length || 0, "rates")

    // Return simplified response for now
    return NextResponse.json({
      rates: rates || [],
      connectionInfo: {
        type: connectionTest.connectionType,
        duration: connectionTest.duration,
        database: connectionTest.result?.database,
      },
    })
  } catch (error) {
    console.error("Error in rental rates API:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch rental rates",
        details: error.message || "Unknown error",
        errorType: error.name,
      },
      { status: 500 },
    )
  }
}
