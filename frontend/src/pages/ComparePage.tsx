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

      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Route Code</th>
            <th className="p-2 border">Baseline Intensity</th>
            <th className="p-2 border">Comparison Intensity</th>
            <th className="p-2 border">% Difference</th>
            <th className="p-2 border">Compliant</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.routeCode}>
              <td className="p-2 border">{r.routeCode}</td>
              <td className="p-2 border">{r.baselineIntensity.toFixed(2)}</td>
              <td className="p-2 border">{r.comparisonIntensity.toFixed(2)}</td>
              <td className="p-2 border">{r.percentDiff.toFixed(2)}%</td>
              <td className="p-2 border">{r.compliant ? "✅" : "❌"}</td>
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

