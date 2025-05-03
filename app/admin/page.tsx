import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Welcome, {session.user.name || session.user.email}</h2>
        <p className="text-gray-600">Role: {session.user.role}</p>
        <div className="mt-4">
          <p>You have successfully logged in to the Car Rental Admin Module.</p>
        </div>
        <div className="mt-6">
          <a href="/api/auth/signout" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Sign Out
          </a>
        </div>
      </div>
    </div>
  )
}
