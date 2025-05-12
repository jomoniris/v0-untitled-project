import { NextResponse } from "next/server"
import { sql, testConnection } from "@/lib/db"

export async function GET() {
  try {
    // Test the database connection
    const connectionTest = await testConnection()

    // Get environment variables (redacted for security)
    const dbEnvVars = {
      DATABASE_URL: process.env.DATABASE_URL ? "***REDACTED***" : "Not set",
      POSTGRES_URL: process.env.POSTGRES_URL ? "***REDACTED***" : "Not set",
      NEON_HTTP_ENDPOINT: process.env.NEON_HTTP_ENDPOINT ? "***REDACTED***" : "Not set",
    }

    // Try a simple query
    let queryResult = null
    let error = null

    try {
      queryResult = await sql`SELECT NOW() as current_time`
    } catch (err) {
      error = err instanceof Error ? err.message : String(err)
    }

    return NextResponse.json({
      status: "success",
      connectionTest,
      dbEnvVars,
      queryResult,
      error,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in debug-db-connection route:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to debug database connection",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
