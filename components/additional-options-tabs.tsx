"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdditionalOptionsTable } from "@/components/additional-options-table"
import type { AdditionalOption } from "@/app/actions/additional-option-actions"

export function AdditionalOptionsTabs({ options }: { options: AdditionalOption[] }) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredOptions =
    activeTab === "all"
      ? options
      : activeTab === "active"
        ? options.filter((option) => option.active)
        : options.filter((option) => !option.active)

  return (
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
  )
}
