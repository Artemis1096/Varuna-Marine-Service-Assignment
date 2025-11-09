import { useEffect, useState } from "react";
import { RoutesApiAdapter } from "../adapters/outbound/api/RoutesApiAdapter";

export function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRoutes() {
    setLoading(true);
    const data = await RoutesApiAdapter.getRoutes();
    setRoutes(data);
    setLoading(false);
  }

  async function handleSetBaseline(routeCode: string) {
    await RoutesApiAdapter.setBaseline(routeCode);
    await loadRoutes();
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Routes</h1>

      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Route Code</th>
            <th className="p-2 border">Origin → Destination</th>
            <th className="p-2 border">Fuel</th>
            <th className="p-2 border">Year</th>
            <th className="p-2 border">Baseline</th>
            <th className="p-2 border"></th>
          </tr>
        </thead>

        <tbody>
          {routes.map((r) => (
            <tr key={r.routeCode}>
              <td className="p-2 border">{r.routeCode}</td>
              <td className="p-2 border">{r.origin} → {r.destination}</td>
              <td className="p-2 border">{r.fuelType}</td>
              <td className="p-2 border">{r.year}</td>
              <td className="p-2 border">{r.is_baseline ? "✅" : "❌"}</td>
              <td className="p-2 border">
                {!r.is_baseline && (
                  <button
                    onClick={() => handleSetBaseline(r.routeCode)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Set Baseline
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

