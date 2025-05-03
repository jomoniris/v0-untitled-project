"use client"

import { AdditionalOptionForm } from "@/components/additional-option-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Mock API function to get option data
async function getOptionById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const options = [
    {
      id: "1",
      code: "GPS",
      description: "GPS Navigation System",
      optionType: "equipment",
      calculationType: "daily",
      excessWeight: 2,
      active: true,
      mandatorySurcharge: false,
      multipleItems: true,
      primaryTaxExempt: false,
      secondaryTaxExempt: false,
      preventPriceChange: false,
      leasing: false,
      commissionRate: 5,
      printText: "GPS Navigation System",
      printMemo: "Please return the GPS unit with all accessories.",
    },
    {
      id: "2",
      code: "WIFI",
      description: "Mobile WiFi Hotspot",
      optionType: "equipment",
      calculationType: "daily",
      excessWeight: 1,
      active: true,
      mandatorySurcharge: false,
      multipleItems: false,
      primaryTaxExempt: true,
      secondaryTaxExempt: true,
      preventPriceChange: true,
      leasing: false,
      commissionRate: 0,
      printText: "Mobile WiFi Hotspot",
      printMemo: "Unlimited data for the duration of your rental.",
    },
  ]

  return options.find((option) => option.id === id)
}

export default function EditAdditionalOptionPage() {
  const params = useParams()
  const id = params.id as string
  const [option, setOption] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOption() {
      try {
        const data = await getOptionById(id)
        if (data) {
          setOption(data)
        } else {
          setError("Option not found")
        }
      } catch (err) {
        setError("Failed to load option data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadOption()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Option</h1>
          <p className="text-muted-foreground">Loading option data...</p>
        </div>
      </div>
    )
  }

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
