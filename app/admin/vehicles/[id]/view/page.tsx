import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Trash } from "lucide-react"
import Link from "next/link"

// Mock data for a vehicle
const mockVehicleData = {
  id: "1",
  make: "Toyota",
  model: "Camry",
  year: "2023",
  licensePlate: "ABC-1234",
  vin: "1HGCM82633A123456",
  color: "Silver",
  transmission: "Automatic",
  fuelType: "Hybrid",
  mileage: "15000",
  seats: "5",
  doors: "4",
  engineSize: "2.5L",
  status: "Available",
  vehicleGroup: {
    id: "3",
    name: "Mid-size",
  },
  location: {
    id: "1",
    name: "Downtown Office",
  },
  features: ["Air Conditioning", "Navigation", "Bluetooth", "Cruise Control", "Parking Sensors", "Backup Camera"],
  description: "Well-maintained mid-size sedan with excellent fuel economy.",
  notes: "Popular with business travelers.",
  insurancePolicy: "INS-789012",
  lastMaintenanceDate: "April 15, 2023",
  nextMaintenanceDate: "October 15, 2023",
  maintenanceNotes: "Regular maintenance up to date. Next service includes brake inspection.",
}

export default function ViewVehiclePage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the vehicle data based on the ID
  console.log("Viewing vehicle with ID:", params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/vehicles">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {mockVehicleData.make} {mockVehicleData.model}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="text-red-500">
            <Trash className="h-4 w-4" />
          </Button>
          <Link href={`/admin/vehicles/${params.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Vehicle
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Make</p>
                <p>{mockVehicleData.make}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p>{mockVehicleData.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Year</p>
                <p>{mockVehicleData.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Color</p>
                <p>{mockVehicleData.color}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                <p>{mockVehicleData.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIN</p>
                <p>{mockVehicleData.vin}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p>{mockVehicleData.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transmission</p>
                <p>{mockVehicleData.transmission}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fuel Type</p>
                <p>{mockVehicleData.fuelType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mileage</p>
                <p>{mockVehicleData.mileage} miles</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engine Size</p>
                <p>{mockVehicleData.engineSize}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Seats</p>
                <p>{mockVehicleData.seats}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doors</p>
                <p>{mockVehicleData.doors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-medium text-green-600">{mockVehicleData.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicle Group</p>
                <p>{mockVehicleData.vehicleGroup.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Location</p>
                <p>{mockVehicleData.location.name}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p>{mockVehicleData.notes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockVehicleData.features.map((feature, index) => (
                <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Maintenance & Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Insurance Policy</p>
                <p>{mockVehicleData.insurancePolicy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Maintenance</p>
                <p>{mockVehicleData.lastMaintenanceDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Maintenance Due</p>
                <p>{mockVehicleData.nextMaintenanceDate}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Maintenance Notes</p>
              <p>{mockVehicleData.maintenanceNotes}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
