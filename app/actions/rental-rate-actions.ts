"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Define the schema for validation
const rentalRateSchema = z.object({
  rateName: z.string().min(3, { message: "Rate name must be at least 3 characters." }),
  pickupStartDate: z.string(),
  pickupEndDate: z.string(),
  rateZone: z.string(),
  bookingStartDate: z.string(),
  bookingEndDate: z.string(),
  active: z.boolean().default(true),
})

// Type for car group rates
type CarGroupRate = {
  groupId: string
  groupName: string
  milesPerDay: number
  milesRate: number
  depositRateCDW: number
  policyValueCDW: number
  depositRatePAI: number
  policyValuePAI: number
  depositRateSCDW: number
  policyValueSCDW: number
  depositRateCPP: number
  policyValueCPP: number
  deliveryCharges: number
  ratePackage: {
    type: "daily" | "weekly" | "monthly" | "yearly"
    dailyRates?: number[]
    weeklyRate?: number
    monthlyRate?: number
    yearlyRate?: number
  }
  included: boolean
}

// Type for additional options
type AdditionalOption = {
  id: string
  code: string
  description: string
  included: boolean
  customerPays: boolean
}

// Function to generate a unique rate ID
async function generateRateId(): Promise<string> {
  const result = await sql`SELECT MAX(CAST(SUBSTRING(rate_id, 6) AS INTEGER)) as max_id FROM rental_rates`
  const maxId = result[0]?.max_id || 0
  return `RATE-${String(maxId + 1).padStart(3, "0")}`
}

// Get all rental rates
export async function getRentalRates(filter = "all") {
  try {
    let query = `
      SELECT 
        rr.id, 
        rr.rate_id as "rateId", 
        rr.rate_name as "rateName", 
        rr.pickup_start_date as "pickupStartDate", 
        rr.pickup_end_date as "pickupEndDate", 
        rz.code as "rateZone", 
        rr.booking_start_date as "bookingStartDate", 
        rr.booking_end_date as "bookingEndDate", 
        rr.active
      FROM 
        rental_rates rr
      JOIN 
        rate_zones rz ON rr.rate_zone_id = rz.id
    `

    if (filter === "active") {
      query += ` WHERE rr.active = true`
    } else if (filter === "inactive") {
      query += ` WHERE rr.active = false`
    }

    query += ` ORDER BY rr.created_at DESC`

    const result = await sql.unsafe(query)
    const rates = Array.isArray(result) ? result : []

    // For each rate, get the car group rates
    const ratesWithDetails = await Promise.all(
      rates.map(async (rate) => {
        const carGroupRates = await getCarGroupRatesForRate(rate.id)
        return {
          ...rate,
          carGroupRates,
        }
      }),
    )

    return { rates: ratesWithDetails }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to fetch rental rates" }
  }
}

// Get a single rental rate by ID
export async function getRentalRateById(id: string) {
  try {
    const rate = await sql`
      SELECT 
        rr.id, 
        rr.rate_id as "rateId", 
        rr.rate_name as "rateName", 
        rr.pickup_start_date as "pickupStartDate", 
        rr.pickup_end_date as "pickupEndDate", 
        rz.id as "rateZoneId",
        rz.code as "rateZone", 
        rr.booking_start_date as "bookingStartDate", 
        rr.booking_end_date as "bookingEndDate", 
        rr.active
      FROM 
        rental_rates rr
      JOIN 
        rate_zones rz ON rr.rate_zone_id = rz.id
      WHERE 
        rr.id = ${id} OR rr.rate_id = ${id}
    `

    if (rate.length === 0) {
      return { error: "Rental rate not found" }
    }

    // Get car group rates for this rate
    const carGroupRates = await getCarGroupRatesForRate(rate[0].id)

    // Get additional options for this rate
    const additionalOptions = await getAdditionalOptionsForRate(rate[0].id)

    return {
      rate: {
        ...rate[0],
        carGroupRates,
        additionalOptions,
      },
    }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to fetch rental rate" }
  }
}

