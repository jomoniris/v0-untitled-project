import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fleet Preparations",
  description: "Manage vehicle preparation for rentals",
}

export default function FleetPreparationsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fleet Preparations</h1>
      <p className="text-muted-foreground mb-4">
        Manage the preparation of vehicles for rental, including cleaning, fueling, and inspection processes.
      </p>

      <div className="border rounded-lg p-6 bg-card">
        <p className="text-center text-muted-foreground">Fleet Preparations management module is under development.</p>
      </div>
    </div>
  )
}
