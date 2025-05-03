import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    const prisma = new PrismaClient()

    // Check if admin user exists
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    })

    // Create admin user if it doesn't exist
    if (!adminExists) {
      const hashedPassword = await hash("admin123", 10)

      await prisma.user.create({
        data: {
          id: "admin-id",
          name: "Admin User",
          email: "admin@example.com",
          hashedPassword: hashedPassword,
          role: "ADMIN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      console.log("Admin user created successfully")
    } else {
      console.log("Admin user already exists")
    }

    // Check if staff user exists
    const staffExists = await prisma.user.findUnique({
      where: { email: "staff@example.com" },
    })

    // Create staff user if it doesn't exist
    if (!staffExists) {
      const hashedPassword = await hash("staff123", 10)

      await prisma.user.create({
        data: {
          id: "staff-id",
          name: "Staff User",
          email: "staff@example.com",
          hashedPassword: hashedPassword,
          role: "STAFF",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      console.log("Staff user created successfully")
    } else {
      console.log("Staff user already exists")
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: "Users created successfully",
    })
  } catch (error) {
    console.error("Error creating users:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
