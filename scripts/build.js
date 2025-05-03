const { execSync } = require("child_process")

// Run prisma generate
console.log("Generating Prisma Client...")
try {
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("Prisma Client generated successfully!")
} catch (error) {
  console.error("Failed to generate Prisma Client:", error)
  process.exit(1)
}

// Run Next.js build
console.log("Building Next.js application...")
try {
  execSync("next build", { stdio: "inherit" })
  console.log("Next.js build completed successfully!")
} catch (error) {
  console.error("Failed to build Next.js application:", error)
  process.exit(1)
}
