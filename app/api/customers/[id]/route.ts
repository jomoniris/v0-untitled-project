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

    const customer = await prisma.customer.findUnique({
      where: {
        id: params.id,
      },
      include: {
        rentals: {
          include: {
            vehicle: true,
            pickupLocation: true,
            returnLocation: true,
          },
          orderBy: {
            startDate: "desc",
          },
        },
      },
    })

    if (!customer) {
      return notFound()
    }

    return NextResponse.json(customer)
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!customer) {
      return notFound()
    }

    // Check if email is being changed and already exists
    if (body.email && body.email !== customer.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: {
          email: body.email,
        },
      })

      if (existingCustomer) {
        return badRequest("Customer with this email already exists")
      }
    }

    // Convert date strings to Date objects
    if (body.licenseExpiry) {
      body.licenseExpiry = new Date(body.licenseExpiry)
    }

    if (body.dateOfBirth) {
      body.dateOfBirth = new Date(body.dateOfBirth)
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: params.id,
      },
      data: body,
    })

    return NextResponse.json(updatedCustomer)
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

    const customer = await prisma.customer.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!customer) {
      return notFound()
    }

    // Check if customer has active rentals
    const activeRental = await prisma.rental.findFirst({
      where: {
        customerId: params.id,
        status: {
          in: ["RESERVED", "ACTIVE", "EXTENDED"],
        },
      },
    })

    if (activeRental) {
      return badRequest("Cannot delete a customer with active rentals")
    }

    // Soft delete by setting isActive to false
    const deletedCustomer = await prisma.customer.update({
      where: {
        id: params.id,
      },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json(deletedCustomer)
  } catch (error) {
    return serverError(error)
  }
}
