"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
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

export function ZoneTable() {
  const router = useRouter()
  const [zones, setZones] = useState([
    {
      id: "1",
      code: "NYC-DOWNTOWN",
      description: "New York City Downtown Area",
      belongsTo: "New York City",
      timeZone: "Eastern Time (ET)",
      active: true,
    },
    {
      id: "2",
      code: "NYC-MIDTOWN",
      description: "New York City Midtown Area",
      belongsTo: "New York City",
      timeZone: "Eastern Time (ET)",
      active: true,
    },
    {
      id: "3",
      code: "NYC-AIRPORT",
      description: "New York City Airport Zone",
      belongsTo: "New York City",
      timeZone: "Eastern Time (ET)",
      active: true,
    },
    {
      id: "4",
      code: "LA-DOWNTOWN",
      description: "Los Angeles Downtown Area",
      belongsTo: "Los Angeles",
      timeZone: "Pacific Time (PT)",
      active: false,
    },
    {
      id: "5",
      code: "CHI-NORTH",
      description: "Chicago North Side",
      belongsTo: "Chicago",
      timeZone: "Central Time (CT)",
      active: true,
    },
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [zoneToDelete, setZoneToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!zoneToDelete) return

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the zone from the state
      setZones(zones.filter((zone) => zone.id !== zoneToDelete.id))

      toast({
        title: "Zone deleted",
        description: `Zone ${zoneToDelete.code} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting zone:", error)
      toast({
        title: "Error",
        description: "Failed to delete zone. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setZoneToDelete(null)
      router.refresh()
    }
  }

  const openDeleteDialog = (zone: any) => {
    setZoneToDelete(zone)
    setDeleteDialogOpen(true)
  }

  const toggleZoneStatus = async (zoneId: string, currentStatus: boolean) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the zone status in the state
      setZones(zones.map((zone) => (zone.id === zoneId ? { ...zone, active: !currentStatus } : zone)))

      toast({
        title: "Status updated",
        description: `Zone status has been ${!currentStatus ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      console.error("Error updating zone status:", error)
      toast({
        title: "Error",
        description: "Failed to update zone status. Please try again.",
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
              <TableHead>Description</TableHead>
              <TableHead>Belongs To</TableHead>
              <TableHead>Time Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell className="font-medium">{zone.code}</TableCell>
                <TableCell>{zone.description}</TableCell>
                <TableCell>{zone.belongsTo}</TableCell>
                <TableCell>{zone.timeZone}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 py-1 rounded-full text-xs ${
                      zone.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                    onClick={() => toggleZoneStatus(zone.id, zone.active)}
                  >
                    {zone.active ? "Active" : "Inactive"}
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
                        <Link href={`/admin/company/locations/zone/${zone.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(zone)}>
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
              This will permanently delete the zone <span className="font-semibold">{zoneToDelete?.code}</span>. This
              action cannot be undone.
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
