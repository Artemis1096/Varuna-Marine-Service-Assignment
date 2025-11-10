import { useState } from "react";
import { BankingApiAdapter } from "../adapters/outbound/api/BankingApiAdapter";
import { btnPrimary, btnDanger } from "@/shared/styles";

export function BankingPage() {
  const [routeCode, setRouteCode] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [cbData, setCbData] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function loadCB() {
    if (!routeCode || !year) return;
    setMessage("");
    const result = await BankingApiAdapter.getCB(routeCode, Number(year));
    setCbData(result);
  }

  async function handleBank() {
    const result = await BankingApiAdapter.bankSurplus(routeCode, Number(year));
    setMessage(`Banked: ${result.bankedAmount.toFixed(2)} tCO₂e`);
    await loadCB();
  }

  async function handleApply() {
    const result = await BankingApiAdapter.applyBanked(routeCode, Number(year));
    setMessage(`Applied: ${result.applied.toFixed(2)} tCO₂e`);
    await loadCB();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Banking</h1>
      
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-6 transition-colors">
        <div className="flex gap-3 items-end">
          <input
            type="text"
            placeholder="Route Code (e.g., R001)"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={routeCode}
            onChange={(e) => setRouteCode(e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
          <button onClick={loadCB} className={btnPrimary}>
            Load CB
          </button>
        </div>

        {cbData && (
          <div className="border border-gray-200 dark:border-gray-600 p-4 rounded bg-gray-50 dark:bg-gray-700/50 space-y-2 text-gray-900 dark:text-gray-100">
            <p><b>Actual Intensity:</b> {cbData.actualIntensity.toFixed(2)} gCO₂e/MJ</p>
            <p><b>Compliance Balance:</b> {cbData.cb_tonnesCO2e.toFixed(2)} tCO₂e</p>

            {cbData.cb_tonnesCO2e > 0 && (
              <button className={btnPrimary} onClick={handleBank}>
                Bank Surplus
              </button>
            )}
            {cbData.cb_tonnesCO2e < 0 && (
              <button className={btnDanger} onClick={handleApply}>
                Apply Banked Surplus
              </button>
            )}
          </div>
        )}

        {message && <div className="text-blue-600 dark:text-blue-400 font-medium">{message}</div>}
      </div>
    </div>
  );
}

