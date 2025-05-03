import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If authenticated, redirect to dashboard
  if (session) {
    redirect("/admin/dashboard")
  }

  // Otherwise redirect to login
  redirect("/login")
}
