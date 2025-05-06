import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface CarGroupRate {
  id: string
  carGroupId: string
  carGroupName: string
  dailyRate: number
  weeklyRate: number
  monthlyRate: number
}

interface AdditionalOption {
  id: string
  additionalOptionId: string
  optionName: string
  price: number
}

interface RentalRate {
  id: string
  rateId: string
  rateName: string
  pickupStartDate: string
  pickupEndDate: string
  rateZone: string
  rateZoneId: string
  bookingStartDate: string
  bookingEndDate: string
  active: boolean
  carGroupRates?: CarGroupRate[]
  additionalOptions?: AdditionalOption[]
}

interface RentalRatesTableProps {
  rates: RentalRate[] | null
}

export function RentalRatesTable({ rates }: RentalRatesTableProps) {
  // Ensure rates is always an array
  const ratesArray = Array.isArray(rates) ? rates : []

  if (ratesArray.length === 0) {
    return (
      <div className="text-center p-4">
        <p>No rental rates found.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rate Name</TableHead>
            <TableHead>Rate Zone</TableHead>
            <TableHead>Pickup Period</TableHead>
            <TableHead>Booking Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratesArray.map((rate) => (
            <TableRow key={rate.id}>
              <TableCell className="font-medium">{rate.rateName}</TableCell>
              <TableCell>{rate.rateZone || "N/A"}</TableCell>
              <TableCell>
                {formatDate(rate.pickupStartDate)} - {formatDate(rate.pickupEndDate)}
              </TableCell>
              <TableCell>
                {formatDate(rate.bookingStartDate)} - {formatDate(rate.bookingEndDate)}
              </TableCell>
              <TableCell>
                <Badge variant={rate.active ? "success" : "destructive"}>{rate.active ? "Active" : "Inactive"}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/rate-and-policies/rental-rates/${rate.id}/view`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/rate-and-policies/rental-rates/${rate.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
