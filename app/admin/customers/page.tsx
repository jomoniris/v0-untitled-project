import { CustomersTable } from "@/components/customers-table"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage customer accounts and information</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search customers..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
          <Button variant="outline">Export</Button>
        </div>
      </div>
      <CustomersTable />
    </div>
  )
}
