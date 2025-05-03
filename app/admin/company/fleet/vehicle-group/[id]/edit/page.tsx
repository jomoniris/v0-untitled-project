"use client"

import { VehicleGroupForm } from "@/components/vehicle-group-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Mock API function to get vehicle group data
async function getVehicleGroupById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const groups = [
    {
      id: "1",
      code: "ECON",
      description: "Economy",
      sipCode: "ECAR",
      class: "economy",
      autoAllocate: true,
      fuelType: "petrol",
      tankCapacity: 45,
      doors: 4,
      suitcases: 1,
      pax: 5,
      bags: 1,
      minAge: 21,
      youngDriverLimit: 25,
      maxAgeLimit: 75,
      drivingYears: 2,
      seniorLimit: 70,
      upgradeMode: "automatic",
      alternateGroups: "compact",
      image: "/urban-civic-night.png",
    },
    {
      id: "2",
      code: "COMP",
      description: "Compact",
      sipCode: "CCAR",
      class: "compact",
      autoAllocate: true,
      fuelType: "petrol",
      tankCapacity: 50,
      doors: 4,
      suitcases: 2,
      pax: 5,
      bags: 2,
      minAge: 21,
      youngDriverLimit: 25,
      maxAgeLimit: 75,
      drivingYears: 2,
      seniorLimit: 70,
      upgradeMode: "automatic",
      alternateGroups: "midsize",
      image: "/urban-rav4-adventure.png",
    },
  ]

  return groups.find((group) => group.id === id)
}

export default function EditVehicleGroupPage() {
  const params = useParams()
  const id = params.id as string
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVehicleGroup() {
      try {
        const data = await getVehicleGroupById(id)
        if (data) {
          setGroup(data)
        } else {
          setError("Vehicle group not found")
        }
      } catch (err) {
        setError("Failed to load vehicle group data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadVehicleGroup()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle Group</h1>
          <p className="text-muted-foreground">Loading vehicle group data...</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle Group</h1>
        <p className="text-muted-foreground">Update vehicle group information</p>
      </div>

      <VehicleGroupForm initialData={group} isEditing={true} />
    </div>
  )
}
