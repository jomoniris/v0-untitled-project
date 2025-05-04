"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Car, Users, FileText, DollarSign, Building, BarChart2 } from "lucide-react"

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()

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
          title: "Non-Revenue Time",
          href: "/admin/fleet/nrt",
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
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <div key={item.href} className="flex flex-col">
            <Link
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
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
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isSubActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                      )}
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
  )
}
