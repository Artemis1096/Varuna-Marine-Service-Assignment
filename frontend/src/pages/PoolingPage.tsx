import { useEffect, useState } from "react";
import { RoutesApiAdapter } from "../adapters/outbound/api/RoutesApiAdapter";
import { PoolingApiAdapter } from "../adapters/outbound/api/PoolingApiAdapter";

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
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Pooling</h1>

      <div className="flex gap-3 items-end">
        <input
          type="text"
          placeholder="Pool Name"
          className="border rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={poolName}
          onChange={(e) => setPoolName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          className="border rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <button
          disabled={selected.length < 2}
          onClick={createPool}
          className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          Create Pool
        </button>
      </div>

      <h2 className="font-medium">Select Pool Members:</h2>

      <div className="grid grid-cols-2 gap-2">
        {routes.map((r) => (
          <label key={r.routeCode} className="flex items-center gap-2 border p-2 rounded">
            <input
              type="checkbox"
              checked={selected.includes(r.routeCode)}
              onChange={() => toggle(r.routeCode)}
            />
            {r.routeCode} — {r.origin} → {r.destination}
          </label>
        ))}
      </div>

      {result && (
        <div className="border p-4 rounded bg-gray-50 space-y-2">
          <h3 className="text-lg font-semibold">Pool Created</h3>
          <p><b>Pool ID:</b> {result.poolId}</p>

          <table className="w-full border-collapse text-sm mt-2">
            <thead className="bg-gray-100 text-xs uppercase tracking-wide">
              <tr>
                <th className="border px-3 py-2">Route</th>
                <th className="border px-3 py-2">CB Before</th>
                <th className="border px-3 py-2">CB After</th>
              </tr>
            </thead>
            <tbody>
              {result.members.map((m: any) => (
                <tr key={m.routeCode} className="hover:bg-gray-50 transition">
                  <td className="border px-3 py-2">{m.routeCode}</td>
                  <td className="border px-3 py-2">{m.cbBefore?.toFixed?.(2)}</td>
                  <td className="border px-3 py-2">{m.cb?.toFixed?.(2) || m.cbAfter?.toFixed?.(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

