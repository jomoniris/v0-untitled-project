import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    console.log("Ensuring rate_additional_options table exists...")

    // Read the SQL script
    const scriptPath = path.join(process.cwd(), "scripts", "ensure-rate-additional-options-table.sql")
    const script = fs.readFileSync(scriptPath, "utf8")

    // Execute the script
    await sql.unsafe(script)

    // Check if the table exists now
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'rate_additional_options'
      ) as exists
    `

    const tableExists = tableCheck[0]?.exists || false

    // Get rental rates
    const rentalRates = await sql`
      SELECT id FROM rental_rates
    `

    // Get additional options
    const additionalOptions = await sql`
      SELECT id FROM additional_options
    `

    // Check if we have any entries in the table
    const entries = await sql`
      SELECT COUNT(*) as count FROM rate_additional_options
    `

    const entriesCount = entries[0]?.count || 0

    // If we have rental rates and additional options but no entries, add some sample data
    if (rentalRates.length > 0 && additionalOptions.length > 0 && entriesCount === 0) {
      console.log("Adding sample rate_additional_options data...")

      // For each rental rate, add some random additional options
      for (const rate of rentalRates) {
        // Add 1-3 random additional options
        const optionsToAdd = Math.floor(Math.random() * 3) + 1
        const shuffledOptions = [...additionalOptions].sort(() => 0.5 - Math.random())

        for (let i = 0; i < Math.min(optionsToAdd, shuffledOptions.length); i++) {
          try {
            await sql`
              INSERT INTO rate_additional_options 
                (rental_rate_id, additional_option_id, included, customer_pays)
              VALUES 
                (${rate.id}, ${shuffledOptions[i].id}, true, ${Math.random() > 0.3})
              ON CONFLICT (rental_rate_id, additional_option_id) DO NOTHING
            `
          } catch (error) {
            console.error("Error adding sample data:", error)
          }
        }
      }

      // Check how many entries we have now
      const newEntries = await sql`
        SELECT COUNT(*) as count FROM rate_additional_options
      `

      const newEntriesCount = newEntries[0]?.count || 0

      return NextResponse.json({
        success: true,
        tableExists,
        message: "Table exists and sample data added",
        rentalRatesCount: rentalRates.length,
        additionalOptionsCount: additionalOptions.length,
        initialEntriesCount: entriesCount,
        newEntriesCount,
      })
    }

    return NextResponse.json({
      success: true,
      tableExists,
      message: "Table exists",
      rentalRatesCount: rentalRates.length,
      additionalOptionsCount: additionalOptions.length,
      entriesCount,
    })
  } catch (error) {
    console.error("Error ensuring rate_additional_options table:", error)
    return NextResponse.json(
      {
        error: "Failed to ensure rate_additional_options table",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
