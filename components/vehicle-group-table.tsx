"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteVehicleGroup } from "@/app/actions/vehicle-group-actions"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function VehicleGroupTable({ initialGroups = [] }) {
  const router = useRouter()
  const [groups, setGroups] = useState(initialGroups)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (!groups || groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Vehicle Groups Found</CardTitle>
          <CardDescription>
            There are no vehicle groups in the database. Create your first vehicle group to get started.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/admin/company/fleet/vehicle-group/new">Create Vehicle Group</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    setDeleteId(id)

    try {
      const { error } = await deleteVehicleGroup(id)

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        return
      }

      // Remove the deleted group from the state
      setGroups(groups.filter((group) => group.id !== id))

      toast({
        title: "Vehicle group deleted",
        description: "The vehicle group has been deleted successfully.",
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
      setDeleteId(null)
      setIsDialogOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Groups</CardTitle>
        <CardDescription>Manage your vehicle groups and their specifications</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Passengers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.code}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell className="capitalize">{group.class}</TableCell>
                <TableCell>{group.pax}</TableCell>
                <TableCell>
                  <Badge variant={group.active ? "default" : "secondary"}>{group.active ? "Active" : "Inactive"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/company/fleet/vehicle-group/${group.id}/view`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/admin/company/fleet/vehicle-group/${group.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Dialog
                      open={isDialogOpen && deleteId === group.id}
                      onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (open) setDeleteId(group.id)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Vehicle Group</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this vehicle group? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(group.id)}
                            disabled={isDeleting && deleteId === group.id}
                          >
                            {isDeleting && deleteId === group.id ? "Deleting..." : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
