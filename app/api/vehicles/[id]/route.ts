import { type NextRequest, NextResponse } from "next/server"
import { Role } from "@prisma/client"
import prisma from "@/lib/db"
import {
  getCurrentUser,
  unauthorized,
  forbidden,
  notFound,
  badRequest,
  serverError,
  checkPermission,
} from "@/app/api/utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return unauthorized()
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
      include: {
        vehicleGroup: true,
        location: true,
      },
    })

    if (!vehicle) {
      return notFound()
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    return serverError(error)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hasPermission = await checkPermission([Role.ADMIN, Role.MANAGER])

    if (!hasPermission) {
      return forbidden()
    }

    const body = await req.json()

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!vehicle) {
      return notFound()
    }

    // Check if license plate or VIN is being changed and already exists
    if ((body.licensePlate && body.licensePlate !== vehicle.licensePlate) || (body.vin && body.vin !== vehicle.vin)) {
      const existingVehicle = await prisma.vehicle.findFirst({
        where: {
          OR: [{ licensePlate: body.licensePlate || "" }, { vin: body.vin || "" }],
          NOT: {
            id: params.id,
          },
        },
      })

      if (existingVehicle) {
        return badRequest("Vehicle with this license plate or VIN already exists")
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: params.id,
      },
      data: body,
    })

    return NextResponse.json(updatedVehicle)
  } catch (error) {
    return serverError(error)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hasPermission = await checkPermission([Role.ADMIN])

    if (!hasPermission) {
      return forbidden()
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!vehicle) {
      return notFound()
    }

    // Check if vehicle is currently rented
    const activeRental = await prisma.rental.findFirst({
      where: {
        vehicleId: params.id,
        status: {
          in: ["RESERVED", "ACTIVE", "EXTENDED"],
        },
      },
    })

    if (activeRental) {
      return badRequest("Cannot delete a vehicle that is currently rented")
    }

    // Soft delete by setting isActive to false
    const deletedVehicle = await prisma.vehicle.update({
      where: {
        id: params.id,
      },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json(deletedVehicle)
  } catch (error) {
    return serverError(error)
  }
}
