"use client"

import { useEffect, useState } from "react"

export default function DebugPage() {
  const [info, setInfo] = useState({
    pathname: "",
    session: null,
    error: null,
  })

  useEffect(() => {
    // Get current pathname
    setInfo((prev) => ({ ...prev, pathname: window.location.pathname }))

    // Try to fetch session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setInfo((prev) => ({ ...prev, session: data }))
      })
      .catch((err) => {
        setInfo((prev) => ({ ...prev, error: err.message }))
      })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Current Path</h2>
        <pre className="bg-gray-100 p-3 rounded overflow-auto">{info.pathname}</pre>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Session Data</h2>
        <pre className="bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(info.session, null, 2)}</pre>
      </div>

      {info.error && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-2 text-red-600">Error</h2>
          <pre className="bg-red-50 text-red-800 p-3 rounded overflow-auto">{info.error}</pre>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Navigation Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Dashboard
          </a>
          <a href="/admin/fleet" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Fleet
          </a>
          <a href="/admin/vehicles" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Vehicles
          </a>
          <a href="/admin/company/fleet/vehicle-group" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Vehicle Groups
          </a>
          <a href="/admin/fleet/nrt" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Non-Revenue Time
          </a>
          <a href="/admin/fleet/non-revenue-movement" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Non-Revenue Movement
          </a>
          <a href="/admin/rate-and-policies" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Rate & Policies
          </a>
          <a href="/admin/company" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded">
            Company
          </a>
        </div>
      </div>
    </div>
  )
}
