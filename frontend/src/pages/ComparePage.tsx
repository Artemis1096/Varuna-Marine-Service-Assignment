import { useEffect, useState } from "react";
import { ComparisonApiAdapter } from "../adapters/outbound/api/ComparisonApiAdapter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ } from "@/shared/constants/fuelEU";
import { ErrorBanner, Loading } from "@/ui/components";
import {
  pageContainer,
  sectionSpacing,
  pageTitle,
  tableContainer,
  table,
  tableHeader,
  tableHeaderCell,
  tableRow,
  tableCell,
  chartCard,
  chartTitle,
} from "@/shared/theme";

export function ComparePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string; code?: string } | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const result = await ComparisonApiAdapter.getComparison();
      setData(result);
    } catch (err: any) {
      console.error('Failed to load comparison:', err);
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ error: err.message || "Failed to load comparison", code: "UNKNOWN_ERROR" });
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className={pageContainer}>
        <h1 className={pageTitle}>GHG Intensity Comparison</h1>
        <Loading message="Loading comparison..." />
      </div>
    );
  }

  return (
    <div className={pageContainer}>
      <div className={sectionSpacing}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className={pageTitle}>GHG Intensity Comparison</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Target Intensity: <span className="font-semibold text-gray-900 dark:text-gray-100">{FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ} gCO₂e/MJ</span>
          </div>
        </div>
        
        {/* Error Banner */}
        {error && (
          <ErrorBanner error={error.error} code={error.code} onDismiss={() => setError(null)} />
        )}
        
        {data.length === 0 && !error ? (
          <div className={chartCard}>
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No comparison data available.
            </div>
          </div>
        ) : (
          <>
            <div className={tableContainer}>
              <div className="p-4 sm:p-6">
                <table className={table}>
                  <thead>
                    <tr className={tableHeader}>
                      <th className={tableHeaderCell}>Route Code</th>
                      <th className={tableHeaderCell}>Baseline Intensity</th>
                      <th className={tableHeaderCell}>Comparison Intensity</th>
                      <th className={tableHeaderCell}>% Difference</th>
                      <th className={tableHeaderCell}>Compliant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((r) => (
                      <tr key={r.routeCode} className={tableRow}>
                        <td className={`${tableCell} font-medium`}>{r.routeCode}</td>
                        <td className={tableCell}>{r.baselineIntensity.toFixed(2)}</td>
                        <td className={tableCell}>{r.comparisonIntensity.toFixed(2)}</td>
                        <td className={tableCell}>
                          {r.percentDiff >= 0 ? '+' : ''}{r.percentDiff.toFixed(2)}%
                        </td>
                        <td className={tableCell}>{r.compliant ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={chartCard}>
              <h2 className={chartTitle}>Intensity Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
            <XAxis dataKey="routeCode" stroke="#6b7280" className="dark:stroke-gray-400" />
            <YAxis 
              stroke="#6b7280" 
              className="dark:stroke-gray-400"
              label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
            <Legend />
            <Bar dataKey="baselineIntensity" name="Baseline" fill="#3b82f6" />
            <Bar dataKey="comparisonIntensity" name="Comparison" fill="#10b981" />
          </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

