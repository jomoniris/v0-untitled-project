const { PrismaClient } = require("@prisma/client")
const bcryptjs = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  try {
    // Hash password with bcryptjs
    const hashedPassword = await bcryptjs.hash("test123", 10)

    // Create test user
    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {
        hashedPassword: hashedPassword,
      },
      create: {
        name: "Test User",
        email: "test@example.com",
        hashedPassword: hashedPassword,
        role: "ADMIN",
        position: "Test Admin",
        department: "IT",
        phone: "555-123-4567",
      },
    })

    console.log("Test user created successfully:", user.email)
  } catch (error) {
    console.error("Error creating test user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
