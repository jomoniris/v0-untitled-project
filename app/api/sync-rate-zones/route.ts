import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    console.log("Starting rate zones sync process")

    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "sync-rate-zones.sql")
    const sqlScript = fs.readFileSync(scriptPath, "utf8")

    // Execute the script
    await sql.unsafe(sqlScript)

    console.log("Rate zones sync completed successfully")

    return NextResponse.json({
      success: true,
      message: "Rate zones synchronized successfully",
    })
  } catch (error) {
    console.error("Error syncing rate zones:", error)
    return NextResponse.json(
      {
        error: "Failed to sync rate zones",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
