"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Car, Users, Calendar, FileText, DollarSign, Building } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Vehicles", href: "/admin/vehicles", icon: Car },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Rentals", href: "/admin/rentals", icon: Calendar },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Finance", href: "/admin/finance", icon: DollarSign },
    {
      name: "Fleet",
      href: "/admin/fleet",
      icon: Car,
      submenu: [
        { name: "NRT", href: "/admin/fleet/nrt" },
        { name: "Utilization", href: "/admin/fleet/utilization" },
        { name: "Maintenance", href: "/admin/fleet/maintenance" },
        { name: "Non-Revenue Movement", href: "/admin/fleet/non-revenue-movement" },
      ],
    },
    {
      name: "Company",
      href: "/admin/company",
      icon: Building,
      submenu: [
        { name: "Staff", href: "/admin/company/staff" },
        { name: "Locations", href: "/admin/company/locations" },
        { name: "Fleet", href: "/admin/company/fleet" },
      ],
    },
    {
      name: "Rate & Policies",
      href: "/admin/rate-and-policies",
      icon: FileText,
      submenu: [{ name: "Rental Rates", href: "/admin/rate-and-policies/rental-rates" }],
    },
  ]

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">Car Rental Admin</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const ItemIcon = item.icon

                return (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={`${
                        isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <ItemIcon
                        className={`${
                          isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                        } mr-3 flex-shrink-0 h-6 w-6`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>

                    {item.submenu && isActive && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subitem) => {
                          const isSubActive = pathname === subitem.href || pathname.startsWith(`${subitem.href}/`)

                          return (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              className={`${
                                isSubActive
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
                              } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                            >
                              {subitem.name}
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
    </div>
  )
}
