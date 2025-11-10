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

  if (loading) return <div className="space-y-6"><div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm text-gray-900 dark:text-gray-100">Loading comparison...</div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">GHG Intensity Comparison</h1>
      
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wide">
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">Route Code</th>
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">Baseline Intensity</th>
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">Comparison Intensity</th>
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">% Difference</th>
              <th className="border border-gray-200 dark:border-gray-600 px-3 py-2">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.routeCode} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{r.routeCode}</td>
                <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{r.baselineIntensity.toFixed(2)}</td>
                <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{r.comparisonIntensity.toFixed(2)}</td>
                <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{r.percentDiff.toFixed(2)}%</td>
                <td className="border border-gray-200 dark:border-gray-600 px-3 py-2 font-medium text-gray-800 dark:text-gray-200">{r.compliant ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-colors">
        <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Intensity Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
            <XAxis dataKey="routeCode" stroke="#6b7280" className="dark:stroke-gray-400" />
            <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
            <Legend />
            <Bar dataKey="baselineIntensity" name="Baseline" fill="#3b82f6" />
            <Bar dataKey="comparisonIntensity" name="Comparison" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

