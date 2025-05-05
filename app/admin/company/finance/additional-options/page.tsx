import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { AdditionalOptionsTable } from "@/components/additional-options-table"
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

      <Tabs defaultValue="all" className="space-y-4">
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
              {error ? (
                <div className="text-red-500 p-4 text-center">Error loading additional options: {error}</div>
              ) : (
                <AdditionalOptionsTable options={options} />
              )}
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
              {error ? (
                <div className="text-red-500 p-4 text-center">Error loading additional options: {error}</div>
              ) : (
                <AdditionalOptionsTable options={options.filter((option) => option.active)} />
              )}
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
              {error ? (
                <div className="text-red-500 p-4 text-center">Error loading additional options: {error}</div>
              ) : (
                <AdditionalOptionsTable options={options.filter((option) => !option.active)} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
