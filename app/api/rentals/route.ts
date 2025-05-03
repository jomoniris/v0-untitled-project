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
    const customerId = searchParams.get("customerId")
    const vehicleId = searchParams.get("vehicleId")
    const locationId = searchParams.get("locationId")

    const rentals = await prisma.rental.findMany({
      where: {
        ...(status && { status }),
        ...(customerId && { customerId }),
        ...(vehicleId && { vehicleId }),
        ...(locationId && {
          OR: [{ pickupLocationId: locationId }, { returnLocationId: locationId }],
        }),
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
      },
      orderBy: {
        startDate: "desc",
      },
    })

    return NextResponse.json(rentals)
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const hasPermission = await checkPermission([Role.ADMIN, Role.MANAGER, Role.STAFF])

    if (!hasPermission) {
      return forbidden()
    }

    const body = await req.json()

    const {
      customerId,
      vehicleId,
      startDate,
      endDate,
      pickupLocationId,
      returnLocationId,
      totalAmount,
      additionalOptions,
      notes,
    } = body

    if (!customerId || !vehicleId || !startDate || !endDate || !pickupLocationId || !returnLocationId || !totalAmount) {
      return badRequest("Missing required fields")
    }

    // Check if vehicle is available for the requested period
    const overlappingRental = await prisma.rental.findFirst({
      where: {
        vehicleId,
        status: {
          in: ["RESERVED", "ACTIVE", "EXTENDED"],
        },
        OR: [
          {
            // New rental starts during an existing rental
            startDate: {
              lte: new Date(startDate),
            },
            endDate: {
              gte: new Date(startDate),
            },
          },
          {
            // New rental ends during an existing rental
            startDate: {
              lte: new Date(endDate),
            },
            endDate: {
              gte: new Date(endDate),
            },
          },
          {
            // New rental completely contains an existing rental
            startDate: {
              gte: new Date(startDate),
            },
            endDate: {
              lte: new Date(endDate),
            },
          },
        ],
      },
    })

    if (overlappingRental) {
      return badRequest("Vehicle is not available for the requested period")
    }

    // Check if vehicle exists and is active
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
        isActive: true,
      },
    })

    if (!vehicle) {
      return badRequest("Vehicle not found or inactive")
    }

    // Check if customer exists and is active
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
        isActive: true,
      },
    })

    if (!customer) {
      return badRequest("Customer not found or inactive")
    }

    // Create the rental
    const rental = await prisma.rental.create({
      data: {
        customerId,
        vehicleId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        pickupLocationId,
        returnLocationId,
        totalAmount,
        notes,
        status: "RESERVED",
        paymentStatus: "PENDING",
        staffId: (await getCurrentUser())?.id,
        additionalOptions: {
          create:
            additionalOptions?.map((option: any) => ({
              additionalOptionId: option.id,
              quantity: option.quantity || 1,
              price: option.price,
            })) || [],
        },
      },
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

    // Update vehicle status
    await prisma.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        status: "RESERVED",
      },
    })

    return NextResponse.json(rental)
  } catch (error) {
    return serverError(error)
  }
}
