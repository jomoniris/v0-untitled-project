import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test database connection
    console.log("Testing database connection...")
    const connectionTest = await sql`SELECT 1 as test`
    console.log("Database connection successful:", connectionTest)

    // Check if the additional_options table exists
    console.log("Checking if additional_options table exists...")
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'additional_options'
      ) as exists
    `

    const tableExists = tableCheck[0]?.exists
    console.log("additional_options table exists:", tableExists)

    if (!tableExists) {
      return NextResponse.json({
        success: false,
        message: "The additional_options table does not exist",
        connectionTest,
        tableCheck,
      })
    }

    // Count rows in the table
    const rowCount = await sql`SELECT COUNT(*) as count FROM additional_options`
    console.log("Row count in additional_options:", rowCount[0]?.count)

    return NextResponse.json({
      success: true,
      message: "Database connection and table check successful",
      connectionTest,
      tableExists,
      rowCount: rowCount[0]?.count,
    })
  } catch (error) {
    console.error("Error testing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
