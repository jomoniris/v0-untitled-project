"use client"

import { useSearchParams } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  )
}
