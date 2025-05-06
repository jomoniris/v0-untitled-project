// NOTE: This component is currently not in use as the dashboard has been removed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RecentRentals() {
  const rentals = [
    {
      id: "RNT-1234",
      customer: {
        name: "John Smith",
        email: "john@example.com",
        avatar: "/diverse-group-city.png",
      },
      vehicle: "Tesla Model 3",
      startDate: "Apr 24, 2023",
      endDate: "Apr 28, 2023",
      status: "Active",
    },
    {
      id: "RNT-1235",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatar: "/contemplative-artist.png",
      },
      vehicle: "BMW X5",
      startDate: "Apr 23, 2023",
      endDate: "Apr 30, 2023",
      status: "Active",
    },
    {
      id: "RNT-1236",
      customer: {
        name: "Michael Brown",
        email: "michael@example.com",
        avatar: "/contemplative-man.png",
      },
      vehicle: "Toyota Camry",
      startDate: "Apr 22, 2023",
      endDate: "Apr 25, 2023",
      status: "Completed",
    },
    {
      id: "RNT-1237",
      customer: {
        name: "Emily Davis",
        email: "emily@example.com",
        avatar: "/thoughtful-reader.png",
      },
      vehicle: "Honda Civic",
      startDate: "Apr 25, 2023",
      endDate: "Apr 29, 2023",
      status: "Pending",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Rentals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {rentals.map((rental) => (
            <div key={rental.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={rental.customer.avatar || "/placeholder.svg"} alt={rental.customer.name} />
                <AvatarFallback>{rental.customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{rental.customer.name}</p>
                <p className="text-sm text-muted-foreground">{rental.vehicle}</p>
              </div>
              <div className="ml-auto text-sm text-right">
                <div>
                  {rental.startDate} - {rental.endDate}
                </div>
                <Badge
                  variant={
                    rental.status === "Active" ? "default" : rental.status === "Completed" ? "secondary" : "outline"
                  }
                  className="mt-1"
                >
                  {rental.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
