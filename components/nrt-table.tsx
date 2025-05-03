"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Eye, Trash2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for NRT entries
const nrtData = [
  {
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
  },
  {
    id: "nrt-002",
    vehicleId: "VEH-002",
    vehicleName: "Honda Civic (XYZ-5678)",
    type: "Repair",
    status: "Completed",
    startDate: "2023-04-28",
    endDate: "2023-05-02",
    duration: "4 days",
    location: "Service Center",
    notes: "Brake system repair",
  },
  {
    id: "nrt-003",
    vehicleId: "VEH-003",
    vehicleName: "Ford Escape (DEF-9012)",
    type: "Transfer",
    status: "Active",
    startDate: "2023-05-02",
    endDate: "2023-05-03",
    duration: "1 day",
    location: "In Transit",
    notes: "Transfer from Downtown to Airport location",
  },
  {
    id: "nrt-004",
    vehicleId: "VEH-004",
    vehicleName: "Nissan Altima (GHI-3456)",
    type: "Preparation",
    status: "Completed",
    startDate: "2023-05-01",
    endDate: "2023-05-01",
    duration: "4 hours",
    location: "Downtown",
    notes: "Vehicle cleaning and preparation for new rental",
  },
  {
    id: "nrt-005",
    vehicleId: "VEH-005",
    vehicleName: "Chevrolet Malibu (JKL-7890)",
    type: "Inspection",
    status: "Scheduled",
    startDate: "2023-05-05",
    endDate: "2023-05-05",
    duration: "2 hours",
    location: "Main Garage",
    notes: "Annual inspection",
  },
]

export function NRTTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Filter the data based on search term and filters
  const filteredData = nrtData.filter((item) => {
    const matchesSearch =
      item.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesType = typeFilter === "all" || item.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search vehicles or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Repair">Repair</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
              <SelectItem value="Preparation">Preparation</SelectItem>
              <SelectItem value="Inspection">Inspection</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No NRT entries found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.vehicleName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeBadgeColor(entry.type)}>
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusBadgeColor(entry.status)}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.startDate}</TableCell>
                  <TableCell>{entry.endDate}</TableCell>
                  <TableCell>{entry.duration}</TableCell>
                  <TableCell>{entry.location}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/fleet/nrt/${entry.id}/view`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/fleet/nrt/${entry.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {entry.status !== "Completed" && (
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
    </div>
  )
}
