"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { LocationForm } from "@/components/location-form"

function ErrorFallbackUI() {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="text-red-600">There was an error loading the location form. Please try refreshing the page.</p>
    </div>
  )
}

export default function NewLocationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Location</h1>
          <p className="text-muted-foreground">Create a new rental location</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/company/locations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Locations
          </Link>
        </Button>
      </div>

      <ErrorBoundary fallback={<ErrorFallbackUI />}>
        <LocationForm />
      </ErrorBoundary>
    </div>
  )
}
