import { Button } from "@/components/ui/button"
import { FleetMenu } from "@/components/fleet-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for an NRT entry
const nrtEntry = {
  id: "nrt-001",
  vehicleId: "VEH-001",
  vehicleName: "Toyota Camry (ABC-1234)",
  type: "Maintenance",
  status: "Active",
  startDate: "2023-05-01",
  endDate: "2023-05-03",
  duration: "2 days",
  location: "Main Garage",
  notes: "Regular maintenance and oil change",
  createdBy: "John Doe",
  createdAt: "2023-04-28",
  updatedAt: "2023-04-30",
}

// Function to get badge color based on status
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "Scheduled":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Function to get badge color based on type
const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "Maintenance":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    case "Repair":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "Transfer":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
    case "Preparation":
      return "bg-teal-100 text-teal-800 hover:bg-teal-100"
    case "Inspection":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export default function ViewNRTPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NRT Entry Details</h1>
          <p className="text-muted-foreground">View non-revenue time entry #{params.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/fleet/nrt">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/fleet/nrt/${params.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <FleetMenu />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicle</p>
                <p className="text-lg font-medium">{nrtEntry.vehicleName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <Badge variant="secondary" className={getTypeBadgeColor(nrtEntry.type)}>
                  {nrtEntry.type}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="secondary" className={getStatusBadgeColor(nrtEntry.status)}>
                  {nrtEntry.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-lg font-medium">{nrtEntry.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="text-lg font-medium">{nrtEntry.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                <p className="text-lg font-medium">{nrtEntry.endDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="text-lg font-medium">{nrtEntry.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{nrtEntry.notes}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Audit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="text-lg font-medium">{nrtEntry.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-lg font-medium">{nrtEntry.createdAt}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-lg font-medium">{nrtEntry.updatedAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
