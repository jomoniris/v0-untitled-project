"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
        {session?.user?.name && (
          <p className="text-gray-500">
            Logged in as: {session.user.name} ({session.user.role})
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Vehicles</h3>
          <p className="text-3xl font-bold mt-2">24</p>
          <p className="text-sm text-gray-500 mt-1">3 unavailable</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium">Active Rentals</h3>
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-sm text-gray-500 mt-1">4 due today</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium">Customers</h3>
          <p className="text-3xl font-bold mt-2">156</p>
          <p className="text-sm text-gray-500 mt-1">12 new this month</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium">Revenue</h3>
          <p className="text-3xl font-bold mt-2">$12,450</p>
          <p className="text-sm text-gray-500 mt-1">+8% from last month</p>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <a href="/admin/vehicles" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100">
            <h3 className="font-medium">Manage Vehicles</h3>
            <p className="text-sm text-gray-500">View and edit vehicle inventory</p>
          </a>
          <a href="/admin/rentals" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100">
            <h3 className="font-medium">Manage Rentals</h3>
            <p className="text-sm text-gray-500">Process and track rentals</p>
          </a>
          <a href="/admin/customers" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100">
            <h3 className="font-medium">Manage Customers</h3>
            <p className="text-sm text-gray-500">View customer information</p>
          </a>
        </div>
      </div>
    </div>
  )
}
