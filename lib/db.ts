import { neon } from "@neondatabase/serverless"

// Create a SQL client with the connection string from environment variables
export const sql = neon(process.env.DATABASE_URL!)

// Export db as an alias for sql to maintain compatibility with code that imports db
export const db = sql

// Test the database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    return { success: true, result }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, error }
  }
}
