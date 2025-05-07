import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const rateId = url.searchParams.get("rateId")

    if (!rateId) {
      return NextResponse.json(
        {
          error: "Missing rateId parameter",
        },
        { status: 400 },
      )
    }

    console.log(`Fetching additional options for rate ID: ${rateId}`)

    // First check if the rate exists
    const rateCheck = await sql`
      SELECT id, rate_id, rate_name FROM rental_rates WHERE id = ${rateId} OR rate_id = ${rateId}
    `

    if (rateCheck.length === 0) {
      return NextResponse.json(
        {
          error: "Rental rate not found",
        },
        { status: 404 },
      )
    }

    const rate = rateCheck[0]
    console.log("Found rate:", rate)

    // Get additional options for this rate
    const additionalOptions = await sql`
      SELECT 
        rao.additional_option_id as "id",
        ao.code,
        ao.description,
        rao.included,
        rao.customer_pays as "customerPays"
      FROM 
        rate_additional_options rao
      JOIN 
        additional_options ao ON rao.additional_option_id = ao.id
      WHERE 
        rao.rental_rate_id = ${rate.id}
    `

    console.log(`Found ${additionalOptions.length} additional options for rate`)

    // If no additional options found, try a simpler query
    if (additionalOptions.length === 0) {
      console.log("No additional options found, trying simpler query...")

      const simpleOptions = await sql`
        SELECT * FROM rate_additional_options WHERE rental_rate_id = ${rate.id}
      `

      console.log(`Simple query found ${simpleOptions.length} records`)

      // Get all additional options
      const allOptions = await sql`
        SELECT id, code, description FROM additional_options
      `

      console.log(`Found ${allOptions.length} total additional options`)

      return NextResponse.json({
        success: true,
        rateId: rate.id,
        rateName: rate.rate_name,
        additionalOptions: [],
        debug: {
          simpleOptions,
          allOptions,
        },
      })
    }

    return NextResponse.json({
      success: true,
      rateId: rate.id,
      rateName: rate.rate_name,
      additionalOptions,
    })
  } catch (error) {
    console.error("Error fetching rate additional options:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch rate additional options",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
