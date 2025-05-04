import { FleetMenu } from "@/components/fleet-menu"

export default function FleetPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Fleet Management</h1>

      <FleetMenu />

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Fleet Overview</h2>
        <p className="text-gray-600 mb-4">
          Welcome to the Fleet Management dashboard. Use the menu above to navigate to different fleet management
          sections.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Total Vehicles</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Available</h3>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">In Maintenance</h3>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Reserved</h3>
            <p className="text-2xl font-bold">2</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Out of Service</h3>
            <p className="text-2xl font-bold">1</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Utilization Rate</h3>
            <p className="text-2xl font-bold">78%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
