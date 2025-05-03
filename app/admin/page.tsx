import { redirect } from "next/navigation"

export default function AdminPage() {
  // Simple redirect to dashboard
  redirect("/admin/dashboard")
}
