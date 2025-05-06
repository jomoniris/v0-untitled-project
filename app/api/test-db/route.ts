import { sql, testConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test the database connection
    const connectionTest = await testConnection()

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: connectionTest.error,
        },
        { status: 500 },
      )
    }

    // Check if the vehicle_groups table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'vehicle_groups'
      ) as exists
    `

    const tableExists = tableCheck[0]?.exists

    // If the table exists, count the records
    let recordCount = 0
    if (tableExists) {
      const countResult = await sql`SELECT COUNT(*) as count FROM vehicle_groups`
      recordCount = countResult[0]?.count
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      tableExists,
      recordCount,
      connectionDetails: {
        databaseUrl: process.env.DATABASE_URL ? "Set (hidden)" : "Not set",
        neonHttpEndpoint: process.env.NEON_HTTP_ENDPOINT ? "Set (hidden)" : "Not set",
      },
    })
  } catch (error) {
    console.error("Error testing database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error testing database",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
