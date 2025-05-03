const { execSync } = require("child_process")
const path = require("path")

console.log("Pushing Prisma schema to database...")

try {
  // Run prisma db push
  execSync("npx prisma db push", {
    stdio: "inherit",
    cwd: path.resolve(__dirname, ".."),
  })

  console.log("Schema pushed successfully!")
} catch (error) {
  console.error("Error pushing schema:", error)
  process.exit(1)
}
