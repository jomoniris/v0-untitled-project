import { AdditionalOptionForm } from "@/components/additional-option-form"
import { getAdditionalOptionById } from "@/app/actions/additional-option-actions"
import { notFound } from "next/navigation"

export default async function EditAdditionalOptionPage({ params }: { params: { id: string } }) {
  const { option, error } = await getAdditionalOptionById(params.id)

  if (error || !option) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Option</h1>
        <p className="text-muted-foreground">Update option information</p>
      </div>

      <AdditionalOptionForm initialData={option} isEditing={true} />
    </div>
  )
}
