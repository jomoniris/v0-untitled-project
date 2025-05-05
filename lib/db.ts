import { neon } from "@neondatabase/serverless"

// Create a SQL client with the Neon serverless driver
// This is the recommended way to connect to Neon from serverless environments
export const sql = neon(process.env.DATABASE_URL!)

// For backward compatibility with existing code that imports 'db'
// We'll provide the same SQL client as 'db'
export const db = {
  query: async (text: string, params: any[] = []) => {
    try {
      // Convert the query and params to a tagged template literal
      // that works with the neon client
      const queryText = text.replace(/\$\d+/g, "?")
      const result = await sql([queryText, ...params])
      return { rows: result }
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  },
  // Add any other methods that might be used in the application
  // For example, if transaction is used somewhere
  transaction: async (callback: Function) => {
    try {
      // Start a transaction
      await sql`BEGIN`
      // Execute the callback
      const result = await callback()
      // Commit the transaction
      await sql`COMMIT`
      return result
    } catch (error) {
      // Rollback the transaction on error
      await sql`ROLLBACK`
      console.error("Transaction error:", error)
      throw error
    }
  },
}

// Export a simple function to check database connectivity
export async function checkDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as connected`
    return { connected: result[0]?.connected === 1 }
  } catch (error) {
    console.error("Database connection error:", error)
    return { error: "Failed to connect to database" }
  }
}
