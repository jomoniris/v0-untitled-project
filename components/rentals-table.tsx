"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { MoreHorizontal, Search, Eye, Edit, Check, X, Calendar } from "lucide-react"
import { format } from "date-fns"

export function RentalsTable() {
  const router = useRouter()
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("")
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetchRentals()
    fetchLocations()
  }, [statusFilter, locationFilter])

  const fetchRentals = async () => {
    setLoading(true)
    try {
      let url = "/api/rentals?"

      if (statusFilter && statusFilter !== "all") {
        url += `status=${statusFilter}&`
      }

      if (locationFilter) {
        url += `locationId=${locationFilter}&`
      }

      const response = await fetch(url)
      const data = await response.json()
      setRentals(data)
    } catch (error) {
      console.error("Error fetching rentals:", error)
      toast({
        title: "Error",
        description: "Failed to load rentals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/locations")
      const data = await response.json()
      setLocations(data)
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const handleStatusChange = async (rentalId, newStatus) => {
    try {
      const response = await fetch(`/api/rentals/${rentalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to update rental status to ${newStatus}`)
      }

      toast({
        title: "Success",
        description: `Rental status updated to ${newStatus.toLowerCase()}`,
      })

      fetchRentals()
    } catch (error) {
      console.error("Error updating rental status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update rental status",
        variant: "destructive",
      })
    }
  }

  const filteredRentals = rentals.filter((rental) => {
    const searchMatch =
      rental.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle?.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())

    return searchMatch
  })

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "RESERVED":
        return "outline"
      case "ACTIVE":
        return "default"
      case "COMPLETED":
        return "success"
      case "CANCELLED":
        return "destructive"
      case "EXTENDED":
        return "warning"
      case "OVERDUE":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case "PAID":
        return "success"
      case "PENDING":
        return "warning"
      case "PARTIALLY_PAID":
        return "default"
      case "REFUNDED":
        return "secondary"
      case "FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rentals..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Clear
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="RESERVED">Reserved</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="EXTENDED">Extended</SelectItem>
              <SelectItem value="OVERDUE">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button asChild>
            <Link href="/admin/rentals/new">
              <Calendar className="mr-2 h-4 w-4" />
              New Rental
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Rentals</CardTitle>
          <CardDescription>Manage all rental bookings</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No rentals found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <div className="font-medium">
                          {rental.customer?.firstName} {rental.customer?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{rental.customer?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {rental.vehicle?.make} {rental.vehicle?.model}
                        </div>
                        <div className="text-sm text-muted-foreground">{rental.vehicle?.licensePlate}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(rental.startDate), "MMM d, yyyy")} -
                          {format(new Date(rental.endDate), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {rental.pickupLocation?.name} → {rental.returnLocation?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(rental.status)}>{rental.status.replace(/_/g, " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentStatusBadgeVariant(rental.paymentStatus)}>
                          {rental.paymentStatus.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>${rental.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/rentals/${rental.id}/view`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/rentals/${rental.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {rental.status === "RESERVED" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "ACTIVE")}>
                                <Check className="mr-2 h-4 w-4" />
                                Start Rental
                              </DropdownMenuItem>
                            )}
                            {(rental.status === "ACTIVE" || rental.status === "EXTENDED") && (
                              <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "COMPLETED")}>
                                <Check className="mr-2 h-4 w-4" />
                                Complete Rental
                              </DropdownMenuItem>
                            )}
                            {rental.status === "RESERVED" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(rental.id, "CANCELLED")}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel Rental
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
