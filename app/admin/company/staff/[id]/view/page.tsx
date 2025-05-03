import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for a staff member
const staffMember = {
  id: "1",
  fullName: "John Smith",
  username: "johnsmith",
  email: "john.smith@example.com",
  mobile: "+1 (555) 123-4567",
  workPhone: "+1 (555) 987-6543",
  role: "Administrator",
  team: "Operations",
  reportsTo: "None",
  accessLocations: ["Downtown Office", "Airport Terminal"],
  active: true,
}

export default function ViewStaffPage({ params }: { params: { id: string } }) {
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
            <Link href={`/admin/company/staff/${params.id}/edit`}>
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
                  <span className="font-medium">Mobile:</span> {staffMember.mobile}
                </div>
                <div>
                  <span className="font-medium">Work Phone:</span> {staffMember.workPhone}
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
                  <span className="font-medium">Reports To:</span> {staffMember.reportsTo}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Access Locations</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {staffMember.accessLocations.map((location) => (
                <Badge key={location} variant="outline">
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
