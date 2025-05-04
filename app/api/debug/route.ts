import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || "Not set",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  )
}
