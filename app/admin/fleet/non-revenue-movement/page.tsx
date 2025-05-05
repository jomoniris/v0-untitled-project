"use client"

export default function FleetNonRevenueMovementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Non-Revenue Movement</h1>
        <p className="text-muted-foreground">Manage non-revenue vehicle movements</p>
      </div>

      <div className="rounded-md border p-4">
        <p className="text-center text-muted-foreground">
          Non-revenue movement data is temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  )
}
