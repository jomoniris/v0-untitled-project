import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Path to the schema file
    const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma")

    // Push the schema to the database
    const { stdout, stderr } = await execAsync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`)

    console.log("Schema push output:", stdout)
    if (stderr) console.error("Schema push errors:", stderr)

    return NextResponse.json({
      success: true,
      message: "Schema pushed successfully",
    })
  } catch (error) {
    console.error("Error pushing schema:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
