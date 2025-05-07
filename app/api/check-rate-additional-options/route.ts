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

    console.log(`Checking additional options for rate ID: ${rateId}`)

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
    const rateAdditionalOptions = await sql`
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

    console.log(`Found ${rateAdditionalOptions.length} additional options for rate`)

    // Get all additional options
    const allAdditionalOptions = await sql`
      SELECT id, code, description, option_type as "optionType", active
      FROM additional_options
      ORDER BY description
    `

    console.log(`Found ${allAdditionalOptions.length} total additional options`)

    // Check rate_additional_options table structure
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'rate_additional_options'
    `

    // Check if there are any records in the rate_additional_options table
    const totalRecords = await sql`
      SELECT COUNT(*) as count FROM rate_additional_options
    `

    return NextResponse.json({
      success: true,
      rateId: rate.id,
      rateName: rate.rate_name,
      rateAdditionalOptions,
      allAdditionalOptions,
      tableInfo,
      totalRecords: totalRecords[0]?.count || 0,
    })
  } catch (error) {
    console.error("Error checking rate additional options:", error)
    return NextResponse.json(
      {
        error: "Failed to check rate additional options",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
