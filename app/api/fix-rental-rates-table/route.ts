import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    console.log("Running fix-rental-rates-table.sql script")

    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "fix-rental-rates-table.sql")
    const scriptContent = fs.readFileSync(scriptPath, "utf8")

    // Execute the script
    const result = await sql.unsafe(scriptContent)
    console.log("Script executed successfully")

    // Check tables after fix
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name IN ('rental_rates', 'rate_zones', 'zones')
    `

    // Count records in each table
    const counts = {}
    for (const table of tables) {
      const tableName = table.table_name
      const countResult = await sql.unsafe(`SELECT COUNT(*) FROM ${tableName}`)
      counts[tableName] = countResult[0]?.count || 0
    }

    return NextResponse.json({
      message: "Fix script executed successfully",
      tables: tables.map((t) => t.table_name),
      counts,
    })
  } catch (error) {
    console.error("Error running fix script:", error)
    return NextResponse.json(
      {
        error: "Failed to run fix script",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
