"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Settings, Clock, BarChart3, Layers } from "lucide-react"

interface FleetMenuItemProps {
  href: string
  icon: React.ReactNode
  title: string
  active?: boolean
}

function FleetMenuItem({ href, icon, title, active }: FleetMenuItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
        active ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted",
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  )
}

export function FleetMenu() {
  const pathname = usePathname()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 className="text-sm font-medium mb-3">Fleet Management</h3>
      <div className="flex flex-wrap gap-2">
        <FleetMenuItem
          href="/admin/vehicles"
          icon={<Layers className="h-4 w-4" />}
          title="Vehicles"
          active={pathname === "/admin/vehicles"}
        />
        <FleetMenuItem
          href="/admin/company/fleet/vehicle-group"
          icon={<Layers className="h-4 w-4" />}
          title="Vehicle Groups"
          active={pathname === "/admin/company/fleet/vehicle-group"}
        />
        <FleetMenuItem
          href="/admin/fleet/nrt"
          icon={<Clock className="h-4 w-4" />}
          title="Non-Revenue Time"
          active={pathname === "/admin/fleet/nrt"}
        />
        <FleetMenuItem
          href="/admin/fleet/utilization"
          icon={<BarChart3 className="h-4 w-4" />}
          title="Utilization"
          active={pathname === "/admin/fleet/utilization"}
        />
        <FleetMenuItem
          href="/admin/fleet/settings"
          icon={<Settings className="h-4 w-4" />}
          title="Settings"
          active={pathname === "/admin/fleet/settings"}
        />
      </div>
    </div>
  )
}
