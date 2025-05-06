import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("Fetching additional options...")

    const options = await sql`
      SELECT 
        id, 
        code, 
        description, 
        option_type as "optionType", 
        active
      FROM additional_options
      ORDER BY code
    `

    console.log(`Retrieved ${options.length} additional options`)

    return NextResponse.json({ options })
  } catch (error) {
    console.error("Error fetching additional options:", error)
    return NextResponse.json({ error: "Failed to fetch additional options", details: error.message }, { status: 500 })
  }
}
