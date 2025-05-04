"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getStaffMemberById } from "@/app/actions/staff-actions"

export default function ViewStaffPage() {
  const params = useParams()
  const id = params.id as string
  const [staffMember, setStaffMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStaffMember() {
      try {
        const { staff, error } = await getStaffMemberById(id)
        if (error) {
          setError(error)
        } else if (staff) {
          setStaffMember(staff)
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
          <h2 className="text-2xl font-bold tracking-tight">Staff Details</h2>
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Details</h2>
          <p className="text-muted-foreground">View detailed information about this staff member.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/company/staff">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Staff
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/company/staff/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Staff
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{staffMember.fullName}</CardTitle>
              <CardDescription>{staffMember.username}</CardDescription>
            </div>
            <Badge variant={staffMember.active ? "default" : "secondary"}>
              {staffMember.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="font-medium">Email:</span> {staffMember.email}
                </div>
                <div>
                  <span className="font-medium">Mobile:</span> {staffMember.mobile || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Work Phone:</span> {staffMember.workPhone || "N/A"}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role Information</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="font-medium">Role:</span> {staffMember.role}
                </div>
                <div>
                  <span className="font-medium">Team:</span> {staffMember.team}
                </div>
                <div>
                  <span className="font-medium">Reports To:</span> {staffMember.reportsTo || "None"}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Access Locations</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {staffMember.accessLocations && staffMember.accessLocations.length > 0 ? (
                staffMember.accessLocations.map((location: string) => (
                  <Badge key={location} variant="outline">
                    {location}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">No access locations assigned</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