// Helper function to get car group rates for a rate
async function getCarGroupRatesForRate(rateId: string) {
  try {
    const carGroupRates = await sql`
      SELECT 
        cgr.id,
        cgr.vehicle_group_id as "groupId",
        cgr.miles_per_day as "milesPerDay",
        cgr.miles_rate as "milesRate",
        cgr.deposit_rate_cdw as "depositRateCDW",
        cgr.policy_value_cdw as "policyValueCDW",
        cgr.deposit_rate_pai as "depositRatePAI",
        cgr.policy_value_pai as "policyValuePAI",
        cgr.deposit_rate_scdw as "policyValueSCDW",
        cgr.policy_value_scdw as "policyValueSCDW",
        cgr.deposit_rate_cpp as "depositRateCPP",
        cgr.policy_value_cpp as "policyValueCPP",
        cgr.delivery_charges as "deliveryCharges",
        cgr.rate_type as "rateType",
        cgr.included
      FROM 
        car_group_rates cgr
      WHERE 
        cgr.rental_rate_id = ${rateId}
    `

    // For each car group rate, get the daily rates or other rates
    const carGroupRatesWithRates = await Promise.all(
      carGroupRates.map(async (carGroupRate) => {
        const ratePackage: any = { type: carGroupRate.rateType }

        if (carGroupRate.rateType === "daily") {
          const dailyRates = await sql`
            SELECT day_number as "dayNumber", rate_amount as "rateAmount"
            FROM daily_rates
            WHERE car_group_rate_id = ${carGroupRate.id}
            ORDER BY day_number
          `

          // Convert to array of rate amounts
          const dailyRatesArray = Array(30).fill(0)
          dailyRates.forEach((rate) => {
            dailyRatesArray[rate.dayNumber - 1] = Number.parseFloat(rate.rateAmount)
          })

          ratePackage.dailyRates = dailyRatesArray
        } else {
          const otherRate = await sql`
            SELECT rate_amount as "rateAmount"
            FROM other_rates
            WHERE car_group_rate_id = ${carGroupRate.id} AND rate_type = ${carGroupRate.rateType}
          `

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

        // Get vehicle group name
        const vehicleGroup = await sql`
          SELECT name as "groupName" FROM vehicle_groups WHERE id = ${carGroupRate.groupId}
        `

        const groupName = vehicleGroup.length > 0 ? vehicleGroup[0].groupName : `Group ${carGroupRate.groupId}`

        return {
          ...carGroupRate,
          groupName,
          ratePackage,
        }
      }),
    )

    return carGroupRatesWithRates
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

// Helper function to get additional options for a rate
async function getAdditionalOptionsForRate(rateId: string) {
  try {
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
        rao.rental_rate_id = ${rateId}
    `

    return additionalOptions
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

// Create a new rental rate
export async function createRentalRate(formData: FormData) {
  try {
    // Extract and validate basic rate information
    const rateName = formData.get("rateName") as string
    const pickupStartDate = formData.get("pickupStartDate") as string
    const pickupEndDate = formData.get("pickupEndDate") as string
    const rateZone = formData.get("rateZone") as string
    const bookingStartDate = formData.get("bookingStartDate") as string
    const bookingEndDate = formData.get("bookingEndDate") as string
    const active = formData.get("active") === "true"

    // Validate using zod
    const validatedData = rentalRateSchema.parse({
      rateName,
      pickupStartDate,
      pickupEndDate,
      rateZone,
      bookingStartDate,
      bookingEndDate,
      active,
    })

    // Get rate zone ID
    const rateZoneResult = await sql`
      SELECT id FROM rate_zones WHERE code = ${validatedData.rateZone}
    `

    if (rateZoneResult.length === 0) {
      return { error: "Invalid rate zone" }
    }

    const rateZoneId = rateZoneResult[0].id

    // Generate a unique rate ID
    const rateId = await generateRateId()

    // Insert the rental rate
    const result = await sql`
      INSERT INTO rental_rates (
        rate_id, rate_name, pickup_start_date, pickup_end_date, 
        rate_zone_id, booking_start_date, booking_end_date, active
      ) VALUES (
        ${rateId}, ${validatedData.rateName}, ${validatedData.pickupStartDate}, ${validatedData.pickupEndDate},
        ${rateZoneId}, ${validatedData.bookingStartDate}, ${validatedData.bookingEndDate}, ${validatedData.active}
      )
      RETURNING id
    `

    const rentalRateId = result[0].id

    // Process car group rates
    const carGroupRatesJson = formData.get("carGroupRates") as string
    if (carGroupRatesJson) {
      const carGroupRates = JSON.parse(carGroupRatesJson) as CarGroupRate[]

      // Only process included car groups
      const includedCarGroups = carGroupRates.filter((group) => group.included)

      for (const carGroup of includedCarGroups) {
        // Insert car group rate
        const carGroupRateResult = await sql`
          INSERT INTO car_group_rates (
            rental_rate_id, vehicle_group_id, miles_per_day, miles_rate,
            deposit_rate_cdw, policy_value_cdw, deposit_rate_pai, policy_value_pai,
            deposit_rate_scdw, policy_value_scdw, deposit_rate_cpp, policy_value_cpp,
            delivery_charges, rate_type, included
          ) VALUES (
            ${rentalRateId}, ${carGroup.groupId}, ${carGroup.milesPerDay}, ${carGroup.milesRate},
            ${carGroup.depositRateCDW}, ${carGroup.policyValueCDW}, ${carGroup.depositRatePAI}, ${carGroup.policyValuePAI},
            ${carGroup.depositRateSCDW}, ${carGroup.policyValueSCDW}, ${carGroup.depositRateCPP}, ${carGroup.policyValueCPP},
            ${carGroup.deliveryCharges}, ${carGroup.ratePackage.type}, ${carGroup.included}
          )
          RETURNING id
        `

        const carGroupRateId = carGroupRateResult[0].id

        // Insert rates based on type
        if (carGroup.ratePackage.type === "daily" && carGroup.ratePackage.dailyRates) {
          // Insert daily rates
          for (let i = 0; i < carGroup.ratePackage.dailyRates.length; i++) {
            await sql`
              INSERT INTO daily_rates (car_group_rate_id, day_number, rate_amount)
              VALUES (${carGroupRateId}, ${i + 1}, ${carGroup.ratePackage.dailyRates[i]})
            `
          }
        } else if (carGroup.ratePackage.type === "weekly" && carGroup.ratePackage.weeklyRate) {
          // Insert weekly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${carGroupRateId}, 'weekly', ${carGroup.ratePackage.weeklyRate})
          `
        } else if (carGroup.ratePackage.type === "monthly" && carGroup.ratePackage.monthlyRate) {
          // Insert monthly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${carGroupRateId}, 'monthly', ${carGroup.ratePackage.monthlyRate})
          `
        } else if (carGroup.ratePackage.type === "yearly" && carGroup.ratePackage.yearlyRate) {
          // Insert yearly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${carGroupRateId}, 'yearly', ${carGroup.ratePackage.yearlyRate})
          `
        }
      }
    }

    // Process additional options
    const additionalOptionsJson = formData.get("additionalOptions") as string
    if (additionalOptionsJson) {
      const additionalOptions = JSON.parse(additionalOptionsJson) as AdditionalOption[]

      // Only process included options
      const includedOptions = additionalOptions.filter((option) => option.included)

      for (const option of includedOptions) {
        await sql`
          INSERT INTO rate_additional_options (rental_rate_id, additional_option_id, included, customer_pays)
          VALUES (${rentalRateId}, ${option.id}, ${option.included}, ${option.customerPays})
        `
      }
    }

    revalidatePath("/admin/rate-and-policies/rental-rates")
    return { success: true, message: `Rate "${validatedData.rateName}" created successfully` }
  } catch (error) {
    console.error("Error creating rental rate:", error)
    return { error: "Failed to create rental rate" }
  }
}

