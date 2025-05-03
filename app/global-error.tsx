"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Something went wrong!</h2>
            <p className="mt-2 text-sm text-gray-600">A global error occurred. Please try again later.</p>
            <div className="mt-6">
              <button
                onClick={reset}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
