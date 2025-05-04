"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2, Eye, Loader2 } from "lucide-react"
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
import Image from "next/image"
import { type VehicleGroup, deleteVehicleGroup } from "@/app/actions/vehicle-group-actions"

interface VehicleGroupTableProps {
  initialGroups: VehicleGroup[]
}

export function VehicleGroupTable({ initialGroups }: VehicleGroupTableProps) {
  const router = useRouter()
  const [groups, setGroups] = useState<VehicleGroup[]>(initialGroups)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<VehicleGroup | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!groupToDelete) return

    setIsDeleting(true)
    setError(null)

    try {
      const { error } = await deleteVehicleGroup(groupToDelete.id)

      if (error) {
        setError(error)
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        return
      }

      // Remove the group from the state
      setGroups(groups.filter((group) => group.id !== groupToDelete.id))

      toast({
        title: "Vehicle group deleted",
        description: `Vehicle group ${groupToDelete.code} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting vehicle group:", error)
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "Failed to delete vehicle group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setGroupToDelete(null)
      router.refresh()
    }
  }

  const openDeleteDialog = (group: VehicleGroup) => {
    setGroupToDelete(group)
    setDeleteDialogOpen(true)
  }

  // Function to get the display name for class
  const getClassDisplayName = (classValue: string) => {
    const classMap: Record<string, string> = {
      economy: "Economy",
      compact: "Compact",
      midsize: "Midsize",
      standard: "Standard",
      fullsize: "Full Size",
      premium: "Premium",
      luxury: "Luxury",
      suv: "SUV",
      van: "Van",
    }
    return classMap[classValue.toLowerCase()] || classValue
  }

  return (
    <>
      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">{error}</div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Group</TableHead>
              <TableHead>SIP Code</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Age Limits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No vehicle groups found.
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 overflow-hidden rounded">
                        <Image
                          src={group.imagePath || "/placeholder.svg"}
                          alt={group.description}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{group.description}</div>
                        <div className="text-xs text-muted-foreground">{group.code}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{group.sipCode}</TableCell>
                  <TableCell>{getClassDisplayName(group.class)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>
                        {group.doors} doors, {group.pax} passengers
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {group.suitcases} suitcase(s), {group.bags} bag(s)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Min: {group.minAge} years</div>
                      <div className="text-xs text-muted-foreground">Max: {group.maxAgeLimit} years</div>
                    </div>
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
                          <Link href={`/admin/company/fleet/vehicle-group/${group.id}/view`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/company/fleet/vehicle-group/${group.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(group)}>
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
              This will permanently delete the vehicle group{" "}
              <span className="font-semibold">{groupToDelete?.code}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
