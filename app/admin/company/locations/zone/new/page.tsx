"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewZonePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Zone</h1>
          <p className="text-muted-foreground">Create a new rental zone</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/company/locations/zone">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Zones
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">New Zone Form</h2>
        <p className="text-gray-500 mb-4">
          This is a simplified version of the new zone page. The full functionality has been temporarily disabled to
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
