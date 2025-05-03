import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { AdditionalOptionsTable } from "@/components/additional-options-table"

export default function AdditionalOptionsPage() {
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
              <AdditionalOptionsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
