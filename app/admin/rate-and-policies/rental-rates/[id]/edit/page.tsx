"use client"

import { RentalRateForm } from "@/components/rental-rate-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getRentalRateById, getVehicleGroups, getAdditionalOptions } from "@/app/actions/rental-rate-actions"
import { getRateZones } from "@/app/actions/rate-zone-actions"

export default function EditRentalRatePage() {
  const params = useParams()
  const id = params.id as string
  const [rate, setRate] = useState<any>(null)
  const [rateZones, setRateZones] = useState([])
  const [vehicleGroups, setVehicleGroups] = useState([])
  const [additionalOptions, setAdditionalOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch rate data
        const { rate: rateData, error: rateError } = await getRentalRateById(id)
        if (rateError) {
          setError(rateError)
        } else if (rateData) {
          setRate(rateData)
        } else {
          setError("Rate not found")
        }

        // Fetch rate zones
        const { zones, error: zonesError } = await getRateZones()
        if (zonesError) {
          console.error("Error loading rate zones:", zonesError)
        } else {
          setRateZones(zones || [])
        }

        // Fetch vehicle groups
        const { groups, error: groupsError } = await getVehicleGroups()
        if (groupsError) {
          console.error("Error loading vehicle groups:", groupsError)
        } else {
          setVehicleGroups(groups || [])
        }

        // Fetch additional options
        const { options, error: optionsError } = await getAdditionalOptions()
        if (optionsError) {
          console.error("Error loading additional options:", optionsError)
        } else {
          setAdditionalOptions(options || [])
        }
      } catch (err) {
        setError("Failed to load rate data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Rental Rate</h1>
          <p className="text-muted-foreground">Loading rate data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Rental Rate</h1>
        <p className="text-muted-foreground">Update rental rate information</p>
      </div>

      <RentalRateForm
        initialData={rate}
        isEditing={true}
        rateId={id}
        rateZones={rateZones}
        vehicleGroups={vehicleGroups}
        additionalOptions={additionalOptions}
      />
    </div>
  )
}
