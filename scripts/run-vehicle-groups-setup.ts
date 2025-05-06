import { sql } from "@/lib/db"
import fs from "fs"
import path from "path"

async function setupVehicleGroups() {
  try {
    console.log("Setting up vehicle_groups table...")

    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "create-vehicle-groups-table.sql")
    const sqlScript = fs.readFileSync(scriptPath, "utf8")

    // Execute the SQL script
    await sql.unsafe(sqlScript)

    console.log("Vehicle groups table setup completed successfully")

    // Check if the table has data
    const count = await sql`SELECT COUNT(*) as count FROM vehicle_groups`
    console.log(`Vehicle groups table has ${count[0].count} records`)

    return { success: true }
  } catch (error) {
    console.error("Error setting up vehicle_groups table:", error)
    return { success: false, error }
  }
}

// Run the setup function
setupVehicleGroups()
  .then((result) => {
    if (result.success) {
      console.log("Setup completed successfully")
      process.exit(0)
    } else {
      console.error("Setup failed:", result.error)
      process.exit(1)
    }
  })
  .catch((error) => {
    console.error("Unhandled error:", error)
    process.exit(1)
  })
