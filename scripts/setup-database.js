const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database setup...")

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        id: "admin-user-id",
        name: "Admin User",
        email: "admin@example.com",
        hashedPassword: hashedPassword,
        role: "ADMIN",
      },
    })
    console.log("Admin user created:", admin.email)

    // Create staff user
    const staffPassword = await bcrypt.hash("staff123", 10)
    const staff = await prisma.user.upsert({
      where: { email: "staff@example.com" },
      update: {},
      create: {
        id: "staff-user-id",
        name: "Staff User",
        email: "staff@example.com",
        hashedPassword: staffPassword,
        role: "STAFF",
      },
    })
    console.log("Staff user created:", staff.email)

    // Create a zone
    const zone = await prisma.zone.upsert({
      where: { id: "zone-1" },
      update: {},
      create: {
        id: "zone-1",
        name: "Downtown",
        description: "Downtown area",
        city: "New York",
        state: "NY",
        country: "USA",
      },
    })
    console.log("Zone created:", zone.name)

    // Create a location
    const location = await prisma.location.upsert({
      where: { id: "location-1" },
      update: {},
      create: {
        id: "location-1",
        name: "Main Office",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        zoneId: zone.id,
        isAirport: false,
      },
    })
    console.log("Location created:", location.name)

    console.log("Database setup completed successfully!")
  } catch (error) {
    console.error("Error setting up database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
