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

    const rental = await prisma.rental.findUnique({
      where: {
        id: params.id,
      },
      include: {
        customer: true,
        vehicle: {
          include: {
            vehicleGroup: true,
          },
        },
        pickupLocation: true,
        returnLocation: true,
        additionalOptions: {
          include: {
            additionalOption: true,
          },
        },
        staff: true,
      },
    })

    if (!rental) {
      return notFound()
    }

    return NextResponse.json(rental)
  } catch (error) {
    return serverError(error)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const hasPermission = await checkPermission([Role.ADMIN, Role.MANAGER, Role.STAFF])

    if (!hasPermission) {
      return forbidden()
    }

    const body = await req.json()

    const rental = await prisma.rental.findUnique({
      where: {
        id: params.id,
      },
      include: {
        vehicle: true,
      },
    })

    if (!rental) {
      return notFound()
    }

    // Handle status changes
    if (body.status && body.status !== rental.status) {
      // Update vehicle status based on rental status
      let vehicleStatus = rental.vehicle.status

      switch (body.status) {
        case "ACTIVE":
          vehicleStatus = "RENTED"
          break
        case "COMPLETED":
          vehicleStatus = "AVAILABLE"
          break
        case "CANCELLED":
          vehicleStatus = "AVAILABLE"
          break
        case "RESERVED":
          vehicleStatus = "RESERVED"
          break
        default:
          break
      }

      // Update vehicle status
      await prisma.vehicle.update({
        where: {
          id: rental.vehicleId,
        },
        data: {
          status: vehicleStatus,
        },
      })
    }

    // Convert date strings to Date objects
    if (body.startDate) {
      body.startDate = new Date(body.startDate)
    }

    if (body.endDate) {
      body.endDate = new Date(body.endDate)
    }

    const updatedRental = await prisma.rental.update({
      where: {
        id: params.id,
      },
      data: body,
      include: {
        customer: true,
        vehicle: true,
        pickupLocation: true,
        returnLocation: true,
        additionalOptions: {
          include: {
            additionalOption: true,
          },
        },
      },
    })

    return NextResponse.json(updatedRental)
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

    const rental = await prisma.rental.findUnique({
      where: {
        id: params.id,
      },
      include: {
        vehicle: true,
      },
    })

    if (!rental) {
      return notFound()
    }

    // Only allow deletion of CANCELLED or COMPLETED rentals
    if (rental.status !== "CANCELLED" && rental.status !== "COMPLETED") {
      return badRequest("Cannot delete an active rental. Cancel it first.")
    }

    // Delete associated additional options
    await prisma.additionalOptionOnRental.deleteMany({
      where: {
        rentalId: params.id,
      },
    })

    // Delete the rental
    const deletedRental = await prisma.rental.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(deletedRental)
  } catch (error) {
    return serverError(error)
  }
}
