"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export function TopNavbar() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin" className="font-bold text-xl">
            Car Rental Admin
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
