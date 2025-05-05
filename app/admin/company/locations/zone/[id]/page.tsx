// Update the imports to include the server action
import { getZoneById } from "@/app/actions/zone-actions"
import { ZoneForm } from "@/components/zone-form"

// Replace the mock getZoneById function and useEffect with this implementation
export default async function EditZonePage({ params }: { params: { id: string } }) {
  const id = params.id
  const { zone, error } = await getZoneById(id)

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!zone) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zone Not Found</h1>
          <p className="text-muted-foreground">The requested zone could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Zone</h1>
        <p className="text-muted-foreground">Update zone information</p>
      </div>

      <ZoneForm initialData={zone} isEditing={true} />
    </div>
  )
}
