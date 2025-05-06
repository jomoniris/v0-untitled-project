import { testConnection } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("GET /api/test-db - Testing database connection")

  try {
    const result = await testConnection()

    if (!result.success) {
      console.error("Database connection test failed:", result)

      // Special handling for authentication errors
      if (result.isAuthError) {
        return NextResponse.json(
          {
            success: false,
            error: "Database authentication failed",
            details:
              "The provided database credentials are invalid or expired. Please check your DATABASE_URL environment variable.",
            errorType: "AuthenticationError",
            timestamp: new Date().toISOString(),
          },
          { status: 401 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          errorType: result.errorType,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      connectionType: result.connectionType,
      database: result.result?.database,
      user: result.result?.user,
      timestamp: result.result?.time || new Date().toISOString(),
      duration: result.duration,
    })
  } catch (error) {
    console.error("Error in test-db API:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        errorType: error.name,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
