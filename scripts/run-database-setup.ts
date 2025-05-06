import { sql } from "../lib/db"
import fs from "fs"
import path from "path"

async function setupDatabase() {
  try {
    console.log("Starting database setup...")

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "scripts", "setup-database.sql")
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0)

    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`)
      await sql.unsafe(statement)
    }

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
