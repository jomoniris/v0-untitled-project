import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rental_rates'
      );
    `

    const tableExists = tableCheck[0]?.exists

    if (!tableExists) {
      return NextResponse.json({
        status: "error",
        message: "rental_rates table does not exist",
        tableExists: false,
        count: 0,
        columns: [],
        sample: [],
      })
    }

    // Get column information
    const columnInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'rental_rates';
    `

    // Count records
    const countResult = await sql`SELECT COUNT(*) FROM rental_rates;`
    const count = countResult[0]?.count || 0

    // Get a sample of records
    const sample = count > 0 ? await sql`SELECT * FROM rental_rates LIMIT 5;` : []

    return NextResponse.json({
      status: "success",
      tableExists: true,
      count,
      columns: columnInfo,
      sample,
    })
  } catch (error) {
    console.error("Error checking rental rates:", error)
    return NextResponse.json(
      {
        status: "error",
        message: String(error),
        error: error,
      },
      { status: 500 },
    )
  }
}
