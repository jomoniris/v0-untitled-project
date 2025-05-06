import { testConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await testConnection()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error testing database connection:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
