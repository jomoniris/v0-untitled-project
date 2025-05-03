import { type NextRequest, NextResponse } from "next/server"
import { Role } from "@prisma/client"
import prisma from "@/lib/db"
import { getCurrentUser, unauthorized, forbidden, badRequest, serverError, checkPermission } from "@/app/api/utils"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return unauthorized()
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const locationId = searchParams.get("locationId")
    const groupId = searchParams.get("groupId")
    const isActive = searchParams.get("isActive") === "true"

    const vehicles = await prisma.vehicle.findMany({
      where: {
        ...(status && { status }),
        ...(locationId && { locationId }),
        ...(groupId && { vehicleGroupId: groupId }),
        ...(isActive !== null && { isActive }),
      },
      include: {
        vehicleGroup: true,
        location: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const hasPermission = await checkPermission([Role.ADMIN, Role.MANAGER])

    if (!hasPermission) {
      return forbidden()
    }

    const body = await req.json()

    const {
      make,
      model,
      year,
      color,
      licensePlate,
      vin,
      mileage,
      fuelLevel,
      transmission,
      fuelType,
      vehicleGroupId,
      locationId,
      images,
    } = body

    if (!make || !model || !year || !licensePlate || !vin || !vehicleGroupId || !locationId) {
      return badRequest("Missing required fields")
    }

    // Check if license plate or VIN already exists
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ licensePlate }, { vin }],
      },
    })

    if (existingVehicle) {
      return badRequest("Vehicle with this license plate or VIN already exists")
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        year,
        color,
        licensePlate,
        vin,
        mileage,
        fuelLevel,
        transmission,
        fuelType,
        vehicleGroupId,
        locationId,
        images: images || [],
        status: "AVAILABLE",
        maintenanceStatus: "OK",
      },
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    return serverError(error)
  }
}
