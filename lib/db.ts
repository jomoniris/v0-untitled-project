import { neon, neonConfig } from "@neondatabase/serverless"

// Configure Neon with HTTP fallback
if (process.env.NEON_HTTP_ENDPOINT) {
  console.log("Using NEON_HTTP_ENDPOINT for database connection")
  neonConfig.fetchConnectionCache = true
  neonConfig.fetchEndpoint = process.env.NEON_HTTP_ENDPOINT
  neonConfig.useSecureWebSocket = true
} else {
  console.log("NEON_HTTP_ENDPOINT not found, using WebSocket only")
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

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
