import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getAdditionalOptionById } from "@/app/actions/additional-option-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Edit } from "lucide-react"

export default async function ViewAdditionalOptionPage({ params }: { params: { id: string } }) {
  const { option, error } = await getAdditionalOptionById(params.id)

  if (error || !option) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{option.code}</h1>
          <p className="text-muted-foreground">{option.description}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/company/finance/additional-options/${option.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Option
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Option Details</CardTitle>
          <CardDescription>View detailed information about this additional option</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
                <p className="text-base">{option.code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base">{option.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Option Type</h3>
                <p className="text-base capitalize">{option.optionType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Calculation Type</h3>
                <p className="text-base capitalize">{option.calculationType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Excess Weight</h3>
                <p className="text-base">{option.excessWeight}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Limitation Type</h3>
                <p className="text-base capitalize">{option.limitationType || "None"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Minimum Charge</h3>
                <p className="text-base">{option.minimumCharge ? `$${option.minimumCharge.toFixed(2)}` : "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Maximum Charge</h3>
                <p className="text-base">{option.maximumCharge ? `$${option.maximumCharge.toFixed(2)}` : "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Replacement Fee</h3>
                <p className="text-base">{option.replacementFee ? `$${option.replacementFee.toFixed(2)}` : "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Nominal Account</h3>
                <p className="text-base">{option.nominalAccount || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <p
                  className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    option.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {option.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Mandatory Surcharge</h3>
                <p
                  className={`inline-flex px-2 py-1 rounded-full text-xs ${
                    option.mandatorySurcharge ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {option.mandatorySurcharge ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Multiple Items</h4>
                <p className="text-base">{option.multipleItems ? "Yes" : "No"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Primary Tax Exempt</h4>
                <p className="text-base">{option.primaryTaxExempt ? "Yes" : "No"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Secondary Tax Exempt</h4>
                <p className="text-base">{option.secondaryTaxExempt ? "Yes" : "No"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Prevent Price Change</h4>
                <p className="text-base">{option.preventPriceChange ? "Yes" : "No"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Leasing</h4>
                <p className="text-base">{option.leasing ? "Yes" : "No"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Commission Rate</h4>
                <p className="text-base">{option.commissionRate ? `${option.commissionRate}%` : "N/A"}</p>
              </div>
            </div>
          </div>

          {(option.printText || option.printMemo) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Print Options</h3>
                {option.printText && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Print Text</h4>
                    <p className="text-base">{option.printText}</p>
                  </div>
                )}
                {option.printMemo && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Print Memo</h4>
                    <p className="text-base whitespace-pre-wrap">{option.printMemo}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
