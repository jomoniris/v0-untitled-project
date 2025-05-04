"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LogOut, Menu, User, X } from "lucide-react"
import { signOut } from "next-auth/react"
import { SidebarNav } from "@/components/sidebar-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("User is unauthenticated in admin layout, redirecting to /login")
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mr-3">
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/admin" className="text-xl font-bold">
              Car Rental Admin
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="hidden md:inline">Logged in as </span>
              <span className="font-medium">{session?.user?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 overflow-y-auto">
              <div className="p-4">
                <SidebarNav />
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-sm h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            <SidebarNav />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
