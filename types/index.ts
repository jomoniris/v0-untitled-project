import type {
  Role,
  VehicleStatus,
  TransmissionType,
  FuelType,
  MaintenanceStatus,
  RentalStatus,
  PaymentStatus,
  OptionType,
  SeasonType,
  NRTType,
  MovementStatus,
} from "@prisma/client"

// User/Staff
export interface User {
  id: string
  name: string
  email: string
  emailVerified?: Date
  image?: string
  role: Role
  position?: string
  department?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Customer
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  driverLicense?: string
  licenseExpiry?: Date
  dateOfBirth?: Date
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Vehicle
export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  vin: string
  status: VehicleStatus
  mileage: number
  fuelLevel?: number
  transmission: TransmissionType
  fuelType: FuelType
  vehicleGroupId: string
  vehicleGroup?: VehicleGroup
  locationId: string
  location?: Location
  maintenanceStatus: MaintenanceStatus
  lastMaintenance?: Date
  nextMaintenance?: Date
  images: string[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Vehicle Group
export interface VehicleGroup {
  id: string
  name: string
  description?: string
  category: string
  size: string
  passengers: number
  luggage: number
  doors: number
  features: string[]
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Location
export interface Location {
  id: string
  name: string
  address: string
  city: string
  state?: string
  zipCode: string
  country: string
  phone?: string
  email?: string
  openingHours?: Record<string, any>
  zoneId?: string
  zone?: Zone
  isAirport: boolean
  latitude?: number
  longitude?: number
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Zone
export interface Zone {
  id: string
  name: string
  description?: string
  city?: string
  state?: string
  country?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Rental
export interface Rental {
  id: string
  customerId: string
  customer?: Customer
  vehicleId: string
  vehicle?: Vehicle
  startDate: Date
  endDate: Date
  pickupLocationId: string
  pickupLocation?: Location
  returnLocationId: string
  returnLocation?: Location
  status: RentalStatus
  totalAmount: number
  paymentStatus: PaymentStatus
  additionalOptions?: AdditionalOptionOnRental[]
  mileageOut?: number
  mileageIn?: number
  fuelLevelOut?: number
  fuelLevelIn?: number
  notes?: string
  staffId?: string
  staff?: User
  createdAt: Date
  updatedAt: Date
}

// Additional Option
export interface AdditionalOption {
  id: string
  name: string
  description?: string
  price: number
  type: OptionType
  isRequired: boolean
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Junction for Rental and AdditionalOption
export interface AdditionalOptionOnRental {
  id: string
  rentalId: string
  rental?: Rental
  additionalOptionId: string
  additionalOption?: AdditionalOption
  quantity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

// Rental Rate
export interface RentalRate {
  id: string
  vehicleGroupId: string
  vehicleGroup?: VehicleGroup
  name: string
  dailyRate: number
  weeklyRate?: number
  monthlyRate?: number
  weekendRate?: number
  holidayRate?: number
  mileageLimit?: number
  overageFee?: number
  startDate?: Date
  endDate?: Date
  seasonType: SeasonType
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Non-Revenue Time (NRT)
export interface NRTEntry {
  id: string
  vehicleId: string
  vehicle?: Vehicle
  startDate: Date
  endDate?: Date
  type: NRTType
  reason?: string
  notes?: string
  staffId?: string
  staff?: User
  createdAt: Date
  updatedAt: Date
}

// Non-Revenue Movement
export interface NonRevenueMovement {
  id: string
  vehicleId: string
  vehicle?: Vehicle
  originLocationId: string
  originLocation?: Location
  destinationLocationId: string
  destinationLocation?: Location
  departureDate: Date
  arrivalDate?: Date
  status: MovementStatus
  reason?: string
  notes?: string
  driverId?: string
  driver?: User
  mileageBefore?: number
  mileageAfter?: number
  fuelLevelBefore?: number
  fuelLevelAfter?: number
  createdAt: Date
  updatedAt: Date
}
