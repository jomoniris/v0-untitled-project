export default function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the Car Rental Admin Dashboard</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Vehicles</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your vehicle fleet</p>
            <a href="/admin/vehicles" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500">
              View vehicles →
            </a>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Customers</h3>
            <p className="mt-1 text-sm text-gray-500">Manage customer accounts</p>
            <a href="/admin/customers" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500">
              View customers →
            </a>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Rentals</h3>
            <p className="mt-1 text-sm text-gray-500">Manage rental bookings</p>
            <a href="/admin/rentals" className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500">
              View rentals →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
