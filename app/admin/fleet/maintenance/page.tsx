"use client"

export default function FleetMaintenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Maintenance</h1>
        <p className="text-muted-foreground">Manage maintenance schedules and records for your fleet</p>
      </div>

      <div className="rounded-md border p-4">
        <p className="text-center text-muted-foreground">
          Maintenance data is temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  )
}
