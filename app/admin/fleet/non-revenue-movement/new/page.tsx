import { NonRevenueMovementForm } from "@/components/non-revenue-movement-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Non Revenue Movement",
  description: "Create a new non-revenue movement record",
}

export default function CreateNonRevenueMovementPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create Non Revenue Movement</h1>
      <NonRevenueMovementForm />
    </div>
  )
}
