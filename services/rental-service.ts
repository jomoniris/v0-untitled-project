import prisma from "@/lib/db"
import type { Rental } from "@prisma/client"

export async function createRental(data: {
  customerId: string
  vehicleId: string
  startDate: Date
  endDate: Date
  pickupLocationId: string
  returnLocationId: string
  totalAmount: number
  additionalOptions?: { id: string; quantity: number; price: number }[]
  notes?: string
  staffId?: string
}): Promise<Rental> {
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
    staffId,
  } = data

  // Create the rental
  const rental = await prisma.rental.create({
    data: {
      customerId,
      vehicleId,
      startDate,
      endDate,
      pickupLocationId,
      returnLocationId,
      totalAmount,
      notes,
      status: "RESERVED",
      paymentStatus: "PENDING",
      staffId,
      additionalOptions: {
        create:
          additionalOptions?.map((option) => ({
            additionalOptionId: option.id,
            quantity: option.quantity || 1,
            price: option.price,
          })) || [],
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

  return rental
}

export async function startRental(
  rentalId: string,
  data: {
    mileageOut: number
    fuelLevelOut: number
    notes?: string
  },
): Promise<Rental> {
  const { mileageOut, fuelLevelOut, notes } = data

  // Get the rental
  const rental = await prisma.rental.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      vehicle: true,
    },
  })

  if (!rental) {
    throw new Error("Rental not found")
  }

  if (rental.status !== "RESERVED") {
    throw new Error("Rental is not in RESERVED status")
  }

  // Update the rental
  const updatedRental = await prisma.rental.update({
    where: {
      id: rentalId,
    },
    data: {
      status: "ACTIVE",
      mileageOut,
      fuelLevelOut,
      notes: notes ? `${rental.notes || ""}\n${notes}` : rental.notes,
    },
  })

  // Update vehicle status and mileage
  await prisma.vehicle.update({
    where: {
      id: rental.vehicleId,
    },
    data: {
      status: "RENTED",
      mileage: mileageOut,
      fuelLevel: fuelLevelOut,
    },
  })

  return updatedRental
}

export async function completeRental(
  rentalId: string,
  data: {
    mileageIn: number
    fuelLevelIn: number
    notes?: string
    paymentStatus?: string
  },
): Promise<Rental> {
  const { mileageIn, fuelLevelIn, notes, paymentStatus } = data

  // Get the rental
  const rental = await prisma.rental.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      vehicle: true,
    },
  })

  if (!rental) {
    throw new Error("Rental not found")
  }

  if (rental.status !== "ACTIVE" && rental.status !== "EXTENDED") {
    throw new Error("Rental is not in ACTIVE or EXTENDED status")
  }

  // Update the rental
  const updatedRental = await prisma.rental.update({
    where: {
      id: rentalId,
    },
    data: {
      status: "COMPLETED",
      mileageIn,
      fuelLevelIn,
      notes: notes ? `${rental.notes || ""}\n${notes}` : rental.notes,
      paymentStatus: paymentStatus || rental.paymentStatus,
    },
  })

  // Update vehicle status, mileage, and fuel level
  await prisma.vehicle.update({
    where: {
      id: rental.vehicleId,
    },
    data: {
      status: "AVAILABLE",
      mileage: mileageIn,
      fuelLevel: fuelLevelIn,
    },
  })

  return updatedRental
}

export async function cancelRental(rentalId: string, notes?: string): Promise<Rental> {
  // Get the rental
  const rental = await prisma.rental.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      vehicle: true,
    },
  })

  if (!rental) {
    throw new Error("Rental not found")
  }

  if (rental.status !== "RESERVED") {
    throw new Error("Only RESERVED rentals can be cancelled")
  }

  // Update the rental
  const updatedRental = await prisma.rental.update({
    where: {
      id: rentalId,
    },
    data: {
      status: "CANCELLED",
      notes: notes ? `${rental.notes || ""}\n${notes}` : rental.notes,
    },
  })

  // Update vehicle status
  await prisma.vehicle.update({
    where: {
      id: rental.vehicleId,
    },
    data: {
      status: "AVAILABLE",
    },
  })

  return updatedRental
}

export async function extendRental(
  rentalId: string,
  newEndDate: Date,
  additionalAmount: number,
  notes?: string,
): Promise<Rental> {
  // Get the rental
  const rental = await prisma.rental.findUnique({
    where: {
      id: rentalId,
    },
  })

  if (!rental) {
    throw new Error("Rental not found")
  }

  if (rental.status !== "ACTIVE") {
    throw new Error("Only ACTIVE rentals can be extended")
  }

  if (newEndDate <= rental.endDate) {
    throw new Error("New end date must be after the current end date")
  }

  // Check if the vehicle is available for the extended period
  const overlappingRental = await prisma.rental.findFirst({
    where: {
      vehicleId: rental.vehicleId,
      id: {
        not: rentalId,
      },
      status: {
        in: ["RESERVED", "ACTIVE", "EXTENDED"],
      },
      startDate: {
        lte: newEndDate,
      },
      endDate: {
        gte: rental.endDate,
      },
    },
  })

  if (overlappingRental) {
    throw new Error("Vehicle is not available for the extended period")
  }

  // Update the rental
  const updatedRental = await prisma.rental.update({
    where: {
      id: rentalId,
    },
    data: {
      endDate: newEndDate,
      totalAmount: rental.totalAmount + additionalAmount,
      status: "EXTENDED",
      notes: notes ? `${rental.notes || ""}\nExtended: ${notes}` : rental.notes,
    },
  })

  return updatedRental
}
