"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Car, Users, FileText, CreditCard, Building, BarChart } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart,
  },
  {
    title: "Rentals",
    href: "/admin/rentals",
    icon: Car,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Vehicles",
    href: "/admin/vehicles",
    icon: Car,
  },
  {
    title: "Fleet",
    href: "/admin/fleet",
    icon: Car,
  },
  {
    title: "Company",
    href: "/admin/company",
    icon: Building,
  },
  {
    title: "Rates & Policies",
    href: "/admin/rate-and-policies",
    icon: FileText,
  },
  {
    title: "Finance",
    href: "/admin/finance",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-gray-50 border-r h-[calc(100vh-4rem)] p-4 hidden md:block">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-sm font-medium",
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
                ? "bg-gray-200 text-gray-900"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
