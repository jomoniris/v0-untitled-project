"use client"

export default function FleetUtilizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Utilization</h1>
        <p className="text-muted-foreground">Monitor and analyze your fleet utilization metrics</p>
      </div>

      <div className="rounded-md border p-4">
        <p className="text-center text-muted-foreground">
          Fleet utilization data is temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  )
}
