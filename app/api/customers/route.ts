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
    const search = searchParams.get("search")
    const isActive = searchParams.get("isActive") === "true"

    const customers = await prisma.customer.findMany({
      where: {
        ...(search && {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(isActive !== null && { isActive }),
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(customers)
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
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      driverLicense,
      licenseExpiry,
      dateOfBirth,
    } = body

    if (!firstName || !lastName || !email) {
      return badRequest("Missing required fields")
    }

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        email,
      },
    })

    if (existingCustomer) {
      return badRequest("Customer with this email already exists")
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        driverLicense,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    return serverError(error)
  }
}
