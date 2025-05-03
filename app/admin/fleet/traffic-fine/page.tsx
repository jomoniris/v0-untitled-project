import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Traffic Fine Management",
  description: "Manage traffic violations and fines",
}

export default function TrafficFinePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Traffic Fine Management</h1>
      <p className="text-muted-foreground mb-4">
        Track and manage traffic violations, fines, and related correspondence for your fleet vehicles.
      </p>

      <div className="border rounded-lg p-6 bg-card">
        <p className="text-center text-muted-foreground">Traffic Fine Management module is under development.</p>
      </div>
    </div>
  )
}
