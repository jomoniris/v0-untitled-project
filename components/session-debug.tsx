"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"

export function SessionDebug() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === "loading") {
    return <div>Loading session...</div>
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={() => setIsOpen(!isOpen)} className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
        {isOpen ? "Hide" : "Debug"} Session
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-white border rounded-md shadow-lg max-w-md max-h-96 overflow-auto">
          <h3 className="font-bold mb-2">Session Status: {status}</h3>
          {session ? (
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
          ) : (
            <p>No session data</p>
          )}
          <div className="mt-4">
            <h4 className="font-bold mb-1">Current URL:</h4>
            <p className="text-xs break-all">{window.location.href}</p>
          </div>
        </div>
      )}
    </div>
  )
}
