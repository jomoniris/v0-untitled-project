"use client"

import { RentalRateForm } from "@/components/rental-rate-form"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Update the mock data to include common additional options
async function getRateById(id: string) {
  // In a real app, this would be an API call
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

  // Sample data
  const rates = [
    {
      id: "1",
      rateName: "Summer 2023 Special",
      pickupStartDate: "2023-06-01",
      pickupEndDate: "2023-09-30",
      rateZone: "NYC-DOWNTOWN",
      bookingStartDate: "2023-05-01",
      bookingEndDate: "2023-09-15",
      active: true,
      carGroupRates: [
        {
          groupId: "1",
          groupName: "Economy",
          milesPerDay: 150,
          milesRate: 0.25,
          depositRateCDW: 500,
          policyValueCDW: 25.5,
          depositRatePAI: 300,
          policyValuePAI: 15.75,
          depositRateSCDW: 200,
          policyValueSCDW: 35.0,
          depositRateCPP: 100,
          policyValueCPP: 10.25,
          deliveryCharges: 50,
          ratePackage: {
            type: "daily",
            dailyRates: [
              45, 43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23, 21, 19, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
              18, 18, 18, 18,
            ],
          },
          included: true,
        },
        {
          groupId: "2",
          groupName: "Compact",
          milesPerDay: 200,
          milesRate: 0.2,
          depositRateCDW: 600,
          policyValueCDW: 30.0,
          depositRatePAI: 350,
          policyValuePAI: 18.5,
          depositRateSCDW: 250,
          policyValueSCDW: 40.0,
          depositRateCPP: 120,
          policyValueCPP: 12.75,
          deliveryCharges: 60,
          ratePackage: {
            type: "weekly",
            weeklyRate: 299.99,
          },
          included: true,
        },
        {
          groupId: "6",
          groupName: "Premium",
          milesPerDay: 250,
          milesRate: 0.18,
          depositRateCDW: 800,
          policyValueCDW: 45.0,
          depositRatePAI: 450,
          policyValuePAI: 25.0,
          depositRateSCDW: 350,
          policyValueSCDW: 55.0,
          depositRateCPP: 150,
          policyValueCPP: 18.5,
          deliveryCharges: 75,
          ratePackage: {
            type: "monthly",
            monthlyRate: 1299.99,
          },
          included: true,
        },
      ],
      additionalOptions: [
        {
          id: "1",
          code: "GPS",
          description: "GPS Navigation System",
          optionType: "Equipment",
          calculationType: "Daily",
          included: true,
          customerPays: true,
        },
        {
          id: "3",
          code: "CSEAT",
          description: "Child Safety Seat",
          optionType: "Equipment",
          calculationType: "Rental",
          included: true,
          customerPays: false,
        },
        {
          id: "5",
          code: "ROADSIDE",
          description: "Roadside Assistance",
          optionType: "Service",
          calculationType: "Rental",
          included: true,
          customerPays: true,
        },
      ],
    },
    {
      id: "2",
      rateName: "Winter 2023 Promotion",
      pickupStartDate: "2023-12-01",
      pickupEndDate: "2024-02-28",
      rateZone: "NYC-MIDTOWN",
      bookingStartDate: "2023-11-01",
      bookingEndDate: "2024-02-15",
      active: true,
      carGroupRates: [
        {
          groupId: "1",
          groupName: "Economy",
          milesPerDay: 120,
          milesRate: 0.3,
          depositRateCDW: 450,
          policyValueCDW: 22.5,
          depositRatePAI: 250,
          policyValuePAI: 12.25,
          depositRateSCDW: 180,
          policyValueSCDW: 30.0,
          depositRateCPP: 90,
          policyValueCPP: 8.75,
          deliveryCharges: 45,
          ratePackage: {
            type: "daily",
            dailyRates: [
              40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
              15, 15, 15, 15,
            ],
          },
          included: true,
        },
        {
          groupId: "8",
          groupName: "SUV",
          milesPerDay: 180,
          milesRate: 0.25,
          depositRateCDW: 700,
          policyValueCDW: 40.0,
          depositRatePAI: 400,
          policyValuePAI: 22.5,
          depositRateSCDW: 300,
          policyValueSCDW: 50.0,
          depositRateCPP: 130,
          policyValueCPP: 15.25,
          deliveryCharges: 65,
          ratePackage: {
            type: "yearly",
            yearlyRate: 9999.99,
          },
          included: true,
        },
      ],
      additionalOptions: [
        {
          id: "2",
          code: "WIFI",
          description: "Mobile WiFi Hotspot",
          optionType: "Equipment",
          calculationType: "Daily",
          included: true,
          customerPays: true,
        },
        {
          id: "4",
          code: "INSUR",
          description: "Additional Insurance",
          optionType: "Insurance",
          calculationType: "Daily",
          included: true,
          customerPays: false,
        },
      ],
    },
  ]

  return rates.find((rate) => rate.id === id)
}

export default function EditRentalRatePage() {
  const params = useParams()
  const id = params.id as string
  const [rate, setRate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRate() {
      try {
        const data = await getRateById(id)
        if (data) {
          setRate(data)
        } else {
          setError("Rate not found")
        }
      } catch (err) {
        setError("Failed to load rate data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadRate()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Rental Rate</h1>
          <p className="text-muted-foreground">Loading rate data...</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Rental Rate</h1>
        <p className="text-muted-foreground">Update rental rate information</p>
      </div>

      <RentalRateForm initialData={rate} isEditing={true} />
    </div>
  )
}
