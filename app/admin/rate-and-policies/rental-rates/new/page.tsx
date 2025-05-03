"use client"

import { RentalRateForm } from "@/components/rental-rate-form"

export default function NewRentalRatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Rental Rate</h1>
        <p className="text-muted-foreground">Create a new rental rate for a vehicle group</p>
      </div>

      <RentalRateForm />
    </div>
  )
}
