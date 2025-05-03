import prisma from "@/lib/db"
import type { Vehicle } from "@prisma/client"

export async function getVehicleAvailability(vehicleId: string, startDate: Date, endDate: Date): Promise<boolean> {
  // Check if vehicle exists and is active
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
      isActive: true,
    },
  })

  if (!vehicle) {
    return false
  }

  // Check if vehicle is in maintenance or out of service
  if (vehicle.status === "MAINTENANCE" || vehicle.status === "OUT_OF_SERVICE") {
    return false
  }

  // Check for overlapping rentals
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
            lte: startDate,
          },
          endDate: {
            gte: startDate,
          },
        },
        {
          // New rental ends during an existing rental
          startDate: {
            lte: endDate,
          },
          endDate: {
            gte: endDate,
          },
        },
        {
          // New rental completely contains an existing rental
          startDate: {
            gte: startDate,
          },
          endDate: {
            lte: endDate,
          },
        },
      ],
    },
  })

  if (overlappingRental) {
    return false
  }

  // Check for overlapping NRT entries
  const overlappingNRT = await prisma.nRTEntry.findFirst({
    where: {
      vehicleId,
      OR: [
        {
          // NRT starts during the rental period
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          // NRT ends during the rental period
          endDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          // NRT completely contains the rental period
          startDate: {
            lte: startDate,
          },
          endDate: {
            gte: endDate,
          },
        },
      ],
    },
  })

  if (overlappingNRT) {
    return false
  }

  return true
}

export async function getAvailableVehicles(
  startDate: Date,
  endDate: Date,
  locationId?: string,
  vehicleGroupId?: string,
): Promise<Vehicle[]> {
  // Get all active vehicles
  const vehicles = await prisma.vehicle.findMany({
    where: {
      isActive: true,
      ...(locationId && { locationId }),
      ...(vehicleGroupId && { vehicleGroupId }),
      status: {
        notIn: ["MAINTENANCE", "OUT_OF_SERVICE"],
      },
    },
    include: {
      vehicleGroup: true,
      location: true,
    },
  })

  // Filter out vehicles with overlapping rentals
  const availableVehicles = await Promise.all(
    vehicles.map(async (vehicle) => {
      const isAvailable = await getVehicleAvailability(vehicle.id, startDate, endDate)

      return isAvailable ? vehicle : null
    }),
  )

  return availableVehicles.filter(Boolean) as Vehicle[]
}

export async function calculateRentalPrice(
  vehicleGroupId: string,
  startDate: Date,
  endDate: Date,
  additionalOptionsIds: { id: string; quantity: number }[] = [],
): Promise<{ basePrice: number; optionsPrice: number; totalPrice: number }> {
  // Get the vehicle group
  const vehicleGroup = await prisma.vehicleGroup.findUnique({
    where: {
      id: vehicleGroupId,
    },
  })

  if (!vehicleGroup) {
    throw new Error("Vehicle group not found")
  }

  // Get the rental rate for the vehicle group
  const rentalRate = await prisma.rentalRate.findFirst({
    where: {
      vehicleGroupId,
      isActive: true,
      OR: [
        {
          // Rate with no specific date range
          startDate: null,
          endDate: null,
        },
        {
          // Rate with a date range that includes the rental period
          startDate: {
            lte: startDate,
          },
          endDate: {
            gte: endDate,
          },
        },
      ],
    },
    orderBy: {
      // Prioritize rates with specific date ranges
      startDate: "desc",
    },
  })

  if (!rentalRate) {
    throw new Error("No rental rate found for this vehicle group")
  }

  // Calculate the number of days
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate the base price
  let basePrice = 0

  if (days >= 30 && rentalRate.monthlyRate) {
    // Monthly rate
    const months = Math.floor(days / 30)
    const remainingDays = days % 30

    basePrice = months * rentalRate.monthlyRate
    basePrice += remainingDays * rentalRate.dailyRate
  } else if (days >= 7 && rentalRate.weeklyRate) {
    // Weekly rate
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7

    basePrice = weeks * rentalRate.weeklyRate
    basePrice += remainingDays * rentalRate.dailyRate
  } else {
    // Daily rate
    basePrice = days * rentalRate.dailyRate
  }

  // Calculate the price for additional options
  let optionsPrice = 0

  if (additionalOptionsIds.length > 0) {
    const additionalOptions = await prisma.additionalOption.findMany({
      where: {
        id: {
          in: additionalOptionsIds.map((option) => option.id),
        },
        isActive: true,
      },
    })

    optionsPrice = additionalOptionsIds.reduce((total, option) => {
      const additionalOption = additionalOptions.find((ao) => ao.id === option.id)

      if (additionalOption) {
        return total + additionalOption.price * option.quantity * days
      }

      return total
    }, 0)
  }

  // Calculate the total price
  const totalPrice = basePrice + optionsPrice

  return {
    basePrice,
    optionsPrice,
    totalPrice,
  }
}
