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

      // Special handling for authentication errors
      if (connectionTest.isAuthError) {
        return NextResponse.json(
          {
            error: "Database authentication failed",
            details:
              "The provided database credentials are invalid or expired. Please check your DATABASE_URL environment variable.",
            connectionType: connectionTest.connectionType,
            errorType: "AuthenticationError",
          },
          { status: 401 },
        )
      }

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

    // Use a simpler query to reduce potential errors
    const query = `
      SELECT
        id, 
        rate_id as "rateId", 
        rate_name as "rateName", 
        pickup_start_date as "pickupStartDate", 
        pickup_end_date as "pickupEndDate", 
        rate_zone_id as "rateZoneId",
        booking_start_date as "bookingStartDate", 
        booking_end_date as "bookingEndDate", 
        active
      FROM 
        rental_rates
      ORDER BY 
        created_at DESC
    `

    console.log("Executing rental rates query...")
    const rates = await executeQuery(query)
    console.log("Rental rates query completed, found", rates?.length || 0, "rates")

    // Return simplified response
    return NextResponse.json({
      rates: rates || [],
      connectionInfo: {
        type: connectionTest.connectionType,
        duration: connectionTest.duration,
        database: connectionTest.result?.database,
        user: connectionTest.result?.user,
      },
    })
  } catch (error) {
    console.error("Error in rental rates API:", error)

    // Check for authentication errors
    const isAuthError =
      error.message?.includes("authentication") || error.message?.includes("password") || error.message?.includes("401")

    if (isAuthError) {
      return NextResponse.json(
        {
          error: "Database authentication failed",
          details:
            "The provided database credentials are invalid or expired. Please check your DATABASE_URL environment variable.",
          errorType: "AuthenticationError",
        },
        { status: 401 },
      )
    }

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
