import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    // Check if admin user exists
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    })

    // Create admin user if it doesn't exist
    if (!adminExists) {
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@example.com",
          hashedPassword: await hash("admin123", 10),
          role: "ADMIN",
        },
      })
    }

    // Create a zone if none exist
    const zonesCount = await prisma.zone.count()
    if (zonesCount === 0) {
      await prisma.zone.create({
        data: {
          name: "Downtown",
          description: "Downtown area locations",
          city: "New York",
          state: "NY",
          country: "USA",
        },
      })
    }

    // Create a location if none exist
    const locationsCount = await prisma.location.count()
    if (locationsCount === 0) {
      const zone = await prisma.zone.findFirst()
      if (zone) {
        await prisma.location.create({
          data: {
            name: "Main Office",
            address: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
            phone: "555-123-4567",
            email: "office@carrentalhub.com",
            zoneId: zone.id,
          },
        })
      }
    }

    // Create a vehicle group if none exist
    const vehicleGroupsCount = await prisma.vehicleGroup.count()
    if (vehicleGroupsCount === 0) {
      await prisma.vehicleGroup.create({
        data: {
          name: "Economy",
          description: "Economy class vehicles",
          category: "Economy",
          size: "Small",
          passengers: 4,
          luggage: 2,
          doors: 4,
          features: ["Air Conditioning", "Automatic Transmission"],
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
