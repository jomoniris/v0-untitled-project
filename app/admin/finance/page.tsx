import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">Manage revenue, expenses and financial reports</p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue breakdown for the current year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Revenue data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Tracking</CardTitle>
              <CardDescription>Monthly expense breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Expense data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>View and manage customer invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Invoice list will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Financial reports will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
