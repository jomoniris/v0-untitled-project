const { execSync } = require("child_process")
const { PrismaClient } = require("@prisma/client")

async function main() {
  try {
    console.log("Starting schema update...")

    // Deploy the schema changes directly to the database
    console.log("Deploying schema changes...")
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" })

    console.log("Schema updated successfully!")

    // Generate Prisma client
    console.log("Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    console.log("Process completed successfully!")
  } catch (error) {
    console.error("Error updating schema:", error)
    process.exit(1)
  }
}

main()
