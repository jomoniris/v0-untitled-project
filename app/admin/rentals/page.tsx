import { RentalsTable } from "@/components/rentals-table"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function RentalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rentals</h1>
          <p className="text-muted-foreground">View and manage all rental bookings</p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      <RentalsTable />
    </div>
  )
}
