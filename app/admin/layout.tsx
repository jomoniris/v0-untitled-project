import type React from "react"
import { TopNavbar } from "@/components/top-navbar"
import { SidebarNav } from "@/components/sidebar-nav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNavbar />
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
