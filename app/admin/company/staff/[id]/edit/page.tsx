import { StaffForm } from "@/components/staff-form"

// Mock data for a staff member
const staffMember = {
  id: "1",
  fullName: "John Smith",
  username: "johnsmith",
  email: "john.smith@example.com",
  password: "password123",
  mobile: "+1 (555) 123-4567",
  workPhone: "+1 (555) 987-6543",
  role: "admin",
  team: "operations",
  reportsTo: "none",
  accessLocations: ["downtown", "airport"],
  active: true,
}

export default function EditStaffPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Staff Member</h2>
        <p className="text-muted-foreground">Update staff member details and access permissions.</p>
      </div>
      <StaffForm initialData={staffMember} id={params.id} />
    </div>
  )
}
