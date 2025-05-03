"use client"

import React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2, Eye, Copy, ChevronDown, ChevronUp } from "lucide-react"
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

export function RentalRatesTable() {
  const router = useRouter()
  // Update the mock data to include policy values
  const [rates, setRates] = useState([
    {
      id: "1",
      rateName: "Summer 2023 Special",
      pickupStartDate: "2023-06-01",
      pickupEndDate: "2023-09-30",
      rateZone: "NYC-DOWNTOWN",
      bookingStartDate: "2023-05-01",
      bookingEndDate: "2023-09-15",
      active: true,
      carGroupRates: [
        {
          groupId: "1",
          groupName: "Economy",
          milesPerDay: 150,
          milesRate: 0.25,
          depositRateCDW: 500,
          excessPoliciesCDW: "Standard",
          policyValueCDW: "Covers damage up to $1000",
          depositRatePAI: 300,
          excessPoliciesPAI: "Standard",
          policyValuePAI: "Personal accident coverage",
          depositRateSCDW: 200,
          excessPoliciesSCDW: "Premium",
          policyValueSCDW: "Super collision damage waiver",
          depositRateCPP: 100,
          excessPoliciesCPP: "Basic",
          policyValueCPP: "Personal property protection",
          deliveryCharges: 50,
          dayRates: [
            45, 43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23, 21, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
            18, 18, 18,
          ],
          included: true,
        },
        {
          groupId: "2",
          groupName: "Compact",
          milesPerDay: 200,
          milesRate: 0.2,
          depositRateCDW: 600,
          excessPoliciesCDW: "Premium",
          policyValueCDW: "Premium coverage with $500 deductible",
          depositRatePAI: 350,
          excessPoliciesPAI: "Standard",
          policyValuePAI: "Standard personal accident coverage",
          depositRateSCDW: 250,
          excessPoliciesSCDW: "Premium",
          policyValueSCDW: "Full super collision coverage",
          depositRateCPP: 120,
          excessPoliciesCPP: "Standard",
          policyValueCPP: "Standard property protection",
          deliveryCharges: 60,
          dayRates: [
            55, 53, 51, 49, 47, 45, 43, 41, 39, 37, 35, 33, 31, 29, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
            28, 28, 28,
          ],
          included: true,
        },
        {
          groupId: "6",
          groupName: "Premium",
          milesPerDay: 250,
          milesRate: 0.18,
          depositRateCDW: 800,
          excessPoliciesCDW: "Premium",
          policyValueCDW: "Premium coverage with no deductible",
          depositRatePAI: 450,
          excessPoliciesPAI: "Premium",
          policyValuePAI: "Premium personal accident coverage",
          depositRateSCDW: 350,
          excessPoliciesSCDW: "Premium",
          policyValueSCDW: "Premium super collision coverage",
          depositRateCPP: 150,
          excessPoliciesCPP: "Premium",
          policyValueCPP: "Premium property protection",
          deliveryCharges: 75,
          dayRates: [
            85, 83, 81, 79, 77, 75, 73, 71, 69, 67, 65, 63, 61, 59, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58, 58,
            58, 58, 58,
          ],
          included: true,
        },
      ],
    },
    {
      id: "2",
      rateName: "Winter 2023 Promotion",
      pickupStartDate: "2023-12-01",
      pickupEndDate: "2024-02-28",
      rateZone: "NYC-MIDTOWN",
      bookingStartDate: "2023-11-01",
      bookingEndDate: "2024-02-15",
      active: true,
      carGroupRates: [
        {
          groupId: "1",
          groupName: "Economy",
          milesPerDay: 120,
          milesRate: 0.3,
          depositRateCDW: 450,
          excessPoliciesCDW: "Standard",
          policyValueCDW: "Winter coverage with $750 deductible",
          depositRatePAI: 250,
          excessPoliciesPAI: "Standard",
          policyValuePAI: "Winter personal accident coverage",
          depositRateSCDW: 180,
          excessPoliciesSCDW: "Standard",
          policyValueSCDW: "Winter super collision coverage",
          depositRateCPP: 90,
          excessPoliciesCPP: "Basic",
          policyValueCPP: "Basic winter property protection",
          deliveryCharges: 45,
          dayRates: [
            40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
            15, 15, 15,
          ],
          included: true,
        },
        {
          groupId: "8",
          groupName: "SUV",
          milesPerDay: 180,
          milesRate: 0.25,
          depositRateCDW: 700,
          excessPoliciesCDW: "Premium",
          policyValueCDW: "Premium winter coverage for SUVs",
          depositRatePAI: 400,
          excessPoliciesPAI: "Premium",
          policyValuePAI: "Premium winter personal coverage",
          depositRateSCDW: 300,
          excessPoliciesSCDW: "Premium",
          policyValueSCDW: "Premium winter collision coverage",
          depositRateCPP: 130,
          excessPoliciesCPP: "Standard",
          policyValueCPP: "Standard winter property protection",
          deliveryCharges: 65,
          dayRates: [
            95, 93, 91, 89, 87, 85, 83, 81, 79, 77, 75, 73, 71, 69, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68, 68,
            68, 68, 68,
          ],
          included: true,
        },
      ],
    },
  ])

  const [expandedRates, setExpandedRates] = useState<Record<string, boolean>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rateToDelete, setRateToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the rate from the state
      setRates(rates.filter((rate) => rate.id !== rateToDelete.id))

      toast({
        title: "Rate deleted",
        description: `Rate "${rateToDelete.rateName}" has been deleted successfully.`,
      })
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
      router.refresh()
    }
  }

  const openDeleteDialog = (rate: any) => {
    setRateToDelete(rate)
    setDeleteDialogOpen(true)
  }

  const toggleRateStatus = async (rateId: string, currentStatus: boolean) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the rate status in the state
      setRates(rates.map((rate) => (rate.id === rateId ? { ...rate, active: !currentStatus } : rate)))

      toast({
        title: "Status updated",
        description: `Rate status has been ${!currentStatus ? "activated" : "deactivated"}.`,
      })
    } catch (error) {
      console.error("Error updating rate status:", error)
      toast({
        title: "Error",
        description: "Failed to update rate status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const duplicateRate = async (rate: any) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create a duplicate with a new ID
      const newRate = {
        ...rate,
        id: `${Number.parseInt(rate.id) + 100}`, // Just a simple way to create a new ID
        rateName: `${rate.rateName} (Copy)`,
      }

      // Add the new rate to the state
      setRates([...rates, newRate])

      toast({
        title: "Rate duplicated",
        description: `Rate "${rate.rateName}" has been duplicated successfully.`,
      })
    } catch (error) {
      console.error("Error duplicating rate:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate rate. Please try again.",
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
              <TableHead></TableHead>
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
              <React.Fragment key={rate.id}>
                <TableRow>
                  <TableCell>
                    <Button type="button" variant="ghost" size="sm" onClick={() => toggleRateExpanded(rate.id)}>
                      {expandedRates[rate.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{rate.rateName}</TableCell>
                  <TableCell>
                    {new Date(rate.pickupStartDate).toLocaleDateString()} -{" "}
                    {new Date(rate.pickupEndDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(rate.bookingStartDate).toLocaleDateString()} -{" "}
                    {new Date(rate.bookingEndDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{rate.rateZone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={rate.active ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleRateStatus(rate.id, rate.active)}
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
                        <DropdownMenuItem onClick={() => duplicateRate(rate)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(rate)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {/* Expanded car group rates */}
                {expandedRates[rate.id] && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Car Group Rates</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Car Group</TableHead>
                              <TableHead>Miles/Day</TableHead>
                              <TableHead>Miles Rate</TableHead>
                              <TableHead>Day 1 Rate</TableHead>
                              <TableHead>Delivery</TableHead>
                              <TableHead>CDW Deposit</TableHead>
                              <TableHead>PAI Deposit</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rate.carGroupRates
                              .filter((group) => group.included)
                              .map((carGroup) => (
                                <TableRow key={carGroup.groupId}>
                                  <TableCell className="font-medium">{carGroup.groupName}</TableCell>
                                  <TableCell>{carGroup.milesPerDay}</TableCell>
                                  <TableCell>${carGroup.milesRate.toFixed(2)}</TableCell>
                                  <TableCell>${carGroup.dayRates[0].toFixed(2)}</TableCell>
                                  <TableCell>${carGroup.deliveryCharges.toFixed(2)}</TableCell>
                                  <TableCell>${carGroup.depositRateCDW.toFixed(2)}</TableCell>
                                  <TableCell>${carGroup.depositRatePAI.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
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
