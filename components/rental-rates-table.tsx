"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Eye } from "lucide-react"
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

interface RentalRate {
  id: string
  rateId: string
  rateName: string
  pickupStartDate: string
  pickupEndDate: string
  rateZone: string
  bookingStartDate: string
  bookingEndDate: string
  active: boolean
  carGroupRates?: any[]
}

interface RentalRatesTableProps {
  rates: RentalRate[]
}

export function RentalRatesTable({ rates = [] }: RentalRatesTableProps) {
  const router = useRouter()
  const [expandedRates, setExpandedRates] = useState<Record<string, boolean>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rateToDelete, setRateToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  console.log("Rendering RentalRatesTable with rates:", rates)

  // Ensure rates is an array
  const ratesArray = Array.isArray(rates) ? rates : []

  const toggleRateExpanded = (rateId: string) => {
    setExpandedRates((prev) => ({
      ...prev,
      [rateId]: !prev[rateId],
    }))
  }

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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return dateString
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rate ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Pickup Period</TableHead>
              <TableHead>Rate Zone</TableHead>
              <TableHead>Booking Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratesArray.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No rates found.
                </TableCell>
              </TableRow>
            ) : (
              ratesArray.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.rateId || "N/A"}</TableCell>
                  <TableCell>{rate.rateName || "N/A"}</TableCell>
                  <TableCell>
                    {formatDate(rate.pickupStartDate)} - {formatDate(rate.pickupEndDate)}
                  </TableCell>
                  <TableCell>{rate.rateZone || "N/A"}</TableCell>
                  <TableCell>
                    {formatDate(rate.bookingStartDate)} - {formatDate(rate.bookingEndDate)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={rate.active ? "default" : "secondary"}>{rate.active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/rate-and-policies/rental-rates/${rate.id}/view`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/rate-and-policies/rental-rates/${rate.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
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
