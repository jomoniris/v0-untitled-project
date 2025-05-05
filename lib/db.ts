import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

// Create a SQL client with the Neon serverless driver
export const sql: NeonQueryFunction<any> = neon(process.env.DATABASE_URL!)

// For backward compatibility with existing code that imports 'db'
export const db = {
  query: async (text: string, params: any[] = []) => {
    try {
      if (params && params.length > 0) {
        // Replace $1, $2, etc. with the actual parameters
        let queryText = text
        params.forEach((param, index) => {
          queryText = queryText.replace(`$${index + 1}`, typeof param === "string" ? `'${param}'` : String(param))
        })
        const result = await sql.unsafe(queryText)
        return { rows: result }
      } else {
        const result = await sql.unsafe(text)
        return { rows: result }
      }
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  },
  // Add any other methods that might be used in the application
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
