"use client"

import dynamic from "next/dynamic"
import { ErrorBoundary } from "react-error-boundary"

// Import ZoneForm with no SSR to avoid ref issues
const ZoneForm = dynamic(() => import("@/components/zone-form"), { ssr: false })

function ErrorFallback() {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50">
      <p className="text-red-800">There was an error loading the form. Please try again later.</p>
    </div>
  )
}

export default function NewZonePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Zone</h1>
        <p className="text-muted-foreground">Create a new zone for your rental locations</p>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ZoneForm />
      </ErrorBoundary>
    </div>
  )
}
