"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User is authenticated on home page, redirecting to /admin")
      // Use window.location for a hard redirect
      window.location.href = "/admin"
    } else if (status === "unauthenticated") {
      console.log("User is unauthenticated on home page, redirecting to /login")
      // Use window.location for a hard redirect
      window.location.href = "/login"
    }
  }, [status, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
        <p className="mt-2 text-sm text-gray-500">Authentication status: {status}</p>
      </div>
    </div>
  )
}
