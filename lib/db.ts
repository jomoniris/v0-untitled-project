import { neon } from "@neondatabase/serverless"

// Initialize the database connection
export const sql = neon(process.env.DATABASE_URL!)

// Export a function to test the database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    return { success: true, result }
  } catch (error) {
    console.error("Database connection error:", error)
    return { success: false, error }
  }
}
