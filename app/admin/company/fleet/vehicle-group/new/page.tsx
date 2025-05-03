"use client"

import { VehicleGroupForm } from "@/components/vehicle-group-form"

export default function NewVehicleGroupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Vehicle Group</h1>
        <p className="text-muted-foreground">Create a new vehicle group for your rental fleet</p>
      </div>

      <VehicleGroupForm />
    </div>
  )
}
