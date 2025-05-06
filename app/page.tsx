import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Car Rental Admin System</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        Welcome to the car rental administration system. Please click below to access the admin dashboard.
      </p>
      <Button asChild size="lg">
        <Link href="/admin">Go to Admin Dashboard</Link>
      </Button>
    </div>
  )
}
