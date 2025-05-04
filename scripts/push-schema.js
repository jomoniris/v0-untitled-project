const { execSync } = require("child_process")
const path = require("path")

console.log("Pushing Prisma schema to database...")

try {
  // Explicitly specify the schema path
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma")

  execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, {
    stdio: "inherit",
    env: { ...process.env },
  })

  console.log("Schema pushed successfully!")
} catch (error) {
  console.error("Error pushing schema:", error)
  process.exit(1)
}
