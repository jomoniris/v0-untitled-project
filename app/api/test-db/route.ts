import { testConnection, executeQuery } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("GET /api/test-db - Testing database connection")

  try {
    // Test basic connection
    const connectionResult = await testConnection()
    console.log("Connection test result:", connectionResult)

    // If connection successful, try a simple query
    let queryResult = null
    if (connectionResult.success) {
      try {
        console.log("Testing a simple query...")
        const result = await executeQuery("SELECT COUNT(*) as count FROM rental_rates")
        queryResult = {
          success: true,
          count: result[0]?.count || 0,
        }
      } catch (queryError) {
        console.error("Query test failed:", queryError)
        queryResult = {
          success: false,
          error: queryError.message,
        }
      }
    }

    return NextResponse.json(
      {
        connection: connectionResult,
        query: queryResult,
        environment: {
          hasNeonHttpEndpoint: !!process.env.NEON_HTTP_ENDPOINT,
          nodeEnv: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
      },
      { status: connectionResult.success ? 200 : 500 },
    )
  } catch (error) {
    console.error("Unexpected error in test-db API:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "Unexpected error testing database connection",
        error: error.message || "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
