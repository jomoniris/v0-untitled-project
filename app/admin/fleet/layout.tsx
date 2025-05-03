import type React from "react"
import { FleetMenu } from "@/components/fleet-menu"

export default function FleetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <FleetMenu />
      {children}
    </div>
  )
}
