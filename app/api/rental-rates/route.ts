import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    console.log("Fetching rental rates with filter:", filter)
    console.log("Request URL:", request.url)

    // First, check if the rental_rates table exists
    try {
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'rental_rates'
        );
      `
      console.log("Table check result:", tableCheck)

      if (!tableCheck[0]?.exists) {
        console.error("rental_rates table does not exist!")
        return NextResponse.json({ rates: [] }, { status: 200 })
      }
    } catch (tableError) {
      console.error("Error checking table existence:", tableError)
      // Continue execution even if table check fails
    }

    // Count total records in the table
    try {
      const countResult = await sql`SELECT COUNT(*) FROM rental_rates;`
      console.log("Total rental rates in database:", countResult[0]?.count)
    } catch (countError) {
      console.error("Error counting records:", countError)
      // Continue execution even if count fails
    }

    // First, get the basic rental rates data
    let query = `
      SELECT 
        rr.id, 
        rr.rate_id as "rateId", 
        rr.rate_name as "rateName", 
        rr.pickup_start_date as "pickupStartDate", 
        rr.pickup_end_date as "pickupEndDate", 
        COALESCE(rz.code, z.code) as "rateZone", 
        rr.rate_zone_id as "rateZoneId",
        rr.booking_start_date as "bookingStartDate", 
        rr.booking_end_date as "bookingEndDate", 
        rr.active,
        rr.created_at as "createdAt"
      FROM 
        rental_rates rr
      LEFT JOIN 
        rate_zones rz ON rr.rate_zone_id = rz.id
      LEFT JOIN
        zones z ON rz.code = z.code
    `

    if (filter === "active") {
      query += ` WHERE rr.active = true`
    } else if (filter === "inactive") {
      query += ` WHERE rr.active = false`
    }

    query += ` ORDER BY rr.created_at DESC`

    console.log("Executing query:", query)

    // Try a simpler query first to check if we can get any data
    let simpleRates = []
    try {
      simpleRates = await sql`SELECT * FROM rental_rates LIMIT 10;`
      console.log("Simple query result count:", simpleRates.length)
      console.log("Simple query first record:", simpleRates[0] ? JSON.stringify(simpleRates[0]) : "No records")
    } catch (simpleError) {
      console.error("Error with simple query:", simpleError)
      // Continue execution even if simple query fails
    }

    // If simple query returned results but complex one might fail, use simple results
    if (simpleRates.length > 0) {
      try {
        // Now try the full query
        const rates = await sql.unsafe(query)
        console.log("Full query result count:", rates.length)

        if (rates.length > 0) {
          console.log("First rate:", JSON.stringify(rates[0]))
          return NextResponse.json({ rates: rates }, { status: 200 })
        } else {
          console.log("No rates found with the full query, falling back to simple query results")
          // Transform simple results to match expected format
          const formattedRates = simpleRates.map((rate) => ({
            id: rate.id,
            rateId: rate.rate_id,
            rateName: rate.rate_name,
            pickupStartDate: rate.pickup_start_date,
            pickupEndDate: rate.pickup_end_date,
            rateZone: "Unknown", // We don't have the joined data
            rateZoneId: rate.rate_zone_id,
            bookingStartDate: rate.booking_start_date,
            bookingEndDate: rate.booking_end_date,
            active: rate.active,
            createdAt: rate.created_at,
          }))
          return NextResponse.json({ rates: formattedRates }, { status: 200 })
        }
      } catch (fullQueryError) {
        console.error("Error with full query:", fullQueryError)
        // Fall back to simple results if full query fails
        console.log("Falling back to simple query results due to full query error")
        // Transform simple results to match expected format
        const formattedRates = simpleRates.map((rate) => ({
          id: rate.id,
          rateId: rate.rate_id,
          rateName: rate.rate_name,
          pickupStartDate: rate.pickup_start_date,
          pickupEndDate: rate.pickup_end_date,
          rateZone: "Unknown", // We don't have the joined data
          rateZoneId: rate.rate_zone_id,
          bookingStartDate: rate.booking_start_date,
          bookingEndDate: rate.booking_end_date,
          active: rate.active,
          createdAt: rate.created_at,
        }))
        return NextResponse.json({ rates: formattedRates }, { status: 200 })
      }
    } else {
      // No results from simple query either
      console.log("No rates found with either query")
      return NextResponse.json({ rates: [] }, { status: 200 })
    }
  } catch (error) {
    console.error("Error fetching rental rates:", error)
    // Always return an array, even on error
    return NextResponse.json(
      { rates: [], error: "Failed to fetch rental rates", details: String(error) },
      { status: 200 },
    )
  }
}
