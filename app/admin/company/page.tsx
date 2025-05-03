import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company</h1>
        <p className="text-muted-foreground">Manage company settings, locations and staff</p>
      </div>

      <Tabs defaultValue="locations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rental Locations</CardTitle>
              <CardDescription>Manage your rental locations and addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Location management will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Manage employees and access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Staff management will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>Configure company details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center">
                <p className="text-muted-foreground">Company settings will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
