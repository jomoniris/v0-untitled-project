import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function GET() {
  try {
    console.log("Pushing complete Prisma schema to database...")

    // Execute the Prisma DB push command
    const { stdout, stderr } = await execAsync("npx prisma db push")

    console.log("STDOUT:", stdout)
    if (stderr) console.error("STDERR:", stderr)

    return NextResponse.json({
      success: true,
      message: "Schema pushed successfully",
      details: stdout,
    })
  } catch (error) {
    console.error("Error pushing schema:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
