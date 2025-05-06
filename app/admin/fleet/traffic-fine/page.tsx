"use client"

export default function FleetTrafficFinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Traffic Fines</h1>
        <p className="text-muted-foreground">Manage traffic fines and violations for your fleet</p>
      </div>

      <div className="rounded-md border p-4">
        <p className="text-center text-muted-foreground">
          Traffic fine data is temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  )
}
