import { useEffect, useState } from "react";
import { RoutesApiAdapter } from "../adapters/outbound/api/RoutesApiAdapter";
import { btnPrimary } from "@/shared/styles";

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

  if (loading) return <div className="space-y-6"><div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm text-gray-900 dark:text-gray-100">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Routes</h1>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wide">
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left">Route Code</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left">Vessel Type</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left">Origin → Destination</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right">Distance (km)</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-left">Fuel Type</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right">Fuel Consumption (t)</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right">Year</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right">GHG Intensity</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right">Total Emissions (t)</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center">Baseline</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.routeCode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{r.routeCode}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{r.vesselType || '-'}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{r.origin} → {r.destination}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right text-gray-800 dark:text-gray-200">
                    {r.distance != null ? r.distance.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">{r.fuelType || '-'}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right text-gray-800 dark:text-gray-200">
                    {r.fuelConsumptionTonnes != null ? r.fuelConsumptionTonnes.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '-'}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right text-gray-800 dark:text-gray-200">{r.year || '-'}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right text-gray-800 dark:text-gray-200">
                    {r.ghgIntensity != null ? r.ghgIntensity.toFixed(1) : '-'}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-right text-gray-800 dark:text-gray-200">
                    {r.totalEmissions != null ? r.totalEmissions.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '-'}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center text-gray-800 dark:text-gray-200">
                    {r.is_baseline ? "✅" : "❌"}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 text-center">
                    {!r.is_baseline && (
                      <button
                        onClick={() => handleSetBaseline(r.routeCode)}
                        className={btnPrimary}
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
      </div>
    </div>
  );
}

