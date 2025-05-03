const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Starting to seed admin user...")

    // Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10)

    // Create or update the admin user
    const user = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {
        hashedPassword,
        role: "ADMIN",
      },
      create: {
        email: "admin@example.com",
        name: "Admin User",
        hashedPassword,
        role: "ADMIN",
      },
    })

    console.log(`Admin user created/updated: ${user.email}`)

    // Create a test zone if it doesn't exist
    const zone = await prisma.zone.upsert({
      where: { id: "test-zone-id" },
      update: {},
      create: {
        id: "test-zone-id",
        name: "Downtown",
        description: "Downtown area",
        city: "New York",
        state: "NY",
        country: "USA",
      },
    })

    console.log(`Zone created/updated: ${zone.name}`)

    // Create a test location if it doesn't exist
    const location = await prisma.location.upsert({
      where: { id: "test-location-id" },
      update: {},
      create: {
        id: "test-location-id",
        name: "Main Office",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        zoneId: zone.id,
      },
    })

    console.log(`Location created/updated: ${location.name}`)

    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
