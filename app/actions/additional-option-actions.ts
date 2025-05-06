"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { z } from "zod"

// Define the additional option schema for validation
const additionalOptionSchema = z.object({
  code: z.string().min(2).max(10),
  description: z.string().min(3).max(100),
  optionType: z.string().min(1),
  mandatorySurcharge: z.boolean().default(false),
  calculationType: z.string().min(1),
  excessWeight: z.number().int().nonnegative(),
  limitationType: z.string().optional(),
  minimumCharge: z.number().nonnegative().optional(),
  maximumCharge: z.number().nonnegative().optional(),
  replacementFee: z.number().nonnegative().optional(),
  nominalAccount: z.string().optional(),
  multipleItems: z.boolean().default(false),
  primaryTaxExempt: z.boolean().default(false),
  secondaryTaxExempt: z.boolean().default(false),
  active: z.boolean().default(true),
  preventPriceChange: z.boolean().default(false),
  leasing: z.boolean().default(false),
  commissionRate: z.number().nonnegative().optional(),
  printText: z.string().optional(),
  printMemo: z.string().optional(),
})

export type AdditionalOptionFormValues = z.infer<typeof additionalOptionSchema>
export type AdditionalOption = AdditionalOptionFormValues & { id: string }

// Get all additional options
export async function getAdditionalOptions() {
  try {
    const options = await sql<AdditionalOption[]>`
      SELECT 
        id, 
        code, 
        description, 
        option_type as "optionType", 
        mandatory_surcharge as "mandatorySurcharge", 
        calculation_type as "calculationType",
        excess_weight as "excessWeight",
        limitation_type as "limitationType",
        minimum_charge as "minimumCharge",
        maximum_charge as "maximumCharge",
        replacement_fee as "replacementFee",
        nominal_account as "nominalAccount",
        multiple_items as "multipleItems",
        primary_tax_exempt as "primaryTaxExempt",
        secondary_tax_exempt as "secondaryTaxExempt",
        active,
        prevent_price_change as "preventPriceChange",
        leasing,
        commission_rate as "commissionRate",
        print_text as "printText",
        print_memo as "printMemo"
      FROM additional_options
      ORDER BY code
    `
    return { options, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { options: [], error: "Failed to fetch additional options" }
  }
}

// Get an additional option by ID
export async function getAdditionalOptionById(id: string) {
  try {
    const [option] = await sql<AdditionalOption[]>`
      SELECT 
        id, 
        code, 
        description, 
        option_type as "optionType", 
        mandatory_surcharge as "mandatorySurcharge", 
        calculation_type as "calculationType",
        excess_weight as "excessWeight",
        limitation_type as "limitationType",
        minimum_charge as "minimumCharge",
        maximum_charge as "maximumCharge",
        replacement_fee as "replacementFee",
        nominal_account as "nominalAccount",
        multiple_items as "multipleItems",
        primary_tax_exempt as "primaryTaxExempt",
        secondary_tax_exempt as "secondaryTaxExempt",
        active,
        prevent_price_change as "preventPriceChange",
        leasing,
        commission_rate as "commissionRate",
        print_text as "printText",
        print_memo as "printMemo"
      FROM additional_options
      WHERE id = ${id}
    `
    return { option, error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { option: null, error: "Failed to fetch additional option" }
  }
}

// Create a new additional option
export async function createAdditionalOption(data: AdditionalOptionFormValues) {
  try {
    // Validate the data
    const validatedData = additionalOptionSchema.parse(data)

    // Insert the additional option into the database
    const [option] = await sql<{ id: string }[]>`
      INSERT INTO additional_options (
        code, 
        description, 
        option_type, 
        mandatory_surcharge, 
        calculation_type,
        excess_weight,
        limitation_type,
        minimum_charge,
        maximum_charge,
        replacement_fee,
        nominal_account,
        multiple_items,
        primary_tax_exempt,
        secondary_tax_exempt,
        active,
        prevent_price_change,
        leasing,
        commission_rate,
        print_text,
        print_memo
      )
      VALUES (
        ${validatedData.code},
        ${validatedData.description},
        ${validatedData.optionType},
        ${validatedData.mandatorySurcharge},
        ${validatedData.calculationType},
        ${validatedData.excessWeight},
        ${validatedData.limitationType || null},
        ${validatedData.minimumCharge || null},
        ${validatedData.maximumCharge || null},
        ${validatedData.replacementFee || null},
        ${validatedData.nominalAccount || null},
        ${validatedData.multipleItems},
        ${validatedData.primaryTaxExempt},
        ${validatedData.secondaryTaxExempt},
        ${validatedData.active},
        ${validatedData.preventPriceChange},
        ${validatedData.leasing},
        ${validatedData.commissionRate || null},
        ${validatedData.printText || null},
        ${validatedData.printMemo || null}
      )
      RETURNING id
    `

    revalidatePath("/admin/company/finance/additional-options")
    return { option, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { option: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { option: null, error: "Failed to create additional option" }
  }
}

// Update an additional option
export async function updateAdditionalOption(id: string, data: AdditionalOptionFormValues) {
  try {
    // Validate the data
    const validatedData = additionalOptionSchema.parse(data)

    // Update the additional option in the database
    const [option] = await sql<{ id: string }[]>`
      UPDATE additional_options
      SET 
        code = ${validatedData.code},
        description = ${validatedData.description},
        option_type = ${validatedData.optionType},
        mandatory_surcharge = ${validatedData.mandatorySurcharge},
        calculation_type = ${validatedData.calculationType},
        excess_weight = ${validatedData.excessWeight},
        limitation_type = ${validatedData.limitationType || null},
        minimum_charge = ${validatedData.minimumCharge || null},
        maximum_charge = ${validatedData.maximumCharge || null},
        replacement_fee = ${validatedData.replacementFee || null},
        nominal_account = ${validatedData.nominalAccount || null},
        multiple_items = ${validatedData.multipleItems},
        primary_tax_exempt = ${validatedData.primaryTaxExempt},
        secondary_tax_exempt = ${validatedData.secondaryTaxExempt},
        active = ${validatedData.active},
        prevent_price_change = ${validatedData.preventPriceChange},
        leasing = ${validatedData.leasing},
        commission_rate = ${validatedData.commissionRate || null},
        print_text = ${validatedData.printText || null},
        print_memo = ${validatedData.printMemo || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id
    `

    revalidatePath("/admin/company/finance/additional-options")
    revalidatePath(`/admin/company/finance/additional-options/${id}/view`)
    revalidatePath(`/admin/company/finance/additional-options/${id}/edit`)
    return { option, error: null }
  } catch (error) {
    console.error("Database error:", error)
    if (error instanceof z.ZodError) {
      return { option: null, error: "Validation failed: " + JSON.stringify(error.errors) }
    }
    return { option: null, error: "Failed to update additional option" }
  }
}

// Delete an additional option
export async function deleteAdditionalOption(id: string) {
  try {
    await sql`
      DELETE FROM additional_options
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/finance/additional-options")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to delete additional option" }
  }
}

// Toggle additional option status
export async function toggleAdditionalOptionStatus(id: string, currentStatus: boolean) {
  try {
    await sql`
      UPDATE additional_options
      SET active = ${!currentStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/admin/company/finance/additional-options")
    return { error: null }
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to update additional option status" }
  }
}
