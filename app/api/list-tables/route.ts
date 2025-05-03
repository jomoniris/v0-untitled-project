import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Execute a raw query to list all tables in PostgreSQL
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    return NextResponse.json({
      success: true,
      tables,
    })
  } catch (error) {
    console.error("Error listing tables:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
