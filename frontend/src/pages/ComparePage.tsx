import { useEffect, useState } from "react";
import { ComparisonApiAdapter } from "../adapters/outbound/api/ComparisonApiAdapter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export function ComparePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const result = await ComparisonApiAdapter.getComparison();
    setData(result);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div className="p-6">Loading comparison...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">GHG Intensity Comparison</h1>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 text-xs uppercase tracking-wide">
          <tr>
            <th className="border px-3 py-2">Route Code</th>
            <th className="border px-3 py-2">Baseline Intensity</th>
            <th className="border px-3 py-2">Comparison Intensity</th>
            <th className="border px-3 py-2">% Difference</th>
            <th className="border px-3 py-2">Compliant</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.routeCode} className="hover:bg-gray-50 transition">
              <td className="border px-3 py-2">{r.routeCode}</td>
              <td className="border px-3 py-2">{r.baselineIntensity.toFixed(2)}</td>
              <td className="border px-3 py-2">{r.comparisonIntensity.toFixed(2)}</td>
              <td className="border px-3 py-2">{r.percentDiff.toFixed(2)}%</td>
              <td className="border px-3 py-2">{r.compliant ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-medium">Intensity Chart</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="routeCode" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="baselineIntensity" name="Baseline" />
          <Bar dataKey="comparisonIntensity" name="Comparison" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

