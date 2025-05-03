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

export function AdditionalOptionsTable() {
  const router = useRouter()
  const [options, setOptions] = useState([
    {
      id: "1",
      code: "GPS",
      description: "GPS Navigation System",
      optionType: "Equipment",
      calculationType: "Daily",
      excessWeight: 2,
      active: true,
      mandatorySurcharge: false,
    },
    {
      id: "2",
      code: "WIFI",
      description: "Mobile WiFi Hotspot",
      optionType: "Equipment",
      calculationType: "Daily",
      excessWeight: 1,
      active: true,
      mandatorySurcharge: false,
    },
    {
      id: "3",
      code: "CSEAT",
      description: "Child Safety Seat",
      optionType: "Equipment",
      calculationType: "Rental",
      excessWeight: 5,
      active: true,
      mandatorySurcharge: false,
    },
    {
      id: "4",
      code: "INSUR",
      description: "Additional Insurance",
      optionType: "Insurance",
      calculationType: "Daily",
      excessWeight: 0,
      active: true,
      mandatorySurcharge: true,
    },
    {
      id: "5",
      code: "ROADSIDE",
      description: "Roadside Assistance",
      optionType: "Service",
      calculationType: "Rental",
      excessWeight: 0,
      active: false,
      mandatorySurcharge: false,
    },
  ])

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [optionToDelete, setOptionToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!optionToDelete) return

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the option from the state
      setOptions(options.filter((option) => option.id !== optionToDelete.id))

      toast({
        title: "Option deleted",
        description: `Option ${optionToDelete.code} has been deleted successfully.`,
      })
    } catch (error) {
      console.error("Error deleting option:", error)
      toast({
        title: "Error",
        description: "Failed to delete option. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setOptionToDelete(null)
      router.refresh()
    }
  }

  const openDeleteDialog = (option: any) => {
    setOptionToDelete(option)
    setDeleteDialogOpen(true)
  }

  const toggleOptionStatus = async (optionId: string, currentStatus: boolean) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the option status in the state
      setOptions(options.map((option) => (option.id === optionId ? { ...option, active: !currentStatus } : option)))

      toast({
        title: "Status updated",
        description: `Option status has been ${!currentStatus ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      console.error("Error updating option status:", error)
      toast({
        title: "Error",
        description: "Failed to update option status. Please try again.",
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
              <TableHead>Option Type</TableHead>
              <TableHead>Calculation Type</TableHead>
              <TableHead>Mandatory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-medium">{option.code}</TableCell>
                <TableCell>{option.description}</TableCell>
                <TableCell>{option.optionType}</TableCell>
                <TableCell>{option.calculationType}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      option.mandatorySurcharge ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {option.mandatorySurcharge ? "Yes" : "No"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`px-2 py-1 rounded-full text-xs ${
                      option.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                    onClick={() => toggleOptionStatus(option.id, option.active)}
                  >
                    {option.active ? "Active" : "Inactive"}
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
                        <Link href={`/admin/company/finance/additional-options/${option.id}/view`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/company/finance/additional-options/${option.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(option)}>
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
              This will permanently delete the option <span className="font-semibold">{optionToDelete?.code}</span>.
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
