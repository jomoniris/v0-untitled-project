"use client"

export default function FleetSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Settings</h1>
        <p className="text-muted-foreground">Configure your fleet management settings</p>
      </div>

      <div className="rounded-md border p-4">
        <p className="text-center text-muted-foreground">
          Fleet settings are temporarily unavailable. Please check back later.
        </p>
      </div>
    </div>
  )
}
