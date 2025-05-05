import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const options = await sql`
      SELECT id, code, description, option_type as "optionType", active
      FROM additional_options
      ORDER BY description
    `

    return NextResponse.json({ options })
  } catch (error) {
    console.error("Error fetching additional options:", error)
    return NextResponse.json({ error: "Failed to fetch additional options" }, { status: 500 })
  }
}
