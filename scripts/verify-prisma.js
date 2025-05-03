// This script verifies that the Prisma client can be imported correctly

async function verifyPrismaClient() {
  try {
    console.log("Attempting to import Prisma Client...")
    const { PrismaClient } = require("@prisma/client")
    console.log("Prisma Client imported successfully!")

    console.log("Attempting to instantiate Prisma Client...")
    const prisma = new PrismaClient()
    console.log("Prisma Client instantiated successfully!")

    console.log("Attempting to connect to the database...")
    await prisma.$connect()
    console.log("Connected to the database successfully!")

    console.log("Disconnecting from the database...")
    await prisma.$disconnect()
    console.log("Disconnected from the database successfully!")

    console.log("Prisma Client verification completed successfully!")
  } catch (error) {
    console.error("Error verifying Prisma Client:", error)
    process.exit(1)
  }
}

verifyPrismaClient()
