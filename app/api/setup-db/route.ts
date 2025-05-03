import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"

export async function GET() {
  try {
    const prisma = new PrismaClient()

    // Push the schema to the database
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL,
      "name" TEXT,
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'USER',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      PRIMARY KEY ("id")
    )`

    // Check if admin user exists
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    })

    // Create admin user if it doesn't exist
    if (!adminExists) {
      await prisma.user.create({
        data: {
          id: "admin-user-id",
          name: "Admin User",
          email: "admin@example.com",
          password: await bcryptjs.hash("admin123", 10),
          role: "ADMIN",
        },
      })
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
