import { useEffect, useState, useMemo } from "react";
import { PoolingApiAdapter } from "../adapters/outbound/api/PoolingApiAdapter";
import type { AdjustedCBData, CreatePoolResult, PoolMemberInput } from "../../core/ports/PoolingPort";
import { ErrorBanner, Loading, SuccessBanner } from "@/ui/components";
import {
  pageContainer,
  sectionSpacing,
  pageTitle,
  cardContent,
  inputBase,
  btnPrimary,
  kpiCard,
  kpiLabel,
  kpiValue,
  tableContainer,
  table,
  tableHeader,
  tableHeaderCell,
  tableRow,
  tableCell,
  badgeSuccess,
  badgeDanger,
} from "@/shared/theme";

function formatCB(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000) {
    // Format in tonnes with more precision
    return `${(value / 1_000_000).toFixed(4)} tCO₂e`;
  } else {
    // Format in grams
    return `${value.toFixed(2)} gCO₂e`;
  }
}

export function PoolingPage() {
  const [year, setYear] = useState<number | "">("");
  const [adjustedCBData, setAdjustedCBData] = useState<AdjustedCBData[]>([]);
  const [selectedShipIds, setSelectedShipIds] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<CreatePoolResult | null>(null);
  const [error, setError] = useState<{ error: string; code: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCB, setLoadingCB] = useState(false);

  // Fetch adjusted CB data when year changes
  useEffect(() => {
    if (year && Number.isInteger(Number(year))) {
      loadAdjustedCB(Number(year));
    } else {
      setAdjustedCBData([]);
      setSelectedShipIds(new Set());
    }
  }, [year]);

  async function loadAdjustedCB(yearNum: number) {
    setLoadingCB(true);
    setError(null);
    setResult(null);
    setSelectedShipIds(new Set());
    
    try {
      const data = await PoolingApiAdapter.getAdjustedCB(yearNum);
      setAdjustedCBData(data);
    } catch (err: any) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ error: err.message || "Failed to load adjusted CB", code: "UNKNOWN_ERROR" });
      }
      setAdjustedCBData([]);
    } finally {
      setLoadingCB(false);
    }
  }

  function toggleShip(shipId: string) {
    setSelectedShipIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(shipId)) {
        newSet.delete(shipId);
      } else {
        newSet.add(shipId);
      }
      return newSet;
    });
    setResult(null);
    setError(null);
  }

  // Compute poolSum client-side (sum of cb_before for selected members)
  const poolSum = useMemo(() => {
    if (selectedShipIds.size === 0) return 0;
    
    return adjustedCBData
      .filter((item) => selectedShipIds.has(item.shipId))
      .reduce((sum, item) => sum + item.cb_before, 0);
  }, [selectedShipIds, adjustedCBData]);

  // Get selected members data
  const selectedMembers = useMemo(() => {
    return adjustedCBData.filter((item) => selectedShipIds.has(item.shipId));
  }, [selectedShipIds, adjustedCBData]);

  // Check if there's at least one deficit and one surplus
  const hasDeficitAndSurplus = useMemo(() => {
    const hasDeficit = selectedMembers.some((m) => m.cb_before < 0);
    const hasSurplus = selectedMembers.some((m) => m.cb_before > 0);
    return hasDeficit && hasSurplus;
  }, [selectedMembers]);

  // Validation: poolSum >= 0 and has both deficit and surplus
  const canCreatePool = poolSum >= 0 && hasDeficitAndSurplus && selectedShipIds.size >= 2;

  async function createPool() {
    if (!year || !canCreatePool) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Build members array with cb_before
    const members: PoolMemberInput[] = selectedMembers.map((item) => ({
      shipId: item.shipId,
      cb_before: item.cb_before,
    }));

    try {
      const res = await PoolingApiAdapter.createPool(Number(year), members);
      setResult(res);
    } catch (err: any) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ error: err.message || "Failed to create pool", code: "UNKNOWN_ERROR" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={pageContainer}>
      <div className={sectionSpacing}>
        <h1 className={pageTitle}>Pooling</h1>

        {/* Error Banner */}
        {error && (
          <ErrorBanner error={error.error} code={error.code} onDismiss={() => setError(null)} />
        )}

        {/* Success Banner */}
        {result && (
          <SuccessBanner
            message={`Pool created for year ${result.year} with ${result.members.length} members.`}
            onDismiss={() => setResult(null)}
          />
        )}

        <div className={cardContent}>
          <div className="space-y-6">
            {/* Year Input */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="Year (e.g., 2024)"
                  className={inputBase}
                  value={year}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              {loadingCB && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Loading adjusted CB...
                </div>
              )}
            </div>

            {/* Pool Sum Indicator */}
            {year && adjustedCBData.length > 0 && (
              <div className={kpiCard}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pool Sum:</span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-lg font-semibold ${
                    poolSum >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCB(poolSum)}
                </span>
                <div
                  className={`h-3 w-3 rounded-full ${
                    poolSum >= 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>
            </div>
            {selectedShipIds.size > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {selectedShipIds.size} member{selectedShipIds.size !== 1 ? "s" : ""} selected
                {!hasDeficitAndSurplus && (
                  <span className="text-red-600 dark:text-red-400 ml-2">
                    (Need both deficit and surplus ships)
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Ships List */}
        {year && (
          <div>
            <h2 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
              Select Pool Members:
            </h2>
            {loadingCB ? (
              <Loading message="Loading ships..." />
            ) : adjustedCBData.length === 0 ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No ships found for year {year}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {adjustedCBData.map((item) => {
                  const isSelected = selectedShipIds.has(item.shipId);
                  const isDeficit = item.cb_before < 0;
                  const isSurplus = item.cb_before > 0;

                  return (
                    <label
                      key={item.shipId}
                      className={`flex items-center gap-3 border rounded-2xl p-3 cursor-pointer transition-colors shadow-sm ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleShip(item.shipId)}
                        className="cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {item.shipId}
                          </span>
                          {item.shipName && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({item.shipName})
                            </span>
                          )}
                          {isDeficit && (
                            <span className={badgeDanger}>
                              Deficit
                            </span>
                          )}
                          {isSurplus && (
                            <span className={badgeSuccess}>
                              Surplus
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          CB (before): {formatCB(item.cb_before)}
                          {item.cb_adjusted !== item.cb_before && (
                            <span className="ml-2">
                              → Adjusted: {formatCB(item.cb_adjusted)}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

            {/* Create Pool Button */}
            {year && adjustedCBData.length > 0 && (
              <div className="flex justify-end">
                <button
                  disabled={!canCreatePool || loading}
                  onClick={createPool}
                  className={btnPrimary}
                >
                  {loading ? "Creating..." : "Create Pool"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Before/After Table */}
        {result && (
          <div className={tableContainer}>
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Pool Results
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <b>Year:</b> {result.year}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <b>Pool Sum:</b>{" "}
                  <span
                    className={
                      result.poolSum >= 0
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : "text-red-600 dark:text-red-400 font-semibold"
                    }
                  >
                    {formatCB(result.poolSum)}
                  </span>
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className={table}>
                  <thead>
                    <tr className={tableHeader}>
                      <th className={`${tableHeaderCell} text-left`}>
                        Ship ID
                      </th>
                      <th className={`${tableHeaderCell} text-right`}>
                        CB (before)
                      </th>
                      <th className={`${tableHeaderCell} text-right`}>
                        CB (after)
                      </th>
                      <th className={`${tableHeaderCell} text-right`}>
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.members.map((member) => {
                      const change = member.cb_after - member.cb_before;
                      const isImprovement = change > 0 || (member.cb_before < 0 && member.cb_after > member.cb_before);

                      return (
                        <tr
                          key={member.shipId}
                          className={tableRow}
                        >
                          <td className={`${tableCell} font-medium`}>
                            {member.shipId}
                          </td>
                          <td className={`${tableCell} text-right`}>
                            {formatCB(member.cb_before)}
                          </td>
                          <td className={`${tableCell} text-right`}>
                            {formatCB(member.cb_after)}
                          </td>
                          <td
                            className={`${tableCell} text-right ${
                              isImprovement
                                ? "text-green-600 dark:text-green-400"
                                : change === 0
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {change > 0 ? "+" : ""}
                            {formatCB(change)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
