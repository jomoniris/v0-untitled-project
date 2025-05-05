"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Plus } from "lucide-react"

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">Manage your rental locations and zones</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/company/locations/zone">
              <MapPin className="mr-2 h-4 w-4" />
              Manage Zones
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/company/locations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Locations</h2>
        <p className="text-gray-500 mb-4">
          This is a simplified version of the locations page. The full functionality has been temporarily disabled to
          resolve deployment issues.
        </p>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            We're working on restoring the full functionality of this page. Please check back later.
          </p>
        </div>
      </div>
    </div>
  )
}
