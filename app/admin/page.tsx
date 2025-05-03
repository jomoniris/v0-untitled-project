"use client"

import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"

export default function AdminDashboard() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome, {session?.user?.name || "User"}! Role: {session?.user?.role || "N/A"}
        </p>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Rentals</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Rental #{1000 + i}</p>
                  <p className="text-sm text-gray-500">Customer: John Doe</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Toyota Camry</p>
                  <p className="text-sm text-gray-500">
                    May {i + 1} - May {i + 5}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Vehicle Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p>Available</p>
              <p className="font-medium">18</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Rented</p>
              <p className="font-medium">12</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Maintenance</p>
              <p className="font-medium">3</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Reserved</p>
              <p className="font-medium">5</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
