import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const groups = await sql`
      SELECT * FROM vehicle_groups
      ORDER BY name ASC
    `

    return NextResponse.json({ groups })
  } catch (error) {
    console.error("Error fetching vehicle groups:", error)
    return NextResponse.json({ error: "Failed to fetch vehicle groups" }, { status: 500 })
  }
}
