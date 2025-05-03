import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parking Management",
  description: "Manage parking locations and expenses",
}

export default function ParkingManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Parking Management</h1>
      <p className="text-muted-foreground mb-4">
        Manage parking locations, permits, and parking-related expenses for your fleet vehicles.
      </p>

      <div className="border rounded-lg p-6 bg-card">
        <p className="text-center text-muted-foreground">Parking Management module is under development.</p>
      </div>
    </div>
  )
}
