import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Checking rental rates directly in database")

    // Check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rental_rates'
      );
    `

    const tableExists = tableCheck[0]?.exists
    console.log("Table exists:", tableExists)

    if (!tableExists) {
      return NextResponse.json({
        error: "rental_rates table does not exist",
        tableExists: false,
        count: 0,
        rates: [],
      })
    }

    // Count records
    const countResult = await sql`SELECT COUNT(*) FROM rental_rates;`
    const count = Number.parseInt(countResult[0]?.count || "0")
    console.log("Total rental rates in database:", count)

    // Get sample records
    let rates = []
    if (count > 0) {
      rates = await sql`
        SELECT * FROM rental_rates 
        ORDER BY created_at DESC 
        LIMIT 5;
      `
      console.log("Sample rates:", rates)
    }

    // Check rate_zones table
    const rateZonesCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rate_zones'
      );
    `

    const rateZonesExist = rateZonesCheck[0]?.exists
    console.log("rate_zones table exists:", rateZonesExist)

    let rateZones = []
    if (rateZonesExist) {
      rateZones = await sql`SELECT * FROM rate_zones LIMIT 5;`
      console.log("Sample rate zones:", rateZones)
    }

    return NextResponse.json({
      tableExists,
      count,
      sampleRates: rates,
      rateZonesExist,
      sampleRateZones: rateZones,
    })
  } catch (error) {
    console.error("Error checking rental rates:", error)
    return NextResponse.json(
      {
        error: "Failed to check rental rates",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
