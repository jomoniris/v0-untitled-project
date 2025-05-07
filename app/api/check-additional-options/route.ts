import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    console.log("Checking additional options tables and data...")

    // Check if additional_options table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'additional_options'
      ) as exists
    `

    const tableExists = tableCheck[0]?.exists || false

    if (!tableExists) {
      return NextResponse.json({
        error: "additional_options table does not exist",
        tableExists,
      })
    }

    // Check additional_options data
    const options = await sql`
      SELECT * FROM additional_options
    `

    // Check rate_additional_options table
    const raoTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rate_additional_options'
      ) as exists
    `

    const raoTableExists = raoTableCheck[0]?.exists || false

    let raoData = []
    if (raoTableExists) {
      raoData = await sql`
        SELECT * FROM rate_additional_options
      `
    }

    // Check rental_rates table
    const rentalRates = await sql`
      SELECT id, rate_id, rate_name FROM rental_rates
    `

    return NextResponse.json({
      success: true,
      tableExists,
      optionsCount: options.length,
      options,
      raoTableExists,
      raoCount: raoData.length,
      raoData,
      rentalRatesCount: rentalRates.length,
      rentalRates,
    })
  } catch (error) {
    console.error("Error checking additional options:", error)
    return NextResponse.json(
      {
        error: "Failed to check additional options",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
