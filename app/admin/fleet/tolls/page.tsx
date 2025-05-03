import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tolls Management",
  description: "Manage toll payments and records",
}

export default function TollsManagementPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tolls Management</h1>
      <p className="text-muted-foreground mb-4">
        Track and manage toll payments, electronic toll collection devices, and toll-related expenses for your fleet.
      </p>

      <div className="border rounded-lg p-6 bg-card">
        <p className="text-center text-muted-foreground">Tolls Management module is under development.</p>
      </div>
    </div>
  )
}
