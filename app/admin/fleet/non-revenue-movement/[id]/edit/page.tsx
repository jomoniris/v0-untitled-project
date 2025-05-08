import { NonRevenueMovementForm } from "@/components/non-revenue-movement-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Non Revenue Movement",
  description: "Edit an existing non-revenue movement record",
}

// Mock data for the form
const mockMovement = {
  id: "NRM-001",
  workOrderType: "WOT-001", // Preventive Maintenance
  supplier: "AutoParts Inc.",
  claim: "CLM-001", // Insurance Claim
  vehicle: "Toyota Camry (ABC-1234)",
  driver: "DRV-001", // John Smith
  movementReason: "RSN-001", // Scheduled Maintenance
  createdBy: "USR-001", // Admin User
  status: "STS-001", // Scheduled
  location: "LOC-001", // Main Garage
  checkoutDatetime: new Date("2023-05-15"),
  checkoutMileage: "15000",
  checkoutTank: "75",
  checkinDatetime: null,
  checkinMileage: "0",
  checkinTank: "0",
  notes: "Regular maintenance as per schedule. Oil change and filter replacement.",
  items: [
    {
      task: "TSK-001", // Oil Change
      parts: "PRT-001", // Oil Filter
      cost: "45.00",
      laborCost: "30.00",
      vat: "15.00",
      total: "90.00",
      warranty: false,
    },
    {
      task: "TSK-004", // Air Filter Replacement
      parts: "PRT-002", // Air Filter
      cost: "25.00",
      laborCost: "15.00",
      vat: "8.00",
      total: "48.00",
      warranty: true,
    },
  ],
}

// Make the component async to properly handle params
export default async function EditNonRevenueMovementPage({ params }: { params: { id: string } }) {
  // Await the params to fix the error
  const id = params.id

  // In a real app, you would fetch the movement data based on the ID
  // const movement = await fetchMovementById(id);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Non Revenue Movement</h1>
      <p className="text-muted-foreground mb-6">Editing movement ID: {id}</p>
      <NonRevenueMovementForm initialData={mockMovement} />
    </div>
  )
}
