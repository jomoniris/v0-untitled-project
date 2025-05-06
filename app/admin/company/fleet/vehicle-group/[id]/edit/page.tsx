import { VehicleGroupForm } from "@/components/vehicle-group-form"
import { getVehicleGroupById } from "@/app/actions/vehicle-group-actions"
import { notFound } from "next/navigation"

export default async function EditVehicleGroupPage({ params }: { params: { id: string } }) {
  const { group, error } = await getVehicleGroupById(params.id)

  if (error || !group) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Vehicle Group</h1>
        <p className="text-muted-foreground">Update vehicle group information</p>
      </div>

      <VehicleGroupForm initialData={group} isEditing={true} />
    </div>
  )
}
