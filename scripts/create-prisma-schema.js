const fs = require("fs")
const path = require("path")

// Create prisma directory if it doesn't exist
const prismaDir = path.join(process.cwd(), "prisma")
if (!fs.existsSync(prismaDir)) {
  console.log("Creating prisma directory...")
  fs.mkdirSync(prismaDir, { recursive: true })
}

// Path to schema file
const schemaPath = path.join(prismaDir, "schema.prisma")

// Your schema content - this is the updated schema without the image field
const schemaContent = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model for authentication and staff members
model User {
  id             String   @id @default(cuid())
  name           String?
  email          String   @unique
  // Remove image field since it doesn't exist in the database
  hashedPassword String?
  role           Role     @default(STAFF)
  position       String?
  department     String?
  phone          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  rentals             Rental[]
  nrtEntries          NRTEntry[]
  nonRevenueMovements NonRevenueMovement[] @relation("Driver")
}

enum Role {
  ADMIN
  MANAGER
  STAFF
}

// Customer model
model Customer {
  id              String   @id @default(cuid())
  firstName       String
  lastName        String
  email           String   @unique
  phone           String?
  address         String?
  city            String?
  state           String?
  zipCode         String?
  country         String?
  driverLicense   String?
  licenseExpiry   DateTime?
  dateOfBirth     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  isActive        Boolean  @default(true)
  rentals         Rental[]
}

