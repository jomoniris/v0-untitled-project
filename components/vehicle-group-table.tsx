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
import Image from "next/image"

export function VehicleGroupTable() {
  const router = useRouter()
  const [groups, setGroups] = useState([
    {
      id: "1",
      code: "ECON",
      description: "Economy",
      sipCode: "ECAR",
      class: "Economy",
      autoAllocate: true,
      fuelType: "Petrol",
      tankCapacity: 45,
      doors: 4,
      suitcases: 1,
      pax: 5,
      bags: 1,
      minAge: 21,
      youngDriverLimit: 25,
      maxAgeLimit: 75,
      drivingYears: 2,
      seniorLimit: 70,
      image: "/urban-civic-night.png",
    },
    {
      id: "2",
      code: "COMP",
      description: "Compact",
      sipCode: "CCAR",
      class: "Compact",
      autoAllocate: true,
      fuelType: "Petrol",
      tankCapacity: 50,
      doors: 4,
      suitcases: 2,
      pax: 5,
      bags: 2,
      minAge: 21,
      youngDriverLimit: 25,
      maxAgeLimit: 75,
      drivingYears: 2,
      seniorLimit: 70,
      image: "/urban-rav4-adventure.png",
    },
    {
      id: "3",
      code: "PREM",
      description: "Premium",
      sipCode: "PCAR",
      class: "Premium",
      autoAllocate: false,
      fuelType: "Petrol",
      tankCapacity: 60,
      doors: 4,
      suitcases: 3,
      pax: 5,
      bags: 2,
      minAge: 25,
      youngDriverLimit: 30,
      maxAgeLimit: 75,
      drivingYears: 3,
      seniorLimit: 70,
      image: "/sleek-bmw-cityscape.png",
    },
    {
      id: "4",
      code: "LUXE",
      description: "Luxury",
      sipCode: "LCAR",
      class: "Luxury",
      autoAllocate: false,
      fuelType: "Petrol",
      tankCapacity: 70,
      doors: 4,
      suitcases: 4,
      pax: 5,
      bags: 3,
      minAge: 25,
      youngDriverLimit: 30,
      maxAgeLimit: 75,
      drivingYears: 5,
      seniorLimit: 70,
      image: "/sleek-electric-sedan.png",
    },
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!groupToDelete) return

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the group from the state
      setGroups(groups.filter((group) => group.id !== groupToDelete.id))

      toast({
        title: "Vehicle group deleted",
        description: `Vehicle group ${groupToDelete.code} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting vehicle group:", error)
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

  const openDeleteDialog = (group: any) => {
    setGroupToDelete(group)
    setDeleteDialogOpen(true)
  }

  return (
    <>
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
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 overflow-hidden rounded">
                      <Image
                        src={group.image || "/placeholder.svg"}
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
                <TableCell>{group.class}</TableCell>
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
            ))}
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
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
