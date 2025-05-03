import Link from "next/link"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TopNavbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <div className="rounded-md bg-slate-900 p-1 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" />
              <path d="M6 17h9" />
              <path d="M19 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              <path d="M6 17a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
          </div>
          <span className="hidden md:inline-block">Car Rental Hub</span>
        </Link>

        <nav className="ml-8 hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="text-sm font-medium h-8 px-2 py-0 flex items-center gap-1">
                Rate And Policies
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/admin/rate-and-policies/rental-rates">Rental Rates</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/rate-and-policies/policies">Policies</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/rate-and-policies/terms">Terms & Conditions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/rate-and-policies/discounts">Discounts</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="text-sm font-medium h-8 px-2 py-0 flex items-center gap-1">
                Company
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Locations</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/company/locations">Manage Locations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/company/locations/zone">Manage Zones</Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Finance</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/company/finance/additional-options">Additional Options</Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Fleet</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/company/fleet/vehicle-group">Vehicle Groups</Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem asChild>
                <Link href="/admin/company/staff">Staff</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/company/settings">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/secure-admin-interface.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
