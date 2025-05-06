"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2, Eye, Copy } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { deleteRentalRate, duplicateRentalRate, toggleRentalRateStatus } from "@/app/actions/rental-rate-actions"

interface RentalRatesTableProps {
  rates: any[]
}

export function RentalRatesTable({ rates = [] }: RentalRatesTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rateToDelete, setRateToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDelete = async () => {
    if (!rateToDelete) return

    setIsDeleting(true)

    try {
      const result = await deleteRentalRate(rateToDelete.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Rate deleted",
          description: result.message,
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting rate:", error)
      toast({
        title: "Error",
        description: "Failed to delete rate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setRateToDelete(null)
    }
  }

  const openDeleteDialog = (rate: any) => {
    setRateToDelete(rate)
    setDeleteDialogOpen(true)
  }

  const handleToggleRateStatus = async (rateId: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    try {
      const result = await toggleRentalRateStatus(rateId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Status updated",
          description: result.message,
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating rate status:", error)
      toast({
        title: "Error",
        description: "Failed to update rate status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDuplicateRate = async (rate: any) => {
    if (isProcessing) return

    setIsProcessing(true)
    try {
      const result = await duplicateRentalRate(rate.id)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Rate duplicated",
          description: result.message,
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Error duplicating rate:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate rate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!rates || rates.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md">
        <p className="text-muted-foreground">No rental rates found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rate Name</TableHead>
              <TableHead>Pickup Period</TableHead>
              <TableHead>Booking Period</TableHead>
              <TableHead>Rate Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.rateName}</TableCell>
                <TableCell>
                  {new Date(rate.pickupStartDate).toLocaleDateString()} -{" "}
                  {new Date(rate.pickupEndDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(rate.bookingStartDate).toLocaleDateString()} -{" "}
                  {new Date(rate.bookingEndDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{rate.rateZone || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={rate.active ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleRateStatus(rate.id)}
                  >
                    {rate.active ? "Active" : "Inactive"}
                  </Badge>
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
                        <Link href={`/admin/rate-and-policies/rental-rates/${rate.id}/view`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/rate-and-policies/rental-rates/${rate.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateRate(rate)} disabled={isProcessing}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => openDeleteDialog(rate)}
                        disabled={isProcessing}
                      >
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
              This will permanently delete the rate <span className="font-semibold">{rateToDelete?.rateName}</span>.
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
