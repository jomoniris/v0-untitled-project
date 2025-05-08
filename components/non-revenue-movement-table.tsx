"use client"

import { useState, useEffect } from "react"
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
import {
  getAllNonRevenueMovements,
  deleteNonRevenueMovement,
  markNonRevenueMovementAsCompleted,
} from "@/app/actions/non-revenue-movement-actions"
import { toast } from "@/components/ui/use-toast"

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
    case "STS-001":
      return "bg-blue-100 text-blue-800"
    case "In Progress":
    case "STS-002":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
    case "STS-003":
      return "bg-green-100 text-green-800"
    case "Cancelled":
    case "STS-004":
      return "bg-red-100 text-red-800"
    case "On Hold":
    case "STS-005":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Get status name from status code
const getStatusName = (statusCode: string) => {
  const statusMap: Record<string, string> = {
    "STS-001": "Scheduled",
    "STS-002": "In Progress",
    "STS-003": "Completed",
    "STS-004": "Cancelled",
    "STS-005": "On Hold",
  }
  return statusMap[statusCode] || statusCode
}

export function NonRevenueMovementTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 5

  // Fetch movements on component mount
  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true)
        const result = await getAllNonRevenueMovements()
        if (result.success) {
          setMovements(result.data || [])
        } else {
          console.error("Error fetching movements:", result.error)
          toast({
            title: "Error",
            description: "Failed to load non-revenue movements. Using mock data instead.",
            variant: "destructive",
          })
          // Use mock data as fallback
          setMovements(mockMovements)
        }
      } catch (error) {
        console.error("Error fetching movements:", error)
        // Use mock data as fallback
        setMovements(mockMovements)
      } finally {
        setLoading(false)
      }
    }

    fetchMovements()
  }, [])

  // Handle delete movement
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this movement?")) {
      try {
        const result = await deleteNonRevenueMovement(id)
        if (result.success) {
          toast({
            title: "Movement deleted",
            description: "The non-revenue movement has been deleted successfully.",
          })
          // Remove from local state
          setMovements(movements.filter((movement) => movement.id !== id))
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete movement.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting movement:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Handle mark as completed
  const handleMarkAsCompleted = async (id: string) => {
    try {
      const result = await markNonRevenueMovementAsCompleted(id, {
        checkin_datetime: new Date(),
        checkin_location: "LOC-001", // Default to Main Garage
        checkin_mileage: 0,
        checkin_tank: 0,
      })

      if (result.success) {
        toast({
          title: "Movement completed",
          description: "The non-revenue movement has been marked as completed.",
        })
        // Update local state
        setMovements(
          movements.map((movement) =>
            movement.id === id ? { ...movement, status: "STS-003", checkin_datetime: new Date() } : movement,
          ),
        )
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark movement as completed.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking movement as completed:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter movements based on search term
  const filteredMovements = movements.filter(
    (movement) =>
      (movement.vehicle?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (movement.driver?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (movement.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  )

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage)

  // Mock data for fallback
  const mockMovements = [
    {
      id: "NRM-001",
      work_order_type: "WOT-001",
      vehicle: "Toyota Camry (ABC-1234)",
      driver: "DRV-001",
      status: "STS-001",
      location: "LOC-001",
      checkout_datetime: new Date("2023-05-15"),
      checkin_datetime: null,
      movement_reason: "RSN-001",
    },
    {
      id: "NRM-002",
      work_order_type: "WOT-003",
      vehicle: "Honda Civic (XYZ-5678)",
      driver: "DRV-002",
      status: "STS-002",
      location: "LOC-002",
      checkout_datetime: new Date("2023-05-16"),
      checkin_datetime: null,
      movement_reason: "RSN-003",
    },
    {
      id: "NRM-003",
      work_order_type: "WOT-002",
      vehicle: "Ford Explorer (DEF-9012)",
      driver: "DRV-003",
      status: "STS-003",
      location: "LOC-004",
      checkout_datetime: new Date("2023-05-10"),
      checkin_datetime: new Date("2023-05-12"),
      movement_reason: "RSN-002",
    },
  ]

  // Get work order type name
  const getWorkOrderTypeName = (typeCode: string) => {
    const typeMap: Record<string, string> = {
      "WOT-001": "Preventive Maintenance",
      "WOT-002": "Corrective Maintenance",
      "WOT-003": "Transfer",
      "WOT-004": "Preparation",
      "WOT-005": "Inspection",
    }
    return typeMap[typeCode] || typeCode
  }

  // Get movement reason name
  const getMovementReasonName = (reasonCode: string) => {
    const reasonMap: Record<string, string> = {
      "RSN-001": "Scheduled Maintenance",
      "RSN-002": "Breakdown Repair",
      "RSN-003": "Location Transfer",
      "RSN-004": "Customer Delivery",
      "RSN-005": "Vehicle Preparation",
      "RSN-006": "Inspection",
    }
    return reasonMap[reasonCode] || reasonCode
  }

  // Get location name
  const getLocationName = (locationCode: string) => {
    const locationMap: Record<string, string> = {
      "LOC-001": "Main Garage",
      "LOC-002": "Downtown Branch",
      "LOC-003": "Airport Location",
      "LOC-004": "Service Center",
      "LOC-005": "North Branch",
    }
    return locationMap[locationCode] || locationCode
  }

  // Get driver name
  const getDriverName = (driverCode: string) => {
    const driverMap: Record<string, string> = {
      "DRV-001": "John Smith",
      "DRV-002": "Sarah Johnson",
      "DRV-003": "Michael Brown",
      "DRV-004": "Emily Davis",
      "DRV-005": "Robert Wilson",
    }
    return driverMap[driverCode] || driverCode
  }

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Loading movements...
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
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
                  <TableCell>{getDriverName(movement.driver)}</TableCell>
                  <TableCell>{getWorkOrderTypeName(movement.work_order_type)}</TableCell>
                  <TableCell>{getMovementReasonName(movement.movement_reason)}</TableCell>
                  <TableCell>{format(new Date(movement.checkout_datetime), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    {movement.checkin_datetime ? format(new Date(movement.checkin_datetime), "MMM dd, yyyy") : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(movement.status)}>{getStatusName(movement.status)}</Badge>
                  </TableCell>
                  <TableCell>{getLocationName(movement.location || movement.checkout_location)}</TableCell>
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
                        {movement.status !== "STS-003" && (
                          <DropdownMenuItem onClick={() => handleMarkAsCompleted(movement.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(movement.id)}>
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
