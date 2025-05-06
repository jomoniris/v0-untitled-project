import { neon } from "@neondatabase/serverless"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupDatabase() {
  try {
    console.log("Starting database setup...")

    // Initialize the database connection
    const sql = neon(process.env.DATABASE_URL)

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "setup-database.sql")
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0)

    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing statement...`)
      await sql.unsafe(statement)
    }

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
