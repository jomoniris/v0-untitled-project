import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "ensure-rental-rates-table.sql")
    const scriptContent = fs.readFileSync(scriptPath, "utf8")

    // Execute the script
    await sql.unsafe(scriptContent)

    // Verify the tables exist and have data
    const rateZonesCheck = await sql`SELECT COUNT(*) FROM rate_zones;`
    const rentalRatesCheck = await sql`SELECT COUNT(*) FROM rental_rates;`

    return NextResponse.json({
      status: "success",
      message: "Rental rates tables ensured",
      rateZonesCount: rateZonesCheck[0]?.count || 0,
      rentalRatesCount: rentalRatesCheck[0]?.count || 0,
    })
  } catch (error) {
    console.error("Error ensuring rental rates tables:", error)
    return NextResponse.json(
      {
        status: "error",
        message: String(error),
      },
      { status: 500 },
    )
  }
}
