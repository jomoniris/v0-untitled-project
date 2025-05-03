"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function LocationsTable() {
  const router = useRouter()
  const [locations, setLocations] = useState([
    {
      id: "1",
      code: "NYC-DT",
      name: "Downtown Office",
      stationType: "Full Service",
      metroplex: "New York",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      operatingHours: "8:00 AM - 8:00 PM",
      active: true,
    },
    {
      id: "2",
      code: "NYC-AP",
      name: "Airport Terminal",
      stationType: "Express",
      metroplex: "New York",
      address: "JFK Airport, Terminal 4",
      city: "New York",
      state: "NY",
      postalCode: "11430",
      country: "USA",
      operatingHours: "24/7",
      active: true,
    },
    {
      id: "3",
      code: "NYC-MT",
      name: "Midtown Branch",
      stationType: "Full Service",
      metroplex: "New York",
      address: "456 Park Ave",
      city: "New York",
      state: "NY",
      postalCode: "10022",
      country: "USA",
      operatingHours: "9:00 AM - 7:00 PM",
      active: false,
    },
    {
      id: "4",
      code: "LA-DT",
      name: "LA Downtown",
      stationType: "Full Service",
      metroplex: "Los Angeles",
      address: "789 Grand Ave",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90017",
      country: "USA",
      operatingHours: "8:00 AM - 6:00 PM",
      active: true,
    },
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!locationToDelete) return

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the location from the state
      setLocations(locations.filter((location) => location.id !== locationToDelete.id))

      toast({
        title: "Location deleted",
        description: `Location ${locationToDelete.name} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting location:", error)
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setLocationToDelete(null)
      router.refresh()
    }
  }

  const openDeleteDialog = (location: any) => {
    setLocationToDelete(location)
    setDeleteDialogOpen(true)
  }

  const toggleLocationStatus = async (locationId: string, currentStatus: boolean) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the location status in the state
      setLocations(
        locations.map((location) => (location.id === locationId ? { ...location, active: !currentStatus } : location)),
      )

      toast({
        title: "Status updated",
        description: `Location status has been ${!currentStatus ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      console.error("Error updating location status:", error)
      toast({
        title: "Error",
        description: "Failed to update location status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Station Type</TableHead>
              <TableHead>Metroplex</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.code}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.stationType}</TableCell>
                <TableCell>{location.metroplex}</TableCell>
                <TableCell>
                  {location.address}, {location.city}, {location.state} {location.postalCode}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 py-1 rounded-full text-xs ${
                      location.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                    onClick={() => toggleLocationStatus(location.id, location.active)}
                  >
                    {location.active ? "Active" : "Inactive"}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/company/locations/${location.id}/view`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/company/locations/${location.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(location)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the location <span className="font-semibold">{locationToDelete?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
