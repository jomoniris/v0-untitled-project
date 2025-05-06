"use client"

import { AdditionalOptionForm } from "@/components/additional-option-form"

export default function NewAdditionalOptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Option</h1>
        <p className="text-muted-foreground">Create a new additional option for rentals</p>
      </div>

      <AdditionalOptionForm />
    </div>
  )
}
