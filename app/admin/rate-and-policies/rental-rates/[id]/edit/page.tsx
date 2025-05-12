import {
  getRentalRateById,
  getRateZones,
  getVehicleGroups,
  getAdditionalOptions,
} from "@/app/actions/rental-rate-actions"
import { RentalRateForm } from "@/components/rental-rate-form"
import { getZones } from "@/app/actions/zone-actions"
import { notFound } from "next/navigation"

export default async function EditRentalRatePage({ params }: { params: { id: string } }) {
  // Properly await the params by using it in an async context
  const id = params.id

  console.log("Fetching rental rate for edit, ID:", id)

  // Fetch the rental rate to edit
  const { rate, error } = await getRentalRateById(id)

  if (error || !rate) {
    console.error("Error fetching rental rate:", error)
    notFound()
  }

  console.log("Fetched rental rate:", {
    id: rate.id,
    rateId: rate.rateId,
    rateName: rate.rateName,
    additionalOptionsCount: rate.additionalOptions?.length || 0,
  })

  // Format dates for the form (ISO format YYYY-MM-DD)
  const formattedRate = {
    ...rate,
    pickupStartDate: formatDateForInput(rate.pickupStartDate),
    pickupEndDate: formatDateForInput(rate.pickupEndDate),
    bookingStartDate: formatDateForInput(rate.bookingStartDate),
    bookingEndDate: formatDateForInput(rate.bookingEndDate),
  }

  console.log("Formatted dates for edit form:", {
    original: {
      pickupStartDate: rate.pickupStartDate,
      pickupEndDate: rate.pickupEndDate,
      bookingStartDate: rate.bookingStartDate,
      bookingEndDate: rate.bookingEndDate,
    },
    formatted: {
      pickupStartDate: formattedRate.pickupStartDate,
      pickupEndDate: formattedRate.pickupEndDate,
      bookingStartDate: formattedRate.bookingStartDate,
      bookingEndDate: formattedRate.bookingEndDate,
    },
  })

  // Fetch rate zones, vehicle groups, and additional options
  const { zones: rateZones } = await getRateZones()
  const { groups: vehicleGroups } = await getVehicleGroups()
  const { options: additionalOptions } = await getAdditionalOptions()

  console.log("Fetched additional options:", {
    count: additionalOptions?.length || 0,
    firstFew: additionalOptions?.slice(0, 3) || [],
  })

  // Fetch zones from Zone Management
  const { zones } = await getZones()

  // Map zones from Zone Management to the format expected by the form
  const mappedZones = zones.map((zone) => ({
    id: zone.id,
    code: zone.code,
    name: zone.description,
  }))

  // Ensure additionalOptions is properly initialized
  if (!formattedRate.additionalOptions || !Array.isArray(formattedRate.additionalOptions)) {
    console.log("Initializing empty additionalOptions array")
    formattedRate.additionalOptions = []
  }

  // Map the existing additional options to the format expected by the form
  const mappedAdditionalOptions = additionalOptions.map((option) => {
    // Find if this option is included in the rate
    const existingOption = formattedRate.additionalOptions.find((o) => o.id === option.id)

    return {
      id: option.id,
      code: option.code,
      description: option.description,
      included: existingOption ? existingOption.included : false,
      customerPays: existingOption ? existingOption.customerPays : true,
    }
  })

  console.log("Mapped additional options:", {
    count: mappedAdditionalOptions.length,
    firstFew: mappedAdditionalOptions.slice(0, 3),
  })

  // Update the formattedRate with the mapped additional options
  formattedRate.additionalOptions = mappedAdditionalOptions

  return (
    <div className="container mx-auto py-10">
      <RentalRateForm
        initialData={formattedRate}
        isEditing={true}
        rateId={id}
        rateZones={mappedZones || []}
        vehicleGroups={vehicleGroups || []}
        additionalOptions={additionalOptions || []}
      />
    </div>
  )
}

// Helper function to format dates for input fields
function formatDateForInput(dateString: string | null | undefined): string {
  if (!dateString) return ""

  try {
    // Handle different date formats
    let date

    // Check if it's already in ISO format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString.split("T")[0] // Remove time part if present
    }

    // Try to parse as a date string
    date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString)
      return ""
    }

    // Format as YYYY-MM-DD for input[type="date"]
    return date.toISOString().split("T")[0]
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}
