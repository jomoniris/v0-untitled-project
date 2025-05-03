import { NRTForm } from "@/components/nrt-form"
import { FleetMenu } from "@/components/fleet-menu"

// Mock data for an existing NRT entry
const mockNRTData = {
  vehicleId: "VEH-001",
  type: "Maintenance",
  status: "Active",
  startDate: new Date("2023-05-01"),
  endDate: new Date("2023-05-03"),
  location: "LOC-001",
  notes: "Regular maintenance and oil change",
}

export default function EditNRTPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the data based on the ID
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit NRT Entry</h1>
        <p className="text-muted-foreground">Update non-revenue time entry #{params.id}</p>
      </div>

      <FleetMenu />

      <NRTForm initialData={mockNRTData} />
    </div>
  )
}
