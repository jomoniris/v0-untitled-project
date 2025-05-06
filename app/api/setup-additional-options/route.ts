import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    console.log("Setting up additional_options table...")

    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "create-additional-options-table.sql")
    const sqlScript = fs.readFileSync(scriptPath, "utf8")

    // Execute the script
    await sql.unsafe(sqlScript)

    // Verify the table was created
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'additional_options'
      ) as exists
    `

    const tableExists = tableCheck[0]?.exists

    // Count rows in the table
    const rowCount = await sql`SELECT COUNT(*) as count FROM additional_options`

    return NextResponse.json({
      success: true,
      message: "Additional options table setup completed successfully",
      tableExists,
      rowCount: rowCount[0]?.count,
    })
  } catch (error) {
    console.error("Error setting up additional_options table:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to set up additional_options table",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
