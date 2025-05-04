"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LogOut, Menu, User, X, Home, Car, Users, FileText, DollarSign, Building, BarChart2 } from "lucide-react"
import { signOut } from "next-auth/react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/admin"

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

  // Define navigation items directly in the layout
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Rentals",
      href: "/admin/rentals",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Fleet",
      href: "/admin/fleet",
      icon: <Car className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "Vehicles",
          href: "/admin/vehicles",
        },
        {
          title: "Vehicle Groups",
          href: "/admin/company/fleet/vehicle-group",
        },
        {
          title: "Non-Revenue Time",
          href: "/admin/fleet/nrt",
        },
        {
          title: "Non-Revenue Movement",
          href: "/admin/fleet/non-revenue-movement",
        },
        {
          title: "Tolls Management",
          href: "/admin/fleet/tolls",
        },
        {
          title: "Traffic Fine",
          href: "/admin/fleet/traffic-fine",
        },
        {
          title: "Parking Management",
          href: "/admin/fleet/parking",
        },
        {
          title: "Utilization",
          href: "/admin/fleet/utilization",
        },
        {
          title: "Settings",
          href: "/admin/fleet/settings",
        },
      ],
    },
    {
      title: "Finance",
      href: "/admin/finance",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "Additional Options",
          href: "/admin/company/finance/additional-options",
        },
      ],
    },
    {
      title: "Rate & Policies",
      href: "/admin/rate-and-policies",
      icon: <FileText className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "Rental Rates",
          href: "/admin/rate-and-policies/rental-rates",
        },
      ],
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Company",
      href: "/admin/company",
      icon: <Building className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "Locations",
          href: "/admin/company/locations",
        },
        {
          title: "Staff",
          href: "/admin/company/staff",
        },
        {
          title: "Settings",
          href: "/admin/company/settings",
        },
      ],
    },
  ]

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
              <span className="font-medium">{session?.user?.name || "Admin User"}</span>
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
                {/* Inline Navigation for Mobile */}
                <nav className="flex flex-col space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                      <div key={item.href} className="flex flex-col">
                        <Link
                          href={item.href}
                          className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                          onClick={() => {
                            if (!item.submenu) setSidebarOpen(false)
                          }}
                        >
                          {item.icon}
                          {item.title}
                        </Link>

                        {item.submenu && isActive && (
                          <div className="ml-6 mt-1 flex flex-col space-y-1">
                            {item.submenu.map((subItem) => {
                              const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)

                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    isSubActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                                  }`}
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  {subItem.title}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-sm h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-4">
            {/* Inline Navigation for Desktop */}
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <div key={item.href} className="flex flex-col">
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      {item.icon}
                      {item.title}
                    </Link>

                    {item.submenu && isActive && (
                      <div className="ml-6 mt-1 flex flex-col space-y-1">
                        {item.submenu.map((subItem) => {
                          const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)

                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                isSubActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
