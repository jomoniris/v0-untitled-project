import { StaffForm } from "@/components/staff-form"

export default function NewStaffPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add New Staff Member</h2>
        <p className="text-muted-foreground">Create a new staff member account with appropriate access permissions.</p>
      </div>
      <StaffForm />
    </div>
  )
}
