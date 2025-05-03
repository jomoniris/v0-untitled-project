const { PrismaClient } = require("@prisma/client")
const { hash } = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database initialization...")

  try {
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

    // Create a zone
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
    console.log("Zone created:", downtownZone.name)

    // Create a location
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
    console.log("Location created:", downtownLocation.name)

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Database initialization error:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