// Vehicle model
model Vehicle {
  id                String    @id @default(cuid())
  make              String
  model             String
  year              Int
  color             String
  licensePlate      String    @unique
  vin               String    @unique
  status            VehicleStatus @default(AVAILABLE)
  mileage           Int
  fuelLevel         Float?
  transmission      TransmissionType
  fuelType          FuelType
  vehicleGroupId    String
  vehicleGroup      VehicleGroup @relation(fields: [vehicleGroupId], references: [id])
  locationId        String
  location          Location     @relation(fields: [locationId], references: [id])
  maintenanceStatus MaintenanceStatus @default(OK)
  lastMaintenance   DateTime?
  nextMaintenance   DateTime?
  images            String[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  isActive          Boolean   @default(true)
  rentals           Rental[]
  nrtEntries        NRTEntry[]
  movements         NonRevenueMovement[]
}

enum VehicleStatus {
  AVAILABLE
  RENTED
  MAINTENANCE
  CLEANING
  TRANSFER
  RESERVED
  OUT_OF_SERVICE
}

enum TransmissionType {
  AUTOMATIC
  MANUAL
}

enum FuelType {
  GASOLINE
  DIESEL
  ELECTRIC
  HYBRID
  PLUGIN_HYBRID
}

enum MaintenanceStatus {
  OK
  DUE_SOON
  OVERDUE
  IN_PROGRESS
}

// Vehicle Group model
model VehicleGroup {
  id          String    @id @default(cuid())
  name        String
  description String?
  category    String
  size        String
  passengers  Int
  luggage     Int
  doors       Int
  features    String[]
  imageUrl    String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  isActive    Boolean   @default(true)
  vehicles    Vehicle[]
  rentalRates RentalRate[]
}

// Location model
model Location {
  id          String    @id @default(cuid())
  name        String
  address     String
  city        String
  state       String?
  zipCode     String
  country     String
  phone       String?
  email       String?
  openingHours Json?
  zoneId      String?
  zone        Zone?      @relation(fields: [zoneId], references: [id])
  isAirport   Boolean    @default(false)
  latitude    Float?
  longitude    Float?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  isActive    Boolean    @default(true)
  vehicles    Vehicle[]
  rentals     Rental[]   @relation("pickupLocation")
  returns     Rental[]   @relation("returnLocation")
  movements   NonRevenueMovement[] @relation("originLocation")
  movementDestinations NonRevenueMovement[] @relation("destinationLocation")
}

// Zone model
model Zone {
  id          String     @id @default(cuid())
  name        String
  description String?
  city        String?
  state       String?
  country     String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  isActive    Boolean    @default(true)
  locations   Location[]
}

// Rental model
model Rental {
  id                String    @id @default(cuid())
  customerId        String
  customer          Customer  @relation(fields: [customerId], references: [id])
  vehicleId         String
  vehicle           Vehicle   @relation(fields: [vehicleId], references: [id])
  startDate         DateTime
  endDate           DateTime
  pickupLocationId  String
  pickupLocation    Location  @relation("pickupLocation", fields: [pickupLocationId], references: [id])
  returnLocationId  String
  returnLocation    Location  @relation("returnLocation", fields: [returnLocationId], references: [id])
  status            RentalStatus @default(RESERVED)
  totalAmount       Float
  paymentStatus     PaymentStatus @default(PENDING)
  additionalOptions AdditionalOptionOnRental[]
  mileageOut        Int?
  mileageIn         Int?
  fuelLevelOut      Float?
  fuelLevelIn       Float?
  notes             String?
  staffId           String?
  staff             User?     @relation(fields: [staffId], references: [id])
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

enum RentalStatus {
  RESERVED
  ACTIVE
  COMPLETED
  CANCELLED
  EXTENDED
  OVERDUE
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIALLY_PAID
  REFUNDED
  FAILED
}

// Additional Options model
model AdditionalOption {
  id          String    @id @default(cuid())
  name        String
  description String?
  price       Float
  type        OptionType
  isRequired  Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  isActive    Boolean   @default(true)
  rentals     AdditionalOptionOnRental[]
}

enum OptionType {
  INSURANCE
  EQUIPMENT
  SERVICE
  FEE
}

// Junction table for Rental and AdditionalOption
model AdditionalOptionOnRental {
  id                String          @id @default(cuid())
  rentalId          String
  rental            Rental          @relation(fields: [rentalId], references: [id])
  additionalOptionId String
  additionalOption  AdditionalOption @relation(fields: [additionalOptionId], references: [id])
  quantity          Int             @default(1)
  price             Float
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@unique([rentalId, additionalOptionId])
}

// Rental Rate model
model RentalRate {
  id              String       @id @default(cuid())
  vehicleGroupId  String
  vehicleGroup    VehicleGroup @relation(fields: [vehicleGroupId], references: [id])
  name            String
  dailyRate       Float
  weeklyRate      Float?
  monthlyRate     Float?
  weekendRate     Float?
  holidayRate     Float?
  mileageLimit    Int?
  overageFee      Float?
  startDate       DateTime?
  endDate         DateTime?
  seasonType      SeasonType   @default(REGULAR)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  isActive        Boolean      @default(true)
}

enum SeasonType {
  REGULAR
  PEAK
  OFF_PEAK
  HOLIDAY
  SPECIAL
}

// Non-Revenue Time (NRT) model
model NRTEntry {
  id          String    @id @default(cuid())
  vehicleId   String
  vehicle     Vehicle   @relation(fields: [vehicleId], references: [id])
  startDate   DateTime
  endDate     DateTime?
  type        NRTType
  reason      String?
  notes       String?
  staffId     String?
  staff       User?     @relation(fields: [staffId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum NRTType {
  MAINTENANCE
  CLEANING
  INSPECTION
  TRANSFER
  ADMINISTRATIVE
  OTHER
}

// Non-Revenue Movement model
model NonRevenueMovement {
  id                  String    @id @default(cuid())
  vehicleId           String
  vehicle             Vehicle   @relation(fields: [vehicleId], references: [id])
  originLocationId    String
  originLocation      Location  @relation("originLocation", fields: [originLocationId], references: [id])
  destinationLocationId String
  destinationLocation Location  @relation("destinationLocation", fields: [destinationLocationId], references: [id])
  departureDate       DateTime
  arrivalDate         DateTime?
  status              MovementStatus @default(SCHEDULED)
  reason              String?
  notes               String?
  driverId            String?
  driver              User?     @relation("Driver", fields: [driverId], references: [id])
  mileageBefore       Int?
  mileageAfter        Int?
  fuelLevelBefore     Float?
  fuelLevelAfter      Float?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

enum MovementStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  DELAYED
}`

// Write the schema file
fs.writeFileSync(schemaPath, schemaContent)

console.log(`Prisma schema created at ${schemaPath}`)