// Update an existing rental rate
export async function updateRentalRate(id: string, formData: FormData) {
  try {
    // Extract and validate basic rate information
    const rateName = formData.get("rateName") as string
    const pickupStartDate = formData.get("pickupStartDate") as string
    const pickupEndDate = formData.get("pickupEndDate") as string
    const rateZone = formData.get("rateZone") as string
    const bookingStartDate = formData.get("bookingStartDate") as string
    const bookingEndDate = formData.get("bookingEndDate") as string
    const active = formData.get("active") === "true"

    // Validate using zod
    const validatedData = rentalRateSchema.parse({
      rateName,
      pickupStartDate,
      pickupEndDate,
      rateZone,
      bookingStartDate,
      bookingEndDate,
      active,
    })

    // Get rate zone ID
    const rateZoneResult = await sql`
      SELECT id FROM rate_zones WHERE code = ${validatedData.rateZone}
    `

    if (rateZoneResult.length === 0) {
      return { error: "Invalid rate zone" }
    }

    const rateZoneId = rateZoneResult[0].id

    // Update the rental rate
    await sql`
      UPDATE rental_rates
      SET 
        rate_name = ${validatedData.rateName},
        pickup_start_date = ${validatedData.pickupStartDate},
        pickup_end_date = ${validatedData.pickupEndDate},
        rate_zone_id = ${rateZoneId},
        booking_start_date = ${validatedData.bookingStartDate},
        booking_end_date = ${validatedData.bookingEndDate},
        active = ${validatedData.active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    // Process car group rates
    const carGroupRatesJson = formData.get("carGroupRates") as string
    if (carGroupRatesJson) {
      const carGroupRates = JSON.parse(carGroupRatesJson) as CarGroupRate[]

      // Delete existing car group rates
      await sql`
        DELETE FROM car_group_rates
        WHERE rental_rate_id = ${id}
      `

      // Only process included car groups
      const includedCarGroups = carGroupRates.filter((group) => group.included)

      for (const carGroup of includedCarGroups) {
        // Insert car group rate
        const carGroupRateResult = await sql`
          INSERT INTO car_group_rates (
            rental_rate_id, vehicle_group_id, miles_per_day, miles_rate,
            deposit_rate_cdw, policy_value_cdw, deposit_rate_pai, policy_value_pai,
            deposit_rate_scdw, policy_value_scdw, deposit_rate_cpp, policy_value_cpp,
            delivery_charges, rate_type, included
          ) VALUES (
            ${id}, ${carGroup.groupId}, ${carGroup.milesPerDay}, ${carGroup.milesRate},
            ${carGroup.depositRateCDW}, ${carGroup.policyValueCDW}, ${carGroup.depositRatePAI}, ${carGroup.policyValuePAI},
            ${carGroup.depositRateSCDW}, ${carGroup.policyValueSCDW}, ${carGroup.depositRateCPP}, ${carGroup.policyValueCPP},
            ${carGroup.deliveryCharges}, ${carGroup.ratePackage.type}, ${carGroup.included}
          )
          RETURNING id
        `

        const carGroupRateId = carGroupRateResult[0].id

        // Insert rates based on type
        if (carGroup.ratePackage.type === "daily" && carGroup.ratePackage.dailyRates) {
          // Insert daily rates
          for (let i = 0; i < carGroup.ratePackage.dailyRates.length; i++) {
            await sql`
              INSERT INTO daily_rates (car_group_rate_id, day_number, rate_amount)
              VALUES (${carGroupRateId}, ${i + 1}, ${carGroup.ratePackage.dailyRates[i]})
            `
          }
        } else if (carGroup.ratePackage.type === "weekly" && carGroup.ratePackage.weeklyRate) {
          // Insert weekly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${carGroupRateId}, 'weekly', ${carGroup.ratePackage.weeklyRate})
          `
        } else if (carGroup.ratePackage.type === "monthly" && carGroup.ratePackage.monthlyRate) {
          // Insert monthly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${carGroupRateId}, 'monthly', ${carGroup.ratePackage.monthlyRate})
          `
        } else if (carGroup.ratePackage.type === "yearly" && carGroup.ratePackage.yearlyRate) {
          // Insert yearly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${carGroupRateId}, 'yearly', ${carGroup.ratePackage.yearlyRate})
          `
        }
      }
    }

    // Process additional options
    const additionalOptionsJson = formData.get("additionalOptions") as string
    if (additionalOptionsJson) {
      const additionalOptions = JSON.parse(additionalOptionsJson) as AdditionalOption[]

      // Delete existing additional options
      await sql`
        DELETE FROM rate_additional_options
        WHERE rental_rate_id = ${id}
      `

      // Only process included options
      const includedOptions = additionalOptions.filter((option) => option.included)

      for (const option of includedOptions) {
        await sql`
          INSERT INTO rate_additional_options (rental_rate_id, additional_option_id, included, customer_pays)
          VALUES (${id}, ${option.id}, ${option.included}, ${option.customerPays})
        `
      }
    }

    revalidatePath("/admin/rate-and-policies/rental-rates")
    revalidatePath(`/admin/rate-and-policies/rental-rates/${id}/edit`)
    revalidatePath(`/admin/rate-and-policies/rental-rates/${id}/view`)
    return { success: true, message: `Rate "${validatedData.rateName}" updated successfully` }
  } catch (error) {
    console.error("Error updating rental rate:", error)
    return { error: "Failed to update rental rate" }
  }
}

