import { StaffTable } from "@/components/staff-table"

export default function StaffPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Staff Management</h2>
        <p className="text-muted-foreground">Manage your company staff members, their roles, and access permissions.</p>
      </div>
      <StaffTable />
    </div>
  )
}
