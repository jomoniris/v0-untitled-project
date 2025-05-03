const { execSync } = require("child_process")
const path = require("path")

console.log("Pushing complete Prisma schema to database...")

try {
  // Force push the schema (this will create all tables)
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env },
  })

  console.log("Complete schema pushed successfully!")
} catch (error) {
  console.error("Error pushing schema:", error)
  process.exit(1)
}
