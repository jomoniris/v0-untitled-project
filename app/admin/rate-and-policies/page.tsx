import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ChevronRight } from "lucide-react"

export default function RateAndPoliciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rates & Policies</h1>
        <p className="text-muted-foreground">Manage your rental rates and company policies</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Rental Rates</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Manage rental rates for different vehicle groups and periods
            </CardDescription>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/rate-and-policies/rental-rates" className="flex justify-between items-center">
                <span>View Rental Rates</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Policies</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Manage company policies, terms and conditions</CardDescription>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/rate-and-policies/policies" className="flex justify-between items-center">
                <span>View Policies</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Rate Zones</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">Manage geographical rate zones for pricing</CardDescription>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/rate-and-policies/rate-zones" className="flex justify-between items-center">
                <span>View Rate Zones</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
