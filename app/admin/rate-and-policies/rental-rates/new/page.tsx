"use client"

import { RentalRateForm } from "@/components/rental-rate-form"
import { useEffect, useState } from "react"
import { getRateZones, getVehicleGroups, getAdditionalOptions } from "@/app/actions/rental-rate-actions"

export default function NewRentalRatePage() {
  const [rateZones, setRateZones] = useState([])
  const [vehicleGroups, setVehicleGroups] = useState([])
  const [additionalOptions, setAdditionalOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
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
        console.error("Error loading form data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Rental Rate</h1>
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Rental Rate</h1>
        <p className="text-muted-foreground">Create a new rental rate for a vehicle group</p>
      </div>

      <RentalRateForm rateZones={rateZones} vehicleGroups={vehicleGroups} additionalOptions={additionalOptions} />
    </div>
  )
}
