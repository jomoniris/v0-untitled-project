// NOTE: This component is currently not in use as the dashboard has been removed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function PopularVehicles() {
  const vehicles = [
    {
      id: 1,
      name: "Tesla Model 3",
      category: "Electric",
      image: "/sleek-electric-sedan.png",
      rentals: 42,
      availability: "87%",
    },
    {
      id: 2,
      name: "Toyota RAV4",
      category: "SUV",
      image: "/urban-rav4-adventure.png",
      rentals: 38,
      availability: "62%",
    },
    {
      id: 3,
      name: "BMW 5 Series",
      category: "Luxury",
      image: "/sleek-bmw-cityscape.png",
      rentals: 31,
      availability: "45%",
    },
    {
      id: 4,
      name: "Honda Civic",
      category: "Economy",
      image: "/urban-civic-night.png",
      rentals: 28,
      availability: "93%",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center">
              <div className="relative h-12 w-20 overflow-hidden rounded-md">
                <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{vehicle.name}</p>
                <p className="text-sm text-muted-foreground">{vehicle.category}</p>
              </div>
              <div className="ml-auto text-sm text-right">
                <div>{vehicle.rentals} rentals this month</div>
                <div className="text-muted-foreground">Availability: {vehicle.availability}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
