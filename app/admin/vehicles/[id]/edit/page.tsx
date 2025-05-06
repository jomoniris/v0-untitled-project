import { VehicleForm } from "@/components/vehicle-form"

// Mock data for a vehicle
const mockVehicleData = {
  make: "Toyota",
  model: "Camry",
  year: "2023",
  licensePlate: "ABC-1234",
  vin: "1HGCM82633A123456",
  color: "Silver",
  transmission: "automatic",
  fuelType: "hybrid",
  mileage: "15000",
  seats: "5",
  doors: "4",
  engineSize: "2.5L",
  status: "available",
  vehicleGroup: "3",
  location: "1",
  airConditioning: true,
  navigation: true,
  bluetooth: true,
  cruiseControl: true,
  parkingSensors: true,
  backupCamera: true,
  leatherSeats: false,
  sunroof: false,
  description: "Well-maintained mid-size sedan with excellent fuel economy.",
  notes: "Popular with business travelers.",
  insurancePolicy: "INS-789012",
  lastMaintenanceDate: "2023-04-15",
  nextMaintenanceDate: "2023-10-15",
  maintenanceNotes: "Regular maintenance up to date. Next service includes brake inspection.",
}

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the vehicle data based on the ID
  console.log("Editing vehicle with ID:", params.id)

  return <VehicleForm initialData={mockVehicleData} isEditing={true} />
}
