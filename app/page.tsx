"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User is authenticated on home page, redirecting to /admin")
      router.push("/admin")
    } else if (status === "unauthenticated") {
      console.log("User is unauthenticated on home page, redirecting to /login")
      router.push("/login")
    }
  }, [status, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
