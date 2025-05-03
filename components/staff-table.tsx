"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Mock data for staff
const staffData = [
  {
    id: "1",
    fullName: "John Smith",
    username: "johnsmith",
    email: "john.smith@example.com",
    role: "Administrator",
    team: "Operations",
    active: true,
    locations: ["Downtown Office", "Airport Terminal"],
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    username: "sarahj",
    email: "sarah.johnson@example.com",
    role: "Manager",
    team: "Sales",
    active: true,
    locations: ["City Center", "West Side Branch"],
  },
  {
    id: "3",
    fullName: "Michael Brown",
    username: "michaelb",
    email: "michael.brown@example.com",
    role: "Agent",
    team: "Customer Service",
    active: false,
    locations: ["East Side Branch"],
  },
  {
    id: "4",
    fullName: "Emily Davis",
    username: "emilyd",
    email: "emily.davis@example.com",
    role: "Finance",
    team: "Administration",
    active: true,
    locations: ["Downtown Office", "North Mall Kiosk"],
  },
  {
    id: "5",
    fullName: "Robert Wilson",
    username: "robertw",
    email: "robert.wilson@example.com",
    role: "Maintenance",
    team: "Fleet Management",
    active: true,
    locations: ["South Station", "Airport Terminal"],
  },
]

export function StaffTable() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter staff based on search term
  const filteredStaff = staffData.filter(
    (staff) =>
      staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.team.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/admin/company/staff/new">
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Locations</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.fullName}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.team}</TableCell>
                  <TableCell>
                    <Badge variant={staff.active ? "default" : "secondary"}>
                      {staff.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {staff.locations.map((location) => (
                        <Badge key={location} variant="outline">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/company/staff/${staff.id}/view`}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/company/staff/${staff.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No staff found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
