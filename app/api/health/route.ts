import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: "ok",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
