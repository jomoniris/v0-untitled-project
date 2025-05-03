import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fleet Maintenance",
  description: "Manage fleet maintenance schedules and records",
}

export default function FleetMaintenancePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Fleet Maintenance</h1>
      <p className="text-muted-foreground mb-4">
        Schedule and track maintenance activities for your fleet vehicles, including regular service, repairs, and
        inspections.
      </p>

      <div className="border rounded-lg p-6 bg-card">
        <p className="text-center text-muted-foreground">Fleet Maintenance management module is under development.</p>
      </div>
    </div>
  )
}
