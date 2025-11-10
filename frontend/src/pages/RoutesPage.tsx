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

      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-xs uppercase tracking-wide">
          <tr>
            <th className="border px-3 py-2">Route Code</th>
            <th className="border px-3 py-2">Origin → Destination</th>
            <th className="border px-3 py-2">Fuel</th>
            <th className="border px-3 py-2">Year</th>
            <th className="border px-3 py-2">Baseline</th>
            <th className="border px-3 py-2"></th>
          </tr>
        </thead>

        <tbody>
          {routes.map((r) => (
            <tr key={r.routeCode} className="hover:bg-gray-50 transition">
              <td className="border px-3 py-2">{r.routeCode}</td>
              <td className="border px-3 py-2">{r.origin} → {r.destination}</td>
              <td className="border px-3 py-2">{r.fuelType}</td>
              <td className="border px-3 py-2">{r.year}</td>
              <td className="border px-3 py-2">{r.is_baseline ? "✅" : "❌"}</td>
              <td className="border px-3 py-2">
                {!r.is_baseline && (
                  <button
                    onClick={() => handleSetBaseline(r.routeCode)}
                    className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
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

