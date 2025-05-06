"use server"

import { neon } from "@neondatabase/serverless"

// Initialize the database connection
export const sql = neon(process.env.DATABASE_URL!)
