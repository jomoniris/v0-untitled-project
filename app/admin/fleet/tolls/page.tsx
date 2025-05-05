"use client"

export default function FleetTollsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Tolls</h1>
        <p className="text-muted-foreground">Manage toll payments and records for your fleet</p>
      </div>

      <div className="rounded-md border p-4">
        <p className="text-center text-muted-foreground">
          Toll data is temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  )
}
