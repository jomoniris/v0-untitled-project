import { NRTForm } from "@/components/nrt-form"
import { FleetMenu } from "@/components/fleet-menu"

export default function NewNRTPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create NRT Entry</h1>
        <p className="text-muted-foreground">Record a new non-revenue time period for a vehicle</p>
      </div>

      <FleetMenu />

      <NRTForm />
    </div>
  )
}
