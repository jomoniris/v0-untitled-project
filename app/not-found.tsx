import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-sm text-gray-600">The page you are looking for does not exist.</p>
        <div className="mt-6">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
