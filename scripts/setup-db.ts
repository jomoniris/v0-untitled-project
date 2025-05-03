import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database setup...")

  // Create admin user
  const adminPassword = await hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
      position: "System Administrator",
      department: "IT",
      phone: "555-123-4567",
    },
  })
  console.log("Admin user created:", admin.email)

  // Create manager user
  const managerPassword = await hash("manager123", 10)
  const manager = await prisma.user.upsert({
    where: { email: "manager@example.com" },
    update: {},
    create: {
      name: "Manager User",
      email: "manager@example.com",
      hashedPassword: managerPassword,
      role: "MANAGER",
      position: "Branch Manager",
      department: "Operations",
      phone: "555-234-5678",
    },
  })
  console.log("Manager user created:", manager.email)

  // Create staff user
  const staffPassword = await hash("staff123", 10)
  const staff = await prisma.user.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: {
      name: "Staff User",
      email: "staff@example.com",
      hashedPassword: staffPassword,
      role: "STAFF",
      position: "Rental Agent",
      department: "Customer Service",
      phone: "555-345-6789",
    },
  })
  console.log("Staff user created:", staff.email)

  // Create zones
  const downtownZone = await prisma.zone.upsert({
    where: { id: "zone-downtown" },
    update: {},
    create: {
      id: "zone-downtown",
      name: "Downtown",
      description: "Downtown area locations",
      city: "New York",
      state: "NY",
      country: "USA",
    },
  })

  const airportZone = await prisma.zone.upsert({
    where: { id: "zone-airport" },
    update: {},
    create: {
      id: "zone-airport",
      name: "Airport",
      description: "Airport locations",
      city: "New York",
      state: "NY",
      country: "USA",
    },
  })
  console.log("Zones created")

  // Create locations
  const downtownLocation = await prisma.location.upsert({
    where: { id: "location-downtown" },
    update: {},
    create: {
      id: "location-downtown",
      name: "Downtown Office",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "555-111-2222",
      email: "downtown@example.com",
      zoneId: downtownZone.id,
      isAirport: false,
      latitude: 40.7128,
      longitude: -74.006,
      openingHours: {
        monday: { open: "08:00", close: "18:00" },
        tuesday: { open: "08:00", close: "18:00" },
        wednesday: { open: "08:00", close: "18:00" },
        thursday: { open: "08:00", close: "18:00" },
        friday: { open: "08:00", close: "18:00" },
        saturday: { open: "09:00", close: "16:00" },
        sunday: { open: "10:00", close: "14:00" },
      },
    },
  })

  const airportLocation = await prisma.location.upsert({
    where: { id: "location-airport" },
    update: {},
    create: {
      id: "location-airport",
      name: "JFK Airport",
      address: "Terminal 4",
      city: "New York",
      state: "NY",
      zipCode: "11430",
      country: "USA",
      phone: "555-333-4444",
      email: "jfk@example.com",
      zoneId: airportZone.id,
      isAirport: true,
      latitude: 40.6413,
      longitude: -73.7781,
      openingHours: {
        monday: { open: "06:00", close: "22:00" },
        tuesday: { open: "06:00", close: "22:00" },
        wednesday: { open: "06:00", close: "22:00" },
        thursday: { open: "06:00", close: "22:00" },
        friday: { open: "06:00", close: "22:00" },
        saturday: { open: "06:00", close: "22:00" },
        sunday: { open: "06:00", close: "22:00" },
      },
    },
  })
  console.log("Locations created")

  // Create vehicle groups
  const economyGroup = await prisma.vehicleGroup.upsert({
    where: { id: "group-economy" },
    update: {},
    create: {
      id: "group-economy",
      name: "Economy",
      description: "Small, fuel-efficient cars",
      category: "Car",
      size: "Small",
      passengers: 4,
      luggage: 2,
      doors: 4,
      features: ["Air Conditioning", "Automatic Transmission", "Bluetooth"],
      imageUrl: "/urban-civic-night.png",
    },
  })

  const compactGroup = await prisma.vehicleGroup.upsert({
    where: { id: "group-compact" },
    update: {},
    create: {
      id: "group-compact",
      name: "Compact",
      description: "Compact cars with good fuel economy",
      category: "Car",
      size: "Compact",
      passengers: 5,
      luggage: 3,
      doors: 4,
      features: ["Air Conditioning", "Automatic Transmission", "Bluetooth", "Cruise Control"],
      imageUrl: "/sleek-electric-sedan.png",
    },
  })

  const suvGroup = await prisma.vehicleGroup.upsert({
    where: { id: "group-suv" },
    update: {},
    create: {
      id: "group-suv",
      name: "SUV",
      description: "Sport Utility Vehicles with extra space",
      category: "SUV",
      size: "Medium",
      passengers: 5,
      luggage: 4,
      doors: 5,
      features: ["Air Conditioning", "Automatic Transmission", "Bluetooth", "Cruise Control", "Navigation System"],
      imageUrl: "/urban-rav4-adventure.png",
    },
  })

  const luxuryGroup = await prisma.vehicleGroup.upsert({
    where: { id: "group-luxury" },
    update: {},
    create: {
      id: "group-luxury",
      name: "Luxury",
      description: "Premium vehicles with high-end features",
      category: "Car",
      size: "Full-size",
      passengers: 5,
      luggage: 4,
      doors: 4,
      features: [
        "Air Conditioning",
        "Automatic Transmission",
        "Bluetooth",
        "Cruise Control",
        "Navigation System",
        "Leather Seats",
        "Sunroof",
      ],
      imageUrl: "/sleek-bmw-cityscape.png",
    },
  })
  console.log("Vehicle groups created")

  // Create rental rates
  const economyRate = await prisma.rentalRate.upsert({
    where: { id: "rate-economy-regular" },
    update: {},
    create: {
      id: "rate-economy-regular",
      vehicleGroupId: economyGroup.id,
      name: "Economy Regular Rate",
      dailyRate: 39.99,
      weeklyRate: 249.99,
      monthlyRate: 899.99,
      weekendRate: 49.99,
      mileageLimit: 150,
      overageFee: 0.25,
      seasonType: "REGULAR",
    },
  })

  const compactRate = await prisma.rentalRate.upsert({
    where: { id: "rate-compact-regular" },
    update: {},
    create: {
      id: "rate-compact-regular",
      vehicleGroupId: compactGroup.id,
      name: "Compact Regular Rate",
      dailyRate: 49.99,
      weeklyRate: 299.99,
      monthlyRate: 1099.99,
      weekendRate: 59.99,
      mileageLimit: 150,
      overageFee: 0.25,
      seasonType: "REGULAR",
    },
  })

  const suvRate = await prisma.rentalRate.upsert({
    where: { id: "rate-suv-regular" },
    update: {},
    create: {
      id: "rate-suv-regular",
      vehicleGroupId: suvGroup.id,
      name: "SUV Regular Rate",
      dailyRate: 69.99,
      weeklyRate: 419.99,
      monthlyRate: 1499.99,
      weekendRate: 79.99,
      mileageLimit: 150,
      overageFee: 0.3,
      seasonType: "REGULAR",
    },
  })

  const luxuryRate = await prisma.rentalRate.upsert({
    where: { id: "rate-luxury-regular" },
    update: {},
    create: {
      id: "rate-luxury-regular",
      vehicleGroupId: luxuryGroup.id,
      name: "Luxury Regular Rate",
      dailyRate: 99.99,
      weeklyRate: 599.99,
      monthlyRate: 2199.99,
      weekendRate: 119.99,
      mileageLimit: 150,
      overageFee: 0.35,
      seasonType: "REGULAR",
    },
  })
  console.log("Rental rates created")

  // Create additional options
  const gpsOption = await prisma.additionalOption.upsert({
    where: { id: "option-gps" },
    update: {},
    create: {
      id: "option-gps",
      name: "GPS Navigation",
      description: "GPS navigation system",
      price: 9.99,
      type: "EQUIPMENT",
    },
  })

  const childSeatOption = await prisma.additionalOption.upsert({
    where: { id: "option-child-seat" },
    update: {},
    create: {
      id: "option-child-seat",
      name: "Child Seat",
      description: "Child safety seat",
      price: 7.99,
      type: "EQUIPMENT",
    },
  })

  const additionalDriverOption = await prisma.additionalOption.upsert({
    where: { id: "option-additional-driver" },
    update: {},
    create: {
      id: "option-additional-driver",
      name: "Additional Driver",
      description: "Additional authorized driver",
      price: 12.99,
      type: "SERVICE",
    },
  })

  const insuranceOption = await prisma.additionalOption.upsert({
    where: { id: "option-insurance" },
    update: {},
    create: {
      id: "option-insurance",
      name: "Full Coverage Insurance",
      description: "Comprehensive insurance coverage",
      price: 19.99,
      type: "INSURANCE",
      isRequired: false,
    },
  })
  console.log("Additional options created")

  // Create vehicles
  const vehicle1 = await prisma.vehicle.upsert({
    where: { id: "vehicle-civic" },
    update: {},
    create: {
      id: "vehicle-civic",
      make: "Honda",
      model: "Civic",
      year: 2022,
      color: "Blue",
      licensePlate: "ABC123",
      vin: "1HGCM82633A123456",
      status: "AVAILABLE",
      mileage: 15000,
      fuelLevel: 0.9,
      transmission: "AUTOMATIC",
      fuelType: "GASOLINE",
      vehicleGroupId: economyGroup.id,
      locationId: downtownLocation.id,
      maintenanceStatus: "OK",
      lastMaintenance: new Date("2023-01-15"),
      nextMaintenance: new Date("2023-07-15"),
      images: ["/urban-civic-night.png"],
    },
  })

  const vehicle2 = await prisma.vehicle.upsert({
    where: { id: "vehicle-corolla" },
    update: {},
    create: {
      id: "vehicle-corolla",
      make: "Toyota",
      model: "Corolla",
      year: 2021,
      color: "Silver",
      licensePlate: "DEF456",
      vin: "2T1BR32E13C123456",
      status: "AVAILABLE",
      mileage: 22000,
      fuelLevel: 0.75,
      transmission: "AUTOMATIC",
      fuelType: "GASOLINE",
      vehicleGroupId: economyGroup.id,
      locationId: airportLocation.id,
      maintenanceStatus: "OK",
      lastMaintenance: new Date("2023-02-10"),
      nextMaintenance: new Date("2023-08-10"),
      images: ["/sleek-electric-sedan.png"],
    },
  })

  const vehicle3 = await prisma.vehicle.upsert({
    where: { id: "vehicle-rav4" },
    update: {},
    create: {
      id: "vehicle-rav4",
      make: "Toyota",
      model: "RAV4",
      year: 2022,
      color: "White",
      licensePlate: "GHI789",
      vin: "JTMRFREV2GD123456",
      status: "AVAILABLE",
      mileage: 18000,
      fuelLevel: 0.85,
      transmission: "AUTOMATIC",
      fuelType: "GASOLINE",
      vehicleGroupId: suvGroup.id,
      locationId: downtownLocation.id,
      maintenanceStatus: "OK",
      lastMaintenance: new Date("2023-03-05"),
      nextMaintenance: new Date("2023-09-05"),
      images: ["/urban-rav4-adventure.png"],
    },
  })

  const vehicle4 = await prisma.vehicle.upsert({
    where: { id: "vehicle-bmw" },
    update: {},
    create: {
      id: "vehicle-bmw",
      make: "BMW",
      model: "5 Series",
      year: 2023,
      color: "Black",
      licensePlate: "JKL012",
      vin: "WBAXH5C53DD123456",
      status: "AVAILABLE",
      mileage: 8000,
      fuelLevel: 1.0,
      transmission: "AUTOMATIC",
      fuelType: "GASOLINE",
      vehicleGroupId: luxuryGroup.id,
      locationId: airportLocation.id,
      maintenanceStatus: "OK",
      lastMaintenance: new Date("2023-04-20"),
      nextMaintenance: new Date("2023-10-20"),
      images: ["/sleek-bmw-cityscape.png"],
    },
  })
  console.log("Vehicles created")

  // Create customers
  const customer1 = await prisma.customer.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "555-111-1111",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      driverLicense: "DL12345678",
      licenseExpiry: new Date("2025-05-15"),
      dateOfBirth: new Date("1985-07-20"),
    },
  })

  const customer2 = await prisma.customer.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "555-222-2222",
      address: "456 Park Ave",
      city: "New York",
      state: "NY",
      zipCode: "10022",
      country: "USA",
      driverLicense: "DL87654321",
      licenseExpiry: new Date("2024-11-30"),
      dateOfBirth: new Date("1990-03-15"),
    },
  })
  console.log("Customers created")

  // Create rentals
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 1)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 5)

  const rental1 = await prisma.rental.create({
    data: {
      customerId: customer1.id,
      vehicleId: vehicle1.id,
      startDate,
      endDate,
      pickupLocationId: downtownLocation.id,
      returnLocationId: downtownLocation.id,
      status: "RESERVED",
      totalAmount: 249.99,
      paymentStatus: "PENDING",
      staffId: staff.id,
      additionalOptions: {
        create: [
          {
            additionalOptionId: gpsOption.id,
            quantity: 1,
            price: gpsOption.price,
          },
          {
            additionalOptionId: insuranceOption.id,
            quantity: 1,
            price: insuranceOption.price,
          },
        ],
      },
    },
  })

  // Update vehicle status for the rental
  await prisma.vehicle.update({
    where: { id: vehicle1.id },
    data: {
      status: "RESERVED",
    },
  })
  console.log("Rental created")

  // Create NRT entry
  const nrtStartDate = new Date()
  nrtStartDate.setDate(nrtStartDate.getDate() + 10)

  const nrtEndDate = new Date(nrtStartDate)
  nrtEndDate.setDate(nrtEndDate.getDate() + 2)

  const nrtEntry = await prisma.nRTEntry.create({
    data: {
      vehicleId: vehicle3.id,
      startDate: nrtStartDate,
      endDate: nrtEndDate,
      type: "MAINTENANCE",
      reason: "Scheduled maintenance",
      notes: "Oil change and tire rotation",
      staffId: manager.id,
    },
  })
  console.log("NRT entry created")

  // Create non-revenue movement
  const movementDate = new Date()
  movementDate.setDate(movementDate.getDate() + 15)

  const arrivalDate = new Date(movementDate)
  arrivalDate.setHours(arrivalDate.getHours() + 2)

  const movement = await prisma.nonRevenueMovement.create({
    data: {
      vehicleId: vehicle2.id,
      originLocationId: airportLocation.id,
      destinationLocationId: downtownLocation.id,
      departureDate: movementDate,
      arrivalDate,
      status: "SCHEDULED",
      reason: "Vehicle rebalancing",
      notes: "Moving vehicle to downtown location for weekend demand",
      driverId: staff.id,
    },
  })
  console.log("Non-revenue movement created")

  console.log("Database setup completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
