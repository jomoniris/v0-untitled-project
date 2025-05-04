"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin/rate-and-policies/rental-rates")
  }, [router])

  // Return a loading state or empty div while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Redirecting to Rental Rates...</p>
    </div>
  )
}
