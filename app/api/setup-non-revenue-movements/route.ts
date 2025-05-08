import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "create-non-revenue-movements-tables.sql")
    const script = fs.readFileSync(scriptPath, "utf8")

    // Execute the script
    await sql.query(script)

    return NextResponse.json({
      success: true,
      message: "Non-revenue movements tables created successfully",
    })
  } catch (error) {
    console.error("Error setting up non-revenue movements tables:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to set up non-revenue movements tables",
      },
      { status: 500 },
    )
  }
}
