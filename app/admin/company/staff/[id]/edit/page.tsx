"use client"

import { StaffForm } from "@/components/staff-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getStaffMemberById } from "@/app/actions/staff-actions"

export default function EditStaffPage() {
  const params = useParams()
  const id = params.id as string
  const [staffData, setStaffData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStaffMember() {
      try {
        const { staff, error } = await getStaffMemberById(id)
        if (error) {
          setError(error)
        } else if (staff) {
          setStaffData(staff)
        } else {
          setError("Staff member not found")
        }
      } catch (err) {
        setError("Failed to load staff data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadStaffMember()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Staff Member</h2>
          <p className="text-muted-foreground">Loading staff data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Staff Member</h2>
        <p className="text-muted-foreground">Update staff member details and access permissions.</p>
      </div>
      <StaffForm initialData={staffData} id={id} />
    </div>
  )
}
