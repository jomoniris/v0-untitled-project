"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { AdditionalOptionsTable } from "@/components/additional-options-table"
import { fetchAdditionalOptionsData } from "@/app/actions/additional-option-data"
import type { AdditionalOption } from "@/app/actions/additional-option-actions"

export default function AdditionalOptionsPage() {
  const [options, setOptions] = useState<AdditionalOption[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchAdditionalOptionsData()
        if (result.error) {
          setError(result.error)
        } else {
          setOptions(result.options)
        }
      } catch (err) {
        setError("Failed to load additional options")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredOptions =
    activeTab === "all"
      ? options
      : activeTab === "active"
        ? options.filter((option) => option.active)
        : options.filter((option) => !option.active)

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

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 text-center">Error loading additional options: {error}</div>
      ) : (
        <Tabs defaultValue="all" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Options</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Additional Options</CardTitle>
                <CardDescription>View and manage all additional options for rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <AdditionalOptionsTable options={filteredOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Options</CardTitle>
                <CardDescription>View and manage active additional options</CardDescription>
              </CardHeader>
              <CardContent>
                <AdditionalOptionsTable options={filteredOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inactive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inactive Options</CardTitle>
                <CardDescription>View and manage inactive additional options</CardDescription>
              </CardHeader>
              <CardContent>
                <AdditionalOptionsTable options={filteredOptions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
