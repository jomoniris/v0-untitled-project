import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RentalsTable() {
  const rentals = [
    {
      id: "RNT-1234",
      customer: "John Smith",
      vehicle: "Tesla Model 3",
      startDate: "Apr 24, 2023",
      endDate: "Apr 28, 2023",
      amount: "$356",
      status: "Active",
    },
    {
      id: "RNT-1235",
      customer: "Sarah Johnson",
      vehicle: "BMW X5",
      startDate: "Apr 23, 2023",
      endDate: "Apr 30, 2023",
      amount: "$455",
      status: "Active",
    },
    {
      id: "RNT-1236",
      customer: "Michael Brown",
      vehicle: "Toyota Camry",
      startDate: "Apr 22, 2023",
      endDate: "Apr 25, 2023",
      amount: "$135",
      status: "Completed",
    },
    {
      id: "RNT-1237",
      customer: "Emily Davis",
      vehicle: "Honda Civic",
      startDate: "Apr 25, 2023",
      endDate: "Apr 29, 2023",
      amount: "$180",
      status: "Pending",
    },
    {
      id: "RNT-1238",
      customer: "David Wilson",
      vehicle: "Ford Mustang",
      startDate: "Apr 26, 2023",
      endDate: "Apr 30, 2023",
      amount: "$380",
      status: "Pending",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell className="font-medium">{rental.id}</TableCell>
              <TableCell>{rental.customer}</TableCell>
              <TableCell>{rental.vehicle}</TableCell>
              <TableCell>
                {rental.startDate} - {rental.endDate}
              </TableCell>
              <TableCell>{rental.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    rental.status === "Active" ? "default" : rental.status === "Completed" ? "secondary" : "outline"
                  }
                >
                  {rental.status}
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
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Rental</DropdownMenuItem>
                    <DropdownMenuItem>Print Invoice</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
