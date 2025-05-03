import { FleetMenu } from "@/components/fleet-menu"

export default function UtilizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fleet Utilization</h1>
        <p className="text-muted-foreground">Track and analyze your fleet utilization metrics</p>
      </div>

      <FleetMenu />

      <div className="flex items-center justify-center h-64 border rounded-lg">
        <p className="text-muted-foreground">Utilization module coming soon</p>
      </div>
    </div>
  )
}
