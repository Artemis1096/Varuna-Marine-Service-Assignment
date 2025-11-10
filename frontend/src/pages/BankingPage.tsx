import { useState, useEffect } from "react";
import { BankingApiAdapter } from "../adapters/outbound/api/BankingApiAdapter";
import { ErrorBanner, Loading, SuccessBanner } from "@/ui/components";
import {
  pageContainer,
  sectionSpacing,
  pageTitle,
  cardContent,
  inputBase,
  inputError,
  btnPrimary,
  btnDanger,
  kpiCard,
  kpiLabel,
  kpiValue,
  kpiGrid,
} from "@/shared/theme";

interface ErrorResponse {
  error: string;
  code: string;
}

interface CBData {
  shipId: string;
  year: number;
  cb_before: number;
  unit: string;
  details?: {
    actualIntensity: number;
    cb_tonnesCO2e: number;
  };
}

interface BankResult {
  cb_before: number;
  applied: number;
  cb_after: number;
}

function formatCB(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000) {
    // Format in tonnes with more precision to show small changes
    return `${(value / 1_000_000).toFixed(4)} tCO₂e`;
  } else {
    // Format in grams
    return `${value.toFixed(2)} gCO₂e`;
  }
}

export function BankingPage() {
  const [shipId, setShipId] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [cbData, setCbData] = useState<CBData | null>(null);
  const [bankAmount, setBankAmount] = useState<number | "">("");
  const [applyAmount, setApplyAmount] = useState<number | "">("");
  const [applied, setApplied] = useState<number | null>(null);
  const [cbAfter, setCbAfter] = useState<number | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [fieldError, setFieldError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [banking, setBanking] = useState(false);
  const [applying, setApplying] = useState(false);
  const [bankedAvailable, setBankedAvailable] = useState<number | null>(null);

  async function loadCB(resetApplied: boolean = false) {
    if (!shipId || !year) return;
    
    setError(null);
    setFieldError("");
    setLoading(true);
    
    try {
      const result = await BankingApiAdapter.getCB(shipId, Number(year));
      setCbData(result);
      
      // Only reset applied/cbAfter if explicitly requested (e.g., when loading fresh CB)
      if (resetApplied) {
        setApplied(null);
        setCbAfter(null);
      }
      
      // Check available banked amount (we'll need to fetch this separately or calculate)
      // For now, we'll assume we need to check this after loading CB
      // In a real implementation, you might want to add an endpoint to get available banked amount
      setBankedAvailable(null);
    } catch (err: any) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ error: err.message || "Failed to load CB", code: "UNKNOWN_ERROR" });
      }
      setCbData(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleBank() {
    if (!shipId || !year || !bankAmount || bankAmount <= 0) {
      setFieldError("Amount must be greater than zero");
      return;
    }

    if (!cbData) {
      setFieldError("Please load CB first");
      return;
    }

    if (bankAmount > cbData.cb_before) {
      setFieldError("Amount exceeds available positive CB");
      return;
    }

    if (banking) return; // Prevent duplicate submissions
    
    setError(null);
    setFieldError("");
    setBanking(true);

    try {
      const result: BankResult = await BankingApiAdapter.bankSurplus(
        shipId,
        Number(year),
        Number(bankAmount)
      );
      
      setApplied(result.applied);
      setCbAfter(result.cb_after);
      setBankAmount("");
      
      // Reload CB to get updated data (but keep applied/cbAfter values)
      await loadCB(false);
    } catch (err: any) {
      if (err.response?.data) {
        const errorData = err.response.data;
        setError(errorData);
        
        // Set field-level error if it's an amount-related error
        if (errorData.code === "INVALID_AMOUNT" || errorData.code === "AMOUNT_EXCEEDS_AVAILABLE") {
          setFieldError(errorData.error);
        }
      } else {
        setError({ error: err.message || "Failed to bank surplus", code: "UNKNOWN_ERROR" });
      }
    } finally {
      setBanking(false);
    }
  }

  async function handleApply() {
    if (!shipId || !year || !applyAmount || applyAmount <= 0) {
      setFieldError("Amount must be greater than zero");
      return;
    }

    // Validate: Can only apply to routes with negative CB (deficit)
    if (cbData && cbData.cb_before >= 0) {
      setFieldError("Can only apply surplus to routes with negative CB (deficit)");
      setError({ error: "Can only apply surplus to routes with negative CB (deficit)", code: "INVALID_OPERATION" });
      return;
    }

    if (applying) return; // Prevent duplicate submissions
    
    setError(null);
    setFieldError("");
    setApplying(true);

    try {
      const result: BankResult = await BankingApiAdapter.applyBanked(
        shipId,
        Number(year),
        Number(applyAmount)
      );
      
      setApplied(result.applied);
      setCbAfter(result.cb_after);
      setApplyAmount("");
      
      // Reload CB to get updated data (but keep applied/cbAfter values)
      await loadCB(false);
    } catch (err: any) {
      console.error("Apply error:", err);
      if (err.response?.data) {
        const errorData = err.response.data;
        console.error("Error data:", errorData);
        setError(errorData);
        
        // Set field-level error if it's an amount-related error
        if (errorData.code === "INVALID_AMOUNT" || errorData.code === "AMOUNT_EXCEEDS_AVAILABLE" || errorData.code === "NO_BANKED_SURPLUS") {
          setFieldError(errorData.error);
        }
      } else {
        console.error("Unknown error:", err);
        setError({ error: err.message || "Failed to apply banked surplus", code: "UNKNOWN_ERROR" });
      }
    } finally {
      setApplying(false);
    }
  }

  // Disable Bank button if cb_before ≤ 0
  const canBank = cbData && cbData.cb_before > 0;
  
  // Disable Apply if no banked amount available (we'll need to check this)
  // For now, we'll disable if cb_before is not negative (no deficit)
  // Note: Even with a deficit, you need banked surplus available to apply
  const canApply = cbData && cbData.cb_before < 0;

  return (
    <div className={pageContainer}>
      <div className={sectionSpacing}>
        <h1 className={pageTitle}>Banking</h1>
        
        {/* Error Banner */}
        {error && (
          <ErrorBanner error={error.error} code={error.code} onDismiss={() => setError(null)} />
        )}

        <div className={cardContent}>
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="flex gap-3 items-end flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ship ID
                </label>
                <input
                  type="text"
                  placeholder="Ship ID (e.g., R001)"
                  className={inputBase}
                  value={shipId}
                  onChange={(e) => setShipId(e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="Year"
                  className={inputBase}
                  value={year}
                  onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}
                />
              </div>
              <button 
                onClick={() => loadCB(true)} 
                className={btnPrimary}
                disabled={loading || !shipId || !year}
              >
                {loading ? "Loading..." : "Load CB"}
              </button>
            </div>

            {/* KPI Row */}
            {cbData && (
              <div className={kpiCard}>
                <div className={kpiGrid}>
                  <div>
                    <p className={kpiLabel}>CB (before)</p>
                    <p className={kpiValue}>
                      {formatCB(cbData.cb_before)}
                    </p>
                  </div>
                  {applied !== null && (
                    <div>
                      <p className={kpiLabel}>Applied</p>
                      <p className={kpiValue}>
                        {formatCB(applied)}
                      </p>
                    </div>
                  )}
                  {cbAfter !== null && (
                    <div>
                      <p className={kpiLabel}>CB (after)</p>
                      <p className={kpiValue}>
                        {formatCB(cbAfter)}
                      </p>
                    </div>
                  )}
                </div>

            {cbData.details && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <b>Actual Intensity:</b> {cbData.details.actualIntensity.toFixed(2)} gCO₂e/MJ
                </p>
              </div>
            )}
          </div>
        )}

            {/* Bank Section */}
            {cbData && canBank && (
              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 space-y-3 shadow-md">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Bank Surplus</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount (gCO₂e)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount in gCO₂e"
                      className={fieldError ? `${inputBase} ${inputError}` : inputBase}
                      value={bankAmount}
                      onChange={(e) => {
                        setBankAmount(e.target.value ? Number(e.target.value) : "");
                        setFieldError("");
                      }}
                      min="0"
                      step="0.01"
                    />
                    {fieldError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleBank}
                    disabled={banking || applying || loading || !bankAmount || Number(bankAmount) <= 0 || Number(bankAmount) > cbData.cb_before}
                    className={btnPrimary}
                  >
                    {banking ? "Banking..." : "Bank"}
                  </button>
                </div>
              </div>
            )}

            {/* Apply Section */}
            {cbData && canApply && (
              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 space-y-3 shadow-md">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Apply Banked Surplus</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Note: You need to bank surplus from a route with positive CB first, then apply it here.
                </p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount (gCO₂e)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount in gCO₂e"
                      className={fieldError ? `${inputBase} ${inputError}` : inputBase}
                      value={applyAmount}
                      onChange={(e) => {
                        setApplyAmount(e.target.value ? Number(e.target.value) : "");
                        setFieldError("");
                      }}
                      min="0"
                      step="0.01"
                    />
                    {fieldError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={applying || banking || loading || !applyAmount || Number(applyAmount) <= 0}
                    className={btnDanger}
                  >
                    {applying ? "Applying..." : "Apply"}
                  </button>
                </div>
              </div>
            )}

            {/* Info Messages */}
            {cbData && !canBank && !canApply && (
              <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 shadow-md">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  CB is zero. No banking operations available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
