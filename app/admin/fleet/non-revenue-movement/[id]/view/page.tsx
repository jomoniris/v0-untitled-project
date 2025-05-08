import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, ArrowLeft, FileText } from "lucide-react"
import type { Metadata } from "next"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = {
  title: "View Non Revenue Movement",
  description: "View details of a non-revenue movement record",
}

// Mock data for the view
const mockMovement = {
  id: "NRM-001",
  workOrderType: "Preventive Maintenance",
  supplier: "AutoParts Inc.",
  claim: "Insurance Claim #INS-2023-001",
  vehicle: "Toyota Camry (ABC-1234)",
  driver: "John Smith",
  movementReason: "Scheduled Maintenance",
  createdBy: "Admin User",
  status: "Scheduled",
  location: "Main Garage",
  checkoutDatetime: new Date("2023-05-15"),
  checkoutMileage: 15000,
  checkoutTank: 75,
  checkinDatetime: null,
  checkinMileage: 0,
  checkinTank: 0,
  notes: "Regular maintenance as per schedule. Oil change and filter replacement.",
  items: [
    {
      task: "Oil Change",
      parts: "Oil Filter",
      cost: 45.0,
      laborCost: 30.0,
      vat: 15.0,
      total: 90.0,
      warranty: false,
    },
    {
      task: "Air Filter Replacement",
      parts: "Air Filter",
      cost: 25.0,
      laborCost: 15.0,
      vat: 8.0,
      total: 48.0,
      warranty: true,
    },
  ],
  createdAt: new Date("2023-05-10T09:30:00"),
  updatedAt: new Date("2023-05-10T14:15:00"),
}

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800"
    case "In Progress":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-green-100 text-green-800"
    case "Cancelled":
      return "bg-red-100 text-red-800"
    case "On Hold":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Make the component async to properly handle params
export default async function ViewNonRevenueMovementPage({ params }: { params: { id: string } }) {
  // Await the params to fix the error
  const id = params.id

  // In a real app, you would fetch the movement data based on the ID
  // const movement = await fetchMovementById(id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/fleet/non-revenue-movement">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Non Revenue Movement Details</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/fleet/non-revenue-movement/${id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Movement ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockMovement.id}</p>
            <p className="text-sm text-muted-foreground">Created on {format(mockMovement.createdAt, "MMM dd, yyyy")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${getStatusColor(mockMovement.status)} text-lg px-3 py-1`}>{mockMovement.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${mockMovement.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">{mockMovement.items.length} items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Movement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Work Order Type</p>
                <p>{mockMovement.workOrderType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                <p>{mockMovement.supplier || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Claim</p>
                <p>{mockMovement.claim || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicle</p>
                <p>{mockMovement.vehicle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Driver</p>
                <p>{mockMovement.driver}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Movement Reason</p>
                <p>{mockMovement.movementReason}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p>{mockMovement.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{mockMovement.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checkout & Checkin Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Checkout Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{format(mockMovement.checkoutDatetime, "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mileage</p>
                  <p>{mockMovement.checkoutMileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tank</p>
                  <p>{mockMovement.checkoutTank}%</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Checkin Details</h3>
              {mockMovement.checkinDatetime ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p>{format(mockMovement.checkinDatetime, "MMM dd, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mileage</p>
                    <p>{mockMovement.checkinMileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tank</p>
                    <p>{mockMovement.checkinTank}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Not checked in yet</p>
              )}
            </div>

            {mockMovement.notes && (
              <div>
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm">{mockMovement.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item List</CardTitle>
          <CardDescription>Items and services associated with this movement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Parts</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Labor Cost</TableHead>
                <TableHead>VAT</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Warranty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMovement.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.task}</TableCell>
                  <TableCell>{item.parts}</TableCell>
                  <TableCell>${item.cost.toFixed(2)}</TableCell>
                  <TableCell>${item.laborCost.toFixed(2)}</TableCell>
                  <TableCell>${item.vat.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                  <TableCell>{item.warranty ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={5} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="font-bold">
                  ${mockMovement.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {format(mockMovement.updatedAt, "MMM dd, yyyy 'at' h:mm a")}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
