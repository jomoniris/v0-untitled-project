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
import { deleteLocation, toggleLocationStatus, type Location } from "@/app/actions/location-actions"

interface LocationsTableProps {
  locations: Location[]
  loading: boolean
  error: string | null
  onLocationDeleted: (locationId: string) => void
  onLocationStatusChanged: (locationId: string, newStatus: boolean) => void
}

export function LocationsTable({
  locations,
  loading,
  error,
  onLocationDeleted,
  onLocationStatusChanged,
}: LocationsTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!locationToDelete) return

    setIsDeleting(true)

    try {
      const result = await deleteLocation(locationToDelete.id)

      if (result.success) {
        // Notify parent component about the deletion
        onLocationDeleted(locationToDelete.id)

        toast({
          title: "Location deleted",
          description: `Location ${locationToDelete.name} has been deleted successfully.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete location. Please try again.",
          variant: "destructive",
        })
      }
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

  const openDeleteDialog = (location: Location) => {
    setLocationToDelete(location)
    setDeleteDialogOpen(true)
  }

  const toggleLocationStatusHandler = async (locationId: string, currentStatus: boolean) => {
    try {
      const result = await toggleLocationStatus(locationId, currentStatus)

      if (result.success) {
        // Notify parent component about the status change
        onLocationStatusChanged(locationId, !currentStatus)

        toast({
          title: "Status updated",
          description: `Location status has been ${!currentStatus ? "activated" : "deactivated"}.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update location status. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating location status:", error)
      toast({
        title: "Error",
        description: "Failed to update location status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading locations...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>
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
            {locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No locations found. Create your first location.
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => (
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
                      onClick={() => toggleLocationStatusHandler(location.id, location.active)}
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
              ))
            )}
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

export default LocationsTable
