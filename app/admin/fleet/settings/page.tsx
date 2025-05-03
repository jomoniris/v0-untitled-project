import { FleetMenu } from "@/components/fleet-menu"

export default function FleetSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Settings</h1>
        <p className="text-muted-foreground">Configure fleet management settings</p>
      </div>

      <FleetMenu />

      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">Settings module coming soon</p>
      </div>
    </div>
  )
}
