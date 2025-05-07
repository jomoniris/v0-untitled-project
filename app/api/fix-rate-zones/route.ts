import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "fix-rate-zones-schema.sql")
    const sqlScript = fs.readFileSync(scriptPath, "utf8")

    // Execute the script
    await sql.unsafe(sqlScript)

    return NextResponse.json({
      success: true,
      message: "Rate zones schema fixed successfully",
    })
  } catch (error) {
    console.error("Error fixing rate zones schema:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fix rate zones schema",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
