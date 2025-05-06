import { neon, neonConfig } from "@neondatabase/serverless"

// Add detailed logging
console.log("Initializing database connection...")
console.log("Environment check:", {
  hasDbUrl: !!process.env.DATABASE_URL,
  hasNeonHttpEndpoint: !!process.env.NEON_HTTP_ENDPOINT,
  nodeEnv: process.env.NODE_ENV,
})

// Configure Neon with HTTP fallback
if (process.env.NEON_HTTP_ENDPOINT) {
  console.log("Using NEON_HTTP_ENDPOINT for database connection")
  neonConfig.fetchConnectionCache = true
  neonConfig.fetchEndpoint = process.env.NEON_HTTP_ENDPOINT
  neonConfig.useSecureWebSocket = true
  neonConfig.wsMaxRetries = 3
  neonConfig.wsRetryBaseInterval = 100
  neonConfig.wsRetryMaxInterval = 2000
} else {
  console.log("NEON_HTTP_ENDPOINT not found, using WebSocket only")
  neonConfig.webSocketConstructor = globalThis.WebSocket
  neonConfig.wsMaxRetries = 5
  neonConfig.wsRetryBaseInterval = 1000
  neonConfig.wsRetryMaxInterval = 5000
}

// Initialize the database connection
export const sql = neon(process.env.DATABASE_URL!)

// Export a function to test the database connection
export async function testConnection() {
  console.log("Testing database connection...")
  try {
    const startTime = Date.now()
    const result = await sql`SELECT NOW() as time, current_database() as database, version() as version`
    const duration = Date.now() - startTime
    console.log(`Database connection successful (${duration}ms)`)
    console.log("Database info:", result[0])
    return {
      success: true,
      result: result[0],
      duration,
      connectionType: process.env.NEON_HTTP_ENDPOINT ? "HTTP" : "WebSocket",
    }
  } catch (error) {
    console.error("Database connection error:", error)
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
      cause: error.cause,
    })
    return {
      success: false,
      error: error.message,
      errorType: error.name,
      connectionType: process.env.NEON_HTTP_ENDPOINT ? "HTTP" : "WebSocket",
    }
  }
}

// Function to execute a query with detailed logging
export async function executeQuery(query, params = []) {
  console.log("Executing query:", query.replace(/\s+/g, " ").trim())
  console.log("Query parameters:", params)

  try {
    const startTime = Date.now()
    const result = await sql.unsafe(query, params)
    const duration = Date.now() - startTime
    console.log(`Query executed successfully (${duration}ms)`)
    console.log("Result rows count:", result?.length || 0)
    return result
  } catch (error) {
    console.error("Query execution error:", error)
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      query: query.replace(/\s+/g, " ").trim(),
      params,
    })
    throw error
  }
}
