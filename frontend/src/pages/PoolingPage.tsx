import { useEffect, useState } from "react";
import { RoutesApiAdapter } from "../adapters/outbound/api/RoutesApiAdapter";
import { PoolingApiAdapter } from "../adapters/outbound/api/PoolingApiAdapter";
import { btnPrimary } from "@/shared/styles";

export function PoolingPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [poolName, setPoolName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    RoutesApiAdapter.getRoutes().then(setRoutes);
  }, []);

  function toggle(routeCode: string) {
    setSelected((prev) =>
      prev.includes(routeCode) ? prev.filter((c) => c !== routeCode) : [...prev, routeCode]
    );
  }

  async function createPool() {
    const res = await PoolingApiAdapter.createPool(poolName, Number(year), selected);
    setResult(res);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Pooling</h1>
      
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-6 transition-colors">
        <div className="flex gap-3 items-end">
          <input
            type="text"
            placeholder="Pool Name"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={poolName}
            onChange={(e) => setPoolName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <button
            disabled={selected.length < 2}
            onClick={createPool}
            className={`${btnPrimary} disabled:opacity-50`}
          >
            Create Pool
          </button>
        </div>

        <div>
          <h2 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Select Pool Members:</h2>
          <div className="grid grid-cols-2 gap-2">
            {routes.map((r) => (
              <label key={r.routeCode} className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(r.routeCode)}
                  onChange={() => toggle(r.routeCode)}
                  className="cursor-pointer"
                />
                {r.routeCode} — {r.origin} → {r.destination}
              </label>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-4 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pool Created</h3>
          <p className="text-gray-900 dark:text-gray-100"><b>Pool ID:</b> {result.poolId}</p>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wide">
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">Route</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">CB Before</th>
                <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">CB After</th>
              </tr>
            </thead>
            <tbody>
              {result.members.map((m: any) => (
                <tr key={m.routeCode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{m.routeCode}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{m.cbBefore?.toFixed?.(2)}</td>
                  <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{m.cb?.toFixed?.(2) || m.cbAfter?.toFixed?.(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

