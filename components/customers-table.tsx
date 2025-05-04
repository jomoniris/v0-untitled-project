import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CustomersTable() {
  const customers = [
    {
      id: "CUST-001",
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      rentals: 3,
      joinDate: "Jan 15, 2023",
      avatar: "/diverse-group-city.png",
    },
    {
      id: "CUST-002",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 234-5678",
      rentals: 5,
      joinDate: "Feb 22, 2023",
      avatar: "/contemplative-artist.png",
    },
    {
      id: "CUST-003",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 (555) 345-6789",
      rentals: 2,
      joinDate: "Mar 10, 2023",
      avatar: "/contemplative-man.png",
    },
    {
      id: "CUST-004",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (555) 456-7890",
      rentals: 1,
      joinDate: "Apr 5, 2023",
      avatar: "/thoughtful-reader.png",
    },
    {
      id: "CUST-005",
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1 (555) 567-8901",
      rentals: 4,
      joinDate: "Dec 12, 2022",
      avatar: "/thoughtful-bearded-man.png",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Rentals</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">{customer.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>{customer.email}</div>
                <div className="text-xs text-muted-foreground">{customer.phone}</div>
              </TableCell>
              <TableCell>{customer.rentals}</TableCell>
              <TableCell>{customer.joinDate}</TableCell>
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
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>View Rentals</DropdownMenuItem>
                    <DropdownMenuItem>Edit Customer</DropdownMenuItem>
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
