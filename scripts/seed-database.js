// scripts/seed-database.js

// This script is intended to seed the database with initial data.
// It can be run using `node scripts/seed-database.js`.

// Example using bcrypt (if needed):
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seeding...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
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

  // Create staff users
  const staffPassword = await bcrypt.hash("staff123", 10)
  const staff = await prisma.user.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: {
      name: "Staff User",
      email: "staff@example.com",
      hashedPassword: staffPassword,
      role: "STAFF",
      position: "Rental Agent",
      department: "Operations",
      phone: "555-987-6543",
    },
  })
  console.log("Staff user created:", staff.email)

  const managerPassword = await bcrypt.hash("manager123", 10)
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
      phone: "555-456-7890",
    },
  })
  console.log("Manager user created:", manager.email)

  // Create zones
  const downtownZone = await prisma.zone.upsert({
    where: { id: "clz1" },
    update: {},
    create: {
      id: "clz1",
      name: "Downtown",
      description: "Downtown area locations",
      city: "New York",
      state: "NY",
      country: "USA",
    },
  })
  console.log("Zone created:", downtownZone.name)

  const airportZone = await prisma.zone.upsert({
    where: { id: "clz2" },
    update: {},
    create: {
      id: "clz2",
      name: "Airport",
      description: "Airport area locations",
      city: "New York",
      state: "NY",
      country: "USA",
    },
  })
  console.log("Zone created:", airportZone.name)

  // Create locations
  const mainOffice = await prisma.location.upsert({
    where: { id: "cll1" },
    update: {},
    create: {
      id: "cll1",
      name: "Main Office",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      phone: "555-123-4567",
      email: "mainoffice@carrentalhub.com",
      zoneId: downtownZone.id,
      isAirport: false,
      latitude: 40.7128,
      longitude: -74.006,
    },
  })
  console.log("Location created:", mainOffice.name)

  const airportLocation = await prisma.location.upsert({
    where: { id: "cll2" },
    update: {},
    create: {
      id: "cll2",
      name: "JFK Airport",
      address: "JFK Airport Terminal 4",
      city: "New York",
      state: "NY",
      zipCode: "11430",
      country: "USA",
      phone: "555-987-6543",
      email: "jfk@carrentalhub.com",
      zoneId: airportZone.id,
      isAirport: true,
      latitude: 40.6413,
      longitude: -73.7781,
    },
  })
  console.log("Location created:", airportLocation.name)

  // Create vehicle groups
  const economyGroup = await prisma.vehicleGroup.upsert({
    where: { id: "clvg1" },
    update: {},
    create: {
      id: "clvg1",
      name: "Economy",
      description: "Economy class vehicles",
      category: "Economy",
      size: "Small",
      passengers: 4,
      luggage: 2,
      doors: 4,
      features: ["Air Conditioning", "Automatic Transmission"],
      imageUrl: "/urban-civic-night.png",
    },
  })
  console.log("Vehicle Group created:", economyGroup.name)

  const luxuryGroup = await prisma.vehicleGroup.upsert({
    where: { id: "clvg2" },
    update: {},
    create: {
      id: "clvg2",
      name: "Luxury",
      description: "Luxury class vehicles",
      category: "Luxury",
      size: "Large",
      passengers: 5,
      luggage: 4,
      doors: 4,
      features: ["Air Conditioning", "Automatic Transmission", "Leather Seats", "GPS Navigation"],
      imageUrl: "/sleek-bmw-cityscape.png",
    },
  })
  console.log("Vehicle Group created:", luxuryGroup.name)

  const suvGroup = await prisma.vehicleGroup.upsert({
    where: { id: "clvg3" },
    update: {},
    create: {
      id: "clvg3",
      name: "SUV",
      description: "SUV class vehicles",
      category: "SUV",
      size: "Medium",
      passengers: 7,
      luggage: 3,
      doors: 5,
      features: ["Air Conditioning", "Automatic Transmission", "4-Wheel Drive"],
      imageUrl: "/urban-rav4-adventure.png",
    },
  })
  console.log("Vehicle Group created:", suvGroup.name)

  // Create vehicles
  const vehicle1 = await prisma.vehicle.upsert({
    where: { licensePlate: "ABC123" },
    update: {},
    create: {
      make: "Honda",
      model: "Civic",
      year: 2022,
      color: "Blue",
      licensePlate: "ABC123",
      vin: "JH2PC35051M200020",
      status: "AVAILABLE",
      mileage: 15000,
      fuelLevel: 0.75,
      transmission: "AUTOMATIC",
      fuelType: "GASOLINE",
      vehicleGroupId: economyGroup.id,
      locationId: mainOffice.id,
      maintenanceStatus: "OK",
      lastMaintenance: new Date("2023-01-15"),
      nextMaintenance: new Date("2023-07-15"),
      images: ["/urban-civic-night.png"],
    },
  })
  console.log("Vehicle created:", vehicle1.make, vehicle1.model)

  const vehicle2 = await prisma.vehicle.upsert({
    where: { licensePlate: "XYZ789" },
    update: {},
    create: {
      make: "BMW",
      model: "5 Series",
      year: 2023,
      color: "Black",
      licensePlate: "XYZ789",
      vin: "WBAXH5C53CC979323",
      status: "AVAILABLE",
      mileage: 5000,
      fuelLevel: 1.0,
      transmission: "AUTOMATIC",
      fuelType: "GASOLINE",
      vehicleGroupId: luxuryGroup.id,
      locationId: airportLocation.id,
      maintenanceStatus: "OK",
      lastMaintenance: new Date("2023-03-10"),
      nextMaintenance: new Date("2023-09-10"),
      images: ["/sleek-bmw-cityscape.png"],
    },
  })
  console.log("Vehicle created:", vehicle2.make, vehicle2.model)

  const vehicle3 = await prisma.vehicle.upsert({
    where: { licensePlate: "DEF456" },
    update: {},
    create: {
      make: "Toyota",
      model: "RAV4",
      year: 2022,
      color: "Silver",
      licensePlate: "DEF456",
      vin: "2T3RFREV8EW278356",
      status: "AVAILABLE",
      mileage: 12000,
      fuelLevel: 0.85,
      transmission: "AUTOMATIC",
      fuelType: "HYBRID",
      vehicleGroupId: suvGroup.id,
      locationId: mainOffice.id,
      maintenanceStatus: "OK",
      lastMaintenance: new Date("2023-02-20"),
      nextMaintenance: new Date("2023-08-20"),
      images: ["/urban-rav4-adventure.png"],
    },
  })
  console.log("Vehicle created:", vehicle3.make, vehicle3.model)

  // Create customers
  const customer1 = await prisma.customer.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "555-111-2222",
      address: "456 Park Ave",
      city: "New York",
      state: "NY",
      zipCode: "10022",
      country: "USA",
      driverLicense: "DL12345678",
      licenseExpiry: new Date("2025-06-30"),
      dateOfBirth: new Date("1985-04-15"),
    },
  })
  console.log("Customer created:", customer1.firstName, customer1.lastName)

  const customer2 = await prisma.customer.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "555-333-4444",
      address: "789 Broadway",
      city: "New York",
      state: "NY",
      zipCode: "10003",
      country: "USA",
      driverLicense: "DL87654321",
      licenseExpiry: new Date("2024-09-15"),
      dateOfBirth: new Date("1990-08-22"),
    },
  })
  console.log("Customer created:", customer2.firstName, customer2.lastName)

  // Create additional options
  const option1 = await prisma.additionalOption.upsert({
    where: { id: "clao1" },
    update: {},
    create: {
      id: "clao1",
      name: "Full Coverage Insurance",
      description: "Comprehensive insurance coverage",
      price: 25.99,
      type: "INSURANCE",
      isRequired: false,
    },
  })
  console.log("Additional Option created:", option1.name)

  const option2 = await prisma.additionalOption.upsert({
    where: { id: "clao2" },
    update: {},
    create: {
      id: "clao2",
      name: "GPS Navigation",
      description: "GPS navigation system",
      price: 9.99,
      type: "EQUIPMENT",
      isRequired: false,
    },
  })
  console.log("Additional Option created:", option2.name)

  const option3 = await prisma.additionalOption.upsert({
    where: { id: "clao3" },
    update: {},
    create: {
      id: "clao3",
      name: "Child Seat",
      description: "Child safety seat",
      price: 7.99,
      type: "EQUIPMENT",
      isRequired: false,
    },
  })
  console.log("Additional Option created:", option3.name)

  // Create rental rates
  const economyRate = await prisma.rentalRate.upsert({
    where: { id: "clrr1" },
    update: {},
    create: {
      id: "clrr1",
      vehicleGroupId: economyGroup.id,
      name: "Economy Standard Rate",
      dailyRate: 49.99,
      weeklyRate: 299.99,
      monthlyRate: 1199.99,
      weekendRate: 59.99,
      mileageLimit: 150,
      overageFee: 0.25,
      seasonType: "REGULAR",
    },
  })
  console.log("Rental Rate created:", economyRate.name)

  const luxuryRate = await prisma.rentalRate.upsert({
    where: { id: "clrr2" },
    update: {},
    create: {
      id: "clrr2",
      vehicleGroupId: luxuryGroup.id,
      name: "Luxury Standard Rate",
      dailyRate: 99.99,
      weeklyRate: 599.99,
      monthlyRate: 2399.99,
      weekendRate: 119.99,
      mileageLimit: 200,
      overageFee: 0.35,
      seasonType: "REGULAR",
    },
  })
  console.log("Rental Rate created:", luxuryRate.name)

  const suvRate = await prisma.rentalRate.upsert({
    where: { id: "clrr3" },
    update: {},
    create: {
      id: "clrr3",
      vehicleGroupId: suvGroup.id,
      name: "SUV Standard Rate",
      dailyRate: 79.99,
      weeklyRate: 479.99,
      monthlyRate: 1899.99,
      weekendRate: 89.99,
      mileageLimit: 175,
      overageFee: 0.3,
      seasonType: "REGULAR",
    },
  })
  console.log("Rental Rate created:", suvRate.name)

  // Create active rentals
  const activeRental = await prisma.rental.upsert({
    where: { id: "clr1" },
    update: {},
    create: {
      id: "clr1",
      customerId: customer1.id,
      vehicleId: vehicle1.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      pickupLocationId: mainOffice.id,
      returnLocationId: mainOffice.id,
      status: "ACTIVE",
      totalAmount: 349.99,
      paymentStatus: "PAID",
      mileageOut: 15000,
      fuelLevelOut: 0.75,
      notes: "Customer requested early pickup",
      staffId: staff.id,
    },
  })
  console.log("Active Rental created for customer:", customer1.firstName, customer1.lastName)

  // Add additional options to the rental
  await prisma.additionalOptionOnRental.upsert({
    where: {
      rentalId_additionalOptionId: {
        rentalId: activeRental.id,
        additionalOptionId: option1.id,
      },
    },
    update: {},
    create: {
      rentalId: activeRental.id,
      additionalOptionId: option1.id,
      quantity: 1,
      price: option1.price,
    },
  })

  // Create reserved rental
  const reservedRental = await prisma.rental.upsert({
    where: { id: "clr2" },
    update: {},
    create: {
      id: "clr2",
      customerId: customer2.id,
      vehicleId: vehicle2.id,
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      pickupLocationId: airportLocation.id,
      returnLocationId: mainOffice.id,
      status: "RESERVED",
      totalAmount: 699.99,
      paymentStatus: "PARTIALLY_PAID",
      notes: "Customer will arrive on flight AA123",
      staffId: manager.id,
    },
  })
  console.log("Reserved Rental created for customer:", customer2.firstName, customer2.lastName)

  // Create NRT entries
  const nrtEntry = await prisma.nRTEntry.upsert({
    where: { id: "clnrt1" },
    update: {},
    create: {
      id: "clnrt1",
      vehicleId: vehicle3.id,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      type: "MAINTENANCE",
      reason: "Regular maintenance",
      notes: "Oil change and tire rotation",
      staffId: staff.id,
    },
  })
  console.log("NRT Entry created for vehicle:", vehicle3.make, vehicle3.model)

  // Create non-revenue movement
  const movement = await prisma.nonRevenueMovement.upsert({
    where: { id: "clnrm1" },
    update: {},
    create: {
      id: "clnrm1",
      vehicleId: vehicle3.id,
      originLocationId: mainOffice.id,
      destinationLocationId: airportLocation.id,
      departureDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      status: "SCHEDULED",
      reason: "Vehicle rebalancing",
      notes: "Moving vehicle to airport location for weekend demand",
      driverId: staff.id,
      mileageBefore: 12000,
    },
  })
  console.log("Non-Revenue Movement created for vehicle:", vehicle3.make, vehicle3.model)

  console.log("Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
