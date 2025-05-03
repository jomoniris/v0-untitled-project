"use client"

import { ZoneForm } from "@/components/zone-form"

export default function NewZonePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Zone</h1>
        <p className="text-muted-foreground">Create a new zone for your rental locations</p>
      </div>

      <ZoneForm />
    </div>
  )
}
