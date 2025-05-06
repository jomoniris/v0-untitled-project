import { neon, neonConfig } from "@neondatabase/serverless"
import { Pool } from "pg"

// Add detailed logging
console.log("Initializing database connection...")

// Sanitize and log the database URL format (without exposing credentials)
const dbUrlForLogging = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, "//[credentials-hidden]@")
  : "undefined"

console.log("Database URL format:", dbUrlForLogging)
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

// Parse the DATABASE_URL to extract components
function parseDbUrl(url) {
  try {
    if (!url) return null

    const regex = /^postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/
    const match = url.match(regex)

    if (!match) {
      console.error("Invalid DATABASE_URL format")
      return null
    }

    const [, user, password, host, port, database] = match
    return { user, password, host, port, database }
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error)
    return null
  }
}

const dbComponents = parseDbUrl(process.env.DATABASE_URL)
if (dbComponents) {
  console.log("Database connection components:", {
    user: dbComponents.user,
    host: dbComponents.host,
    port: dbComponents.port,
    database: dbComponents.database,
    // Don't log the password
  })
}

// Initialize the database connection
export const sql = neon(process.env.DATABASE_URL!)

// Create a pool for compatibility with existing code
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Export the pool as db for compatibility
export const db = pool

// Export a function to test the database connection
export async function testConnection() {
  try {
    const startTime = Date.now()
    const result = await sql`SELECT 1 as test`
    const duration = Date.now() - startTime
    console.log(`Database connection successful (${duration}ms)`)
    console.log("Database info:", result[0])
    return {
      success: true,
      result,
      duration,
      connectionType: process.env.NEON_HTTP_ENDPOINT ? "HTTP" : "WebSocket",
    }
  } catch (error) {
    console.error("Database connection error:", error)

    // Check for authentication errors
    const isAuthError =
      error.message?.includes("authentication") || error.message?.includes("password") || error.message?.includes("401")

    if (isAuthError) {
      console.error("Authentication error detected. Please check your DATABASE_URL credentials.")
      // Log the username from the connection string for debugging
      if (dbComponents) {
        console.log("Attempted to connect with username:", dbComponents.user)
      }
    }

    return {
      success: false,
      error: error.message,
      errorType: error.name,
      isAuthError,
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

    // Check for authentication errors
    if (error.message?.includes("authentication") || error.message?.includes("401")) {
      console.error("Authentication error in query. Please check your DATABASE_URL credentials.")
    }

    throw error
  }
}
