"use client"

import dynamic from "next/dynamic"
import { ErrorBoundary } from "react-error-boundary"

// Import with no SSR to avoid ref issues
const LocationForm = dynamic(
  () => import("@/components/location-form").then((mod) => ({ default: mod.LocationForm })),
  {
    ssr: false,
    loading: () => <div className="flex justify-center p-4">Loading form...</div>,
  },
)

function ErrorFallback() {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Location</h1>
        <p className="text-muted-foreground">Create a new rental location</p>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <LocationForm />
      </ErrorBoundary>
    </div>
  )
}
