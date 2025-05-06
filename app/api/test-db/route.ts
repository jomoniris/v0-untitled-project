import { testConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await testConnection()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Test DB error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
