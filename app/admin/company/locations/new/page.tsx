"use client"

import { LocationForm } from "@/components/location-form"

export default function NewLocationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Location</h1>
        <p className="text-muted-foreground">Create a new rental location</p>
      </div>

      <LocationForm />
    </div>
  )
}
