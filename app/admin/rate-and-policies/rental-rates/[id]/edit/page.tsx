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
  const { id } = params

  // Fetch the rental rate to edit
  const { rate, error } = await getRentalRateById(id)

  if (error || !rate) {
    notFound()
  }

  // Fetch rate zones, vehicle groups, and additional options
  const { zones: rateZones } = await getRateZones()
  const { groups: vehicleGroups } = await getVehicleGroups()
  const { options: additionalOptions } = await getAdditionalOptions()

  // Fetch zones from Zone Management
  const { zones } = await getZones()

  // Map zones from Zone Management to the format expected by the form
  const mappedZones = zones.map((zone) => ({
    id: zone.id,
    code: zone.code,
    name: zone.description,
  }))

  return (
    <div className="container mx-auto py-10">
      <RentalRateForm
        initialData={rate}
        isEditing={true}
        rateId={id}
        rateZones={mappedZones || []}
        vehicleGroups={vehicleGroups || []}
        additionalOptions={additionalOptions || []}
      />
    </div>
  )
}
