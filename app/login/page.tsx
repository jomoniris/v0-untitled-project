import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Car Rental Admin",
  description: "Login to the Car Rental Admin Panel",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <LoginForm />

        {/* Debug information */}
        <div className="mt-8 text-xs text-gray-500 p-4 bg-gray-100 rounded">
          <p>Debug Info:</p>
          <p>Current URL: {typeof window !== "undefined" ? window.location.href : "Server rendering"}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}