// Delete a rental rate
export async function deleteRentalRate(id: string) {
  try {
    // Get rate name for confirmation message
    const rateResult = await sql`
      SELECT rate_name FROM rental_rates WHERE id = ${id}
    `

    if (rateResult.length === 0) {
      return { error: "Rental rate not found" }
    }

    const rateName = rateResult[0].rate_name

    // Delete the rental rate (cascade will delete related records)
    await sql`
      DELETE FROM rental_rates WHERE id = ${id}
    `

    revalidatePath("/admin/rate-and-policies/rental-rates")
    return { success: true, message: `Rate "${rateName}" deleted successfully` }
  } catch (error) {
    console.error("Error deleting rental rate:", error)
    return { error: "Failed to delete rental rate" }
  }
}

// Toggle rental rate status
export async function toggleRentalRateStatus(id: string) {
  try {
    // Get current status
    const rateResult = await sql`
      SELECT rate_name, active FROM rental_rates WHERE id = ${id}
    `

    if (rateResult.length === 0) {
      return { error: "Rental rate not found" }
    }

    const { rate_name, active } = rateResult[0]

    // Toggle status
    await sql`
      UPDATE rental_rates
      SET active = ${!active}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/admin/rate-and-policies/rental-rates")
    return {
      success: true,
      message: `Rate "${rate_name}" ${!active ? "activated" : "deactivated"} successfully`,
    }
  } catch (error) {
    console.error("Error toggling rental rate status:", error)
    return { error: "Failed to update rental rate status" }
  }
}

// Duplicate a rental rate
export async function duplicateRentalRate(id: string) {
  try {
    // Get the rate to duplicate
    const { rate } = await getRentalRateById(id)

    if (!rate) {
      return { error: "Rental rate not found" }
    }

    // Generate a new rate ID
    const newRateId = await generateRateId()

    // Create a new rate with modified name
    const newRateName = `${rate.rateName} (Copy)`

    // Insert the new rental rate
    const result = await sql`
      INSERT INTO rental_rates (
        rate_id, rate_name, pickup_start_date, pickup_end_date, 
        rate_zone_id, booking_start_date, booking_end_date, active
      ) VALUES (
        ${newRateId}, ${newRateName}, ${rate.pickupStartDate}, ${rate.pickupEndDate},
        ${rate.rateZoneId}, ${rate.bookingStartDate}, ${rate.bookingEndDate}, ${rate.active}
      )
      RETURNING id
    `

    const newRentalRateId = result[0].id

    // Duplicate car group rates
    for (const carGroup of rate.carGroupRates) {
      if (carGroup.included) {
        // Insert car group rate
        const carGroupRateResult = await sql`
          INSERT INTO car_group_rates (
            rental_rate_id, vehicle_group_id, miles_per_day, miles_rate,
            deposit_rate_cdw, policy_value_cdw, deposit_rate_pai, policy_value_pai,
            deposit_rate_scdw, policy_value_scdw, deposit_rate_cpp, policy_value_cpp,
            delivery_charges, rate_type, included
          ) VALUES (
            ${newRentalRateId}, ${carGroup.groupId}, ${carGroup.milesPerDay}, ${carGroup.milesRate},
            ${carGroup.depositRateCDW}, ${carGroup.policyValueCDW}, ${carGroup.depositRatePAI}, ${carGroup.policyValuePAI},
            ${carGroup.depositRateSCDW}, ${carGroup.policyValueSCDW}, ${carGroup.depositRateCPP}, ${carGroup.policyValueCPP},
            ${carGroup.deliveryCharges}, ${carGroup.ratePackage.type}, ${carGroup.included}
          )
          RETURNING id
        `

        const newCarGroupRateId = carGroupRateResult[0].id

        // Duplicate rates based on type
        if (carGroup.ratePackage.type === "daily" && carGroup.ratePackage.dailyRates) {
          // Insert daily rates
          for (let i = 0; i < carGroup.ratePackage.dailyRates.length; i++) {
            await sql`
              INSERT INTO daily_rates (car_group_rate_id, day_number, rate_amount)
              VALUES (${newCarGroupRateId}, ${i + 1}, ${carGroup.ratePackage.dailyRates[i]})
            `
          }
        } else if (carGroup.ratePackage.type === "weekly" && carGroup.ratePackage.weeklyRate) {
          // Insert weekly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${newCarGroupRateId}, 'weekly', ${carGroup.ratePackage.weeklyRate})
          `
        } else if (carGroup.ratePackage.type === "monthly" && carGroup.ratePackage.monthlyRate) {
          // Insert monthly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${newCarGroupRateId}, 'monthly', ${carGroup.ratePackage.monthlyRate})
          `
        } else if (carGroup.ratePackage.type === "yearly" && carGroup.ratePackage.yearlyRate) {
          // Insert yearly rate
          await sql`
            INSERT INTO other_rates (car_group_rate_id, rate_type, rate_amount)
            VALUES (${newCarGroupRateId}, 'yearly', ${carGroup.ratePackage.yearlyRate})
          `
        }
      }
    }

    // Duplicate additional options
    if (rate.additionalOptions) {
      for (const option of rate.additionalOptions) {
        if (option.included) {
          await sql`
            INSERT INTO rate_additional_options (rental_rate_id, additional_option_id, included, customer_pays)
            VALUES (${newRentalRateId}, ${option.id}, ${option.included}, ${option.customerPays})
          `
        }
      }
    }

    revalidatePath("/admin/rate-and-policies/rental-rates")
    return { success: true, message: `Rate "${newRateName}" created successfully` }
  } catch (error) {
    console.error("Error duplicating rental rate:", error)
    return { error: "Failed to duplicate rental rate" }
  }
}

// Get all rate zones
export async function getRateZones() {
  try {
    const zones = await sql`
      SELECT id, code, name, description, active
      FROM rate_zones
      ORDER BY name
    `

    return { zones }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to fetch rate zones" }
  }
}

// Get all vehicle groups
export async function getVehicleGroups() {
  try {
    const groups = await sql`
      SELECT id, name, description, active
      FROM vehicle_groups
      ORDER BY name
    `

    return { groups }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to fetch vehicle groups" }
  }
}

// Get all additional options
export async function getAdditionalOptions() {
  try {
    const options = await sql`
      SELECT id, code, description, option_type as "optionType", active
      FROM additional_options
      ORDER BY description
    `

    return { options }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to fetch additional options" }
  }
}
