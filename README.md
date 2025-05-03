# Car Rental Admin Module

A comprehensive admin module for managing a car rental business, including vehicles, customers, rentals, locations, and more.

## Features

- Vehicle management
- Customer management
- Rental booking and tracking
- Location and zone management
- Staff management
- Vehicle group management
- Rental rates management
- Additional options management
- Non-revenue time tracking
- Non-revenue movement tracking
- Reports and analytics

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js for authentication
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/car-rental-admin.git
cd car-rental-admin
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Copy the `.env.example` file to `.env` and update the values:

\`\`\`bash
cp .env.example .env
\`\`\`

Update the `DATABASE_URL` with your PostgreSQL connection string.

4. Set up the database:

\`\`\`bash
# Push the schema to your database
npm run db:push

# Seed the database with initial data
npm run db:setup
\`\`\`

5. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Users

After running the database setup, the following users will be available:

- Admin:
  - Email: admin@example.com
  - Password: admin123

- Manager:
  - Email: manager@example.com
  - Password: manager123

- Staff:
  - Email: staff@example.com
  - Password: staff123

## Database Schema

The database schema includes the following models:

- User (Staff)
- Customer
- Vehicle
- VehicleGroup
- Location
- Zone
- Rental
- AdditionalOption
- RentalRate
- NRTEntry (Non-Revenue Time)
- NonRevenueMovement

## Deployment

### Vercel

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the environment variables
4. Deploy

### Database

For the database, you can use:

- Vercel Postgres
- Neon
- Supabase
- Any other PostgreSQL provider

Make sure to update the `DATABASE_URL` environment variable with your production database connection string.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
\`\`\`

This completes the implementation of the Car Rental Admin Module with database models, business logic, PostgreSQL integration, and CRUD operations. The project is now ready for deployment.

To get started:

1. Set up your PostgreSQL database
2. Configure your environment variables in `.env`
3. Run `npm install` to install dependencies
4. Run `npm run db:push` to create the database schema
5. Run `npm run db:setup` to seed the database with initial data
6. Run `npm run dev` to start the development server

The application will be accessible at http://localhost:3000, and you can log in with the default admin credentials (admin@example.com / admin123).
