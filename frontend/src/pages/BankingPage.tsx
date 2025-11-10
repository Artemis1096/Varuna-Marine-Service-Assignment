import { useState } from "react";
import { BankingApiAdapter } from "../adapters/outbound/api/BankingApiAdapter";

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
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Banking</h1>

      <div className="flex gap-3 items-end">
        <input
          type="text"
          placeholder="Route Code (e.g., R001)"
          className="border rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={routeCode}
          onChange={(e) => setRouteCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          className="border rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <button onClick={loadCB} className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
          Load CB
        </button>
      </div>

      {cbData && (
        <div className="border p-4 rounded bg-gray-50 space-y-2">
          <p><b>Actual Intensity:</b> {cbData.actualIntensity.toFixed(2)} gCO₂e/MJ</p>
          <p><b>Compliance Balance:</b> {cbData.cb_tonnesCO2e.toFixed(2)} tCO₂e</p>

          {cbData.cb_tonnesCO2e > 0 && (
            <button className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition" onClick={handleBank}>
              Bank Surplus
            </button>
          )}
          {cbData.cb_tonnesCO2e < 0 && (
            <button className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition" onClick={handleApply}>
              Apply Banked Surplus
            </button>
          )}
        </div>
      )}

      {message && <div className="text-blue-600 font-medium">{message}</div>}
    </div>
  );
}

