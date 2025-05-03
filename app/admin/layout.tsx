import type React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LogOut, Menu, User } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Menu className="h-6 w-6 mr-3 md:hidden" />
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Car Rental Admin
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="hidden md:inline">Logged in as </span>
              <span className="font-medium">{session.user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <Link
                href="/api/auth/signout"
                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign out</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-sm h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/vehicles" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link href="/admin/rentals" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Rentals
                </Link>
              </li>
              <li>
                <Link href="/admin/customers" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Customers
                </Link>
              </li>
              <li>
                <Link href="/admin/rate-and-policies" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Rates & Policies
                </Link>
              </li>
              <li>
                <Link href="/admin/fleet" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Fleet Management
                </Link>
              </li>
              <li>
                <Link href="/admin/company" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Company
                </Link>
              </li>
              <li>
                <Link href="/admin/reports" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                  Reports
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
