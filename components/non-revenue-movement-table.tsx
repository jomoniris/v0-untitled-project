"use client"

import { useState } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Eye, Pencil, Trash2, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"

// Mock data for the table
const mockMovements = [
  {
    id: "NRM-001",
    workOrderType: "Preventive Maintenance",
    vehicle: "Toyota Camry (ABC-1234)",
    driver: "John Smith",
    status: "Scheduled",
    location: "Main Garage",
    checkoutDate: new Date("2023-05-15"),
    checkinDate: null,
    movementReason: "Scheduled Maintenance",
  },
  {
    id: "NRM-002",
    workOrderType: "Transfer",
    vehicle: "Honda Civic (XYZ-5678)",
    driver: "Sarah Johnson",
    status: "In Progress",
    location: "Downtown Branch",
    checkoutDate: new Date("2023-05-16"),
    checkinDate: null,
    movementReason: "Location Transfer",
  },
  {
    id: "NRM-003",
    workOrderType: "Corrective Maintenance",
    vehicle: "Ford Explorer (DEF-9012)",
    driver: "Michael Brown",
    status: "Completed",
    location: "Service Center",
    checkoutDate: new Date("2023-05-10"),
    checkinDate: new Date("2023-05-12"),
    movementReason: "Breakdown Repair",
  },
  {
    id: "NRM-004",
    workOrderType: "Inspection",
    vehicle: "Nissan Altima (GHI-3456)",
    driver: "Emily Davis",
    status: "Completed",
    location: "Airport Location",
    checkoutDate: new Date("2023-05-08"),
    checkinDate: new Date("2023-05-08"),
    movementReason: "Inspection",
  },
  {
    id: "NRM-005",
    workOrderType: "Preparation",
    vehicle: "Chevrolet Malibu (JKL-7890)",
    driver: "Robert Wilson",
    status: "Cancelled",
    location: "North Branch",
    checkoutDate: new Date("2023-05-14"),
    checkinDate: null,
    movementReason: "Vehicle Preparation",
  },
  {
    id: "NRM-006",
    workOrderType: "Transfer",
    vehicle: "Hyundai Sonata (MNO-1234)",
    driver: "Jennifer Lee",
    status: "On Hold",
    location: "Downtown Branch",
    checkoutDate: new Date("2023-05-17"),
    checkinDate: null,
    movementReason: "Location Transfer",
  },
  {
    id: "NRM-007",
    workOrderType: "Preventive Maintenance",
    vehicle: "Kia Optima (PQR-5678)",
    driver: "David Martinez",
    status: "Scheduled",
    location: "Service Center",
    checkoutDate: new Date("2023-05-20"),
    checkinDate: null,
    movementReason: "Scheduled Maintenance",
  },
  {
    id: "NRM-008",
    workOrderType: "Corrective Maintenance",
    vehicle: "Mazda 6 (STU-9012)",
    driver: "Lisa Anderson",
    status: "In Progress",
    location: "Main Garage",
    checkoutDate: new Date("2023-05-18"),
    checkinDate: null,
    movementReason: "Breakdown Repair",
  },
]

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

export function NonRevenueMovementTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter movements based on search term
  const filteredMovements = mockMovements.filter(
    (movement) =>
      movement.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movements..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Checkout Date</TableHead>
              <TableHead>Checkin Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No movements found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-medium">{movement.id}</TableCell>
                  <TableCell>{movement.vehicle}</TableCell>
                  <TableCell>{movement.driver}</TableCell>
                  <TableCell>{movement.workOrderType}</TableCell>
                  <TableCell>{movement.movementReason}</TableCell>
                  <TableCell>{format(movement.checkoutDate, "MMM dd, yyyy")}</TableCell>
                  <TableCell>{movement.checkinDate ? format(movement.checkinDate, "MMM dd, yyyy") : "-"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(movement.status)}>{movement.status}</Badge>
                  </TableCell>
                  <TableCell>{movement.location}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/fleet/non-revenue-movement/${movement.id}/view`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/fleet/non-revenue-movement/${movement.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {movement.status !== "Completed" && (
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredMovements.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-medium">
              {indexOfLastItem > filteredMovements.length ? filteredMovements.length : indexOfLastItem}
            </span>{" "}
            of <span className="font-medium">{filteredMovements.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
