import type React from "react"
import { TopNavbar } from "@/components/top-navbar"
import { Toaster } from "@/components/toaster"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <Toaster />
    </div>
  )
}
