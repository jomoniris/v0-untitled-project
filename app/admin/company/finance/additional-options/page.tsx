import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AdditionalOptionsTabs } from "@/components/additional-options-tabs"
import { getAdditionalOptions } from "@/app/actions/additional-option-actions"

export default async function AdditionalOptionsPage() {
  const { options, error } = await getAdditionalOptions()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Additional Options</h1>
          <p className="text-muted-foreground">Manage additional options for rentals</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/company/finance/additional-options/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Link>
          </Button>
        </div>
      </div>

      <div>
        {error ? (
          <div className="text-red-500 p-4 text-center">Error loading additional options: {error}</div>
        ) : (
          <AdditionalOptionsTabs options={options} />
        )}
      </div>
    </div>
  )
}
