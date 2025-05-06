import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"

    console.log("Fetching rental rates with filter:", filter)

    let query = `
      SELECT 
        rr.id, 
        rr.rate_id as "rateId", 
        rr.rate_name as "rateName", 
        rr.pickup_start_date as "pickupStartDate", 
        rr.pickup_end_date as "pickupEndDate", 
        rz.code as "rateZone", 
        rr.rate_zone_id as "rateZoneId",
        rr.booking_start_date as "bookingStartDate", 
        rr.booking_end_date as "bookingEndDate", 
        rr.active
      FROM 
        rental_rates rr
      LEFT JOIN 
        rate_zones rz ON rr.rate_zone_id = rz.id
    `

    if (filter === "active") {
      query += ` WHERE rr.active = true`
    } else if (filter === "inactive") {
      query += ` WHERE rr.active = false`
    }

    query += ` ORDER BY rr.created_at DESC`

    console.log("Executing query:", query)
    const rates = await sql.unsafe(query)
    console.log("Query result count:", rates.length)

    // For each rate, get the car group rates
    const ratesWithDetails = await Promise.all(
      rates.map(async (rate) => {
        try {
          const carGroupRatesQuery = `
            SELECT 
              cgr.id,
              cgr.vehicle_group_id as "groupId",
              vg.name as "groupName",
              cgr.miles_per_day as "milesPerDay",
              cgr.miles_rate as "milesRate",
              cgr.deposit_rate_cdw as "depositRateCDW",
              cgr.policy_value_cdw as "policyValueCDW",
              cgr.deposit_rate_pai as "depositRatePAI",
              cgr.policy_value_pai as "policyValuePAI",
              cgr.deposit_rate_scdw as "depositRateSCDW",
              cgr.policy_value_scdw as "policyValueSCDW",
              cgr.deposit_rate_cpp as "depositRateCPP",
              cgr.policy_value_cpp as "policyValueCPP",
              cgr.delivery_charges as "deliveryCharges",
              cgr.rate_type as "rateType",
              cgr.included
            FROM 
              car_group_rates cgr
            LEFT JOIN
              vehicle_groups vg ON cgr.vehicle_group_id = vg.id
            WHERE 
              cgr.rental_rate_id = $1
          `

          const carGroupRates = await sql.unsafe(carGroupRatesQuery, [rate.id])

          // For each car group rate, get the daily rates or other rates
          const carGroupRatesWithRates = await Promise.all(
            carGroupRates.map(async (carGroupRate) => {
              const ratePackage = { type: carGroupRate.rateType }

              if (carGroupRate.rateType === "daily") {
                const dailyRatesQuery = `
                  SELECT day_number as "dayNumber", rate_amount as "rateAmount"
                  FROM daily_rates
                  WHERE car_group_rate_id = $1
                  ORDER BY day_number
                `

                const dailyRates = await sql.unsafe(dailyRatesQuery, [carGroupRate.id])

                // Convert to array of rate amounts
                const dailyRatesArray = Array(30).fill(0)
                dailyRates.forEach((rate) => {
                  dailyRatesArray[rate.dayNumber - 1] = Number.parseFloat(rate.rateAmount)
                })

                ratePackage.dailyRates = dailyRatesArray
              } else {
                const otherRateQuery = `
                  SELECT rate_amount as "rateAmount"
                  FROM other_rates
                  WHERE car_group_rate_id = $1 AND rate_type = $2
                `

                const otherRate = await sql.unsafe(otherRateQuery, [carGroupRate.id, carGroupRate.rateType])

                if (otherRate.length > 0) {
                  if (carGroupRate.rateType === "weekly") {
                    ratePackage.weeklyRate = Number.parseFloat(otherRate[0].rateAmount)
                  } else if (carGroupRate.rateType === "monthly") {
                    ratePackage.monthlyRate = Number.parseFloat(otherRate[0].rateAmount)
                  } else if (carGroupRate.rateType === "yearly") {
                    ratePackage.yearlyRate = Number.parseFloat(otherRate[0].rateAmount)
                  }
                }
              }

              return {
                ...carGroupRate,
                ratePackage,
              }
            }),
          )

          return {
            ...rate,
            carGroupRates: carGroupRatesWithRates,
          }
        } catch (error) {
          console.error(`Error fetching details for rate ${rate.id}:`, error)
          return {
            ...rate,
            carGroupRates: [],
          }
        }
      }),
    )

    return NextResponse.json({ rates: ratesWithDetails })
  } catch (error) {
    console.error("Error fetching rental rates:", error)
    return NextResponse.json({ error: "Failed to fetch rental rates", details: String(error) }, { status: 500 })
  }
}
