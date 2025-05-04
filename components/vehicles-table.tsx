"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Define the vehicle data type
type Vehicle = {
  id: string
  licensePlate: string
  make: string
  model: string
  year: string
  status: "available" | "rented" | "maintenance" | "cleaning" | "transit"
  location: string
  vehicleGroup: string
  mileage: string
}

// Sample data
const data: Vehicle[] = [
  {
    id: "1",
    licensePlate: "ABC-1234",
    make: "Toyota",
    model: "Camry",
    year: "2023",
    status: "available",
    location: "Downtown Office",
    vehicleGroup: "Mid-size",
    mileage: "15000",
  },
  {
    id: "2",
    licensePlate: "DEF-5678",
    make: "Honda",
    model: "Civic",
    year: "2022",
    status: "rented",
    location: "Airport Terminal 1",
    vehicleGroup: "Compact",
    mileage: "8500",
  },
  {
    id: "3",
    licensePlate: "GHI-9012",
    make: "Ford",
    model: "Explorer",
    year: "2023",
    status: "maintenance",
    location: "North City Branch",
    vehicleGroup: "SUV",
    mileage: "12300",
  },
  {
    id: "4",
    licensePlate: "JKL-3456",
    make: "BMW",
    model: "3 Series",
    year: "2022",
    status: "available",
    location: "Downtown Office",
    vehicleGroup: "Luxury",
    mileage: "9800",
  },
  {
    id: "5",
    licensePlate: "MNO-7890",
    make: "Chevrolet",
    model: "Malibu",
    year: "2021",
    status: "cleaning",
    location: "South City Branch",
    vehicleGroup: "Mid-size",
    mileage: "22500",
  },
  {
    id: "6",
    licensePlate: "PQR-1234",
    make: "Nissan",
    model: "Rogue",
    year: "2023",
    status: "available",
    location: "Airport Terminal 2",
    vehicleGroup: "SUV",
    mileage: "5600",
  },
  {
    id: "7",
    licensePlate: "STU-5678",
    make: "Hyundai",
    model: "Elantra",
    year: "2022",
    status: "rented",
    location: "West Mall Kiosk",
    vehicleGroup: "Compact",
    mileage: "11200",
  },
  {
    id: "8",
    licensePlate: "VWX-9012",
    make: "Mercedes-Benz",
    model: "E-Class",
    year: "2023",
    status: "available",
    location: "Downtown Office",
    vehicleGroup: "Luxury",
    mileage: "7300",
  },
  {
    id: "9",
    licensePlate: "YZA-3456",
    make: "Kia",
    model: "Sorento",
    year: "2022",
    status: "transit",
    location: "North City Branch",
    vehicleGroup: "SUV",
    mileage: "14700",
  },
  {
    id: "10",
    licensePlate: "BCD-7890",
    make: "Volkswagen",
    model: "Jetta",
    year: "2021",
    status: "available",
    location: "South City Branch",
    vehicleGroup: "Compact",
    mileage: "19200",
  },
]

// Helper function for status badge
function getStatusBadge(status: Vehicle["status"]) {
  const statusConfig = {
    available: { label: "Available", variant: "success" },
    rented: { label: "Rented", variant: "default" },
    maintenance: { label: "Maintenance", variant: "destructive" },
    cleaning: { label: "Cleaning", variant: "warning" },
    transit: { label: "In Transit", variant: "secondary" },
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={
        config.variant === "success"
          ? "default"
          : config.variant === "warning"
            ? "outline"
            : config.variant === "destructive"
              ? "destructive"
              : "secondary"
      }
      className={
        config.variant === "success"
          ? "bg-green-500 hover:bg-green-600"
          : config.variant === "warning"
            ? "border-yellow-500 text-yellow-500 hover:bg-yellow-50"
            : ""
      }
    >
      {config.label}
    </Badge>
  )
}

// Define the columns
const columns: ColumnDef<Vehicle>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "licensePlate",
    header: "License Plate",
    cell: ({ row }) => (
      <Link href={`/admin/vehicles/${row.original.id}/view`} className="font-medium hover:underline">
        {row.getValue("licensePlate")}
      </Link>
    ),
  },
  {
    accessorKey: "make",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Make
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "vehicleGroup",
    header: "Vehicle Group",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/vehicles/${vehicle.id}/view`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/vehicles/${vehicle.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function VehiclesTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter by license plate..."
          value={(table.getColumn("licensePlate")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("licensePlate")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "available"}
                onCheckedChange={() => table.getColumn("status")?.setFilterValue("available")}
              >
                Available
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "rented"}
                onCheckedChange={() => table.getColumn("status")?.setFilterValue("rented")}
              >
                Rented
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "maintenance"}
                onCheckedChange={() => table.getColumn("status")?.setFilterValue("maintenance")}
              >
                Maintenance
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "cleaning"}
                onCheckedChange={() => table.getColumn("status")?.setFilterValue("cleaning")}
              >
                Cleaning
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={table.getColumn("status")?.getFilterValue() === "transit"}
                onCheckedChange={() => table.getColumn("status")?.setFilterValue("transit")}
              >
                In Transit
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => table.getColumn("status")?.setFilterValue(null)}>
                Clear Filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No vehicles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
