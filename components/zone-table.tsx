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
import { useState, useEffect } from "react"
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
import { getZones, deleteZone, toggleZoneStatus, type Zone } from "@/app/actions/zone-actions"

export function ZoneTable() {
  const router = useRouter()
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [zoneToDelete, setZoneToDelete] = useState<Zone | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    async function loadZones() {
      setLoading(true)
      const { zones, error } = await getZones()
      if (error) {
        setError(error)
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else {
        setZones(zones)
      }
      setLoading(false)
    }

    loadZones()
  }, [])

  const handleDelete = async () => {
    if (!zoneToDelete) return

    setIsDeleting(true)

    try {
      const { error } = await deleteZone(zoneToDelete.id)

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else {
        // Remove the zone from the state
        setZones(zones.filter((zone) => zone.id !== zoneToDelete.id))

        toast({
          title: "Zone deleted",
          description: `Zone ${zoneToDelete.code} has been deleted successfully.`,
        })
      }
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

  const openDeleteDialog = (zone: Zone) => {
    setZoneToDelete(zone)
    setDeleteDialogOpen(true)
  }

  const handleToggleStatus = async (zoneId: string, currentStatus: boolean) => {
    try {
      const { error } = await toggleZoneStatus(zoneId, currentStatus)

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
      } else {
        // Update the zone status in the state
        setZones(zones.map((zone) => (zone.id === zoneId ? { ...zone, active: !currentStatus } : zone)))

        toast({
          title: "Status updated",
          description: `Zone status has been ${!currentStatus ? "activated" : "deactivated"}.`,
        })
      }
    } catch (error) {
      console.error("Error updating zone status:", error)
      toast({
        title: "Error",
        description: "Failed to update zone status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading zones...</div>
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
              <TableHead>Description</TableHead>
              <TableHead>Belongs To</TableHead>
              <TableHead>Time Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No zones found. Create your first zone.
                </TableCell>
              </TableRow>
            ) : (
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.code}</TableCell>
                  <TableCell>{zone.description}</TableCell>
                  <TableCell>{zone.belongsTo || "None"}</TableCell>
                  <TableCell>{zone.timeZone}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`px-2 py-1 rounded-full text-xs ${
                        zone.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                      onClick={() => handleToggleStatus(zone.id, zone.active)}
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
