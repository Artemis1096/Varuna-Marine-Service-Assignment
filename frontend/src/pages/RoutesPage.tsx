import { useEffect, useState, useMemo } from "react";
import { RoutesApiAdapter } from "../adapters/outbound/api/RoutesApiAdapter";
import { ErrorBanner, Loading } from "@/ui/components";
import {
  pageContainer,
  sectionSpacing,
  pageTitle,
  filterContainer,
  inputBase,
  btnPrimary,
  btnSecondary,
  tableContainer,
  table,
  tableHeader,
  tableHeaderCell,
  tableRow,
  tableCell,
} from "@/shared/theme";

// Fixed fallback options
const VESSEL_TYPE_OPTIONS = ["Container", "BulkCarrier", "Tanker", "RoRo"];
const FUEL_TYPE_OPTIONS = ["HFO", "LNG", "MGO"];

export function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string; code?: string } | null>(null);
  const [settingBaseline, setSettingBaseline] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }>({});

  // Extract unique values from current dataset
  const vesselTypeOptions = useMemo(() => {
    const unique = Array.from(new Set(routes.map(r => r.vesselType).filter(Boolean)));
    return unique.length > 0 ? unique : VESSEL_TYPE_OPTIONS;
  }, [routes]);

  const fuelTypeOptions = useMemo(() => {
    const unique = Array.from(new Set(routes.map(r => r.fuelType).filter(Boolean)));
    return unique.length > 0 ? unique : FUEL_TYPE_OPTIONS;
  }, [routes]);

  const yearOptions = useMemo(() => {
    const unique = Array.from(new Set(routes.map(r => r.year).filter(Boolean))).sort((a, b) => b - a);
    return unique;
  }, [routes]);

  async function loadRoutes(filterParams?: { vesselType?: string; fuelType?: string; year?: number }) {
    setLoading(true);
    setError(null);
    try {
      const data = await RoutesApiAdapter.getRoutes(filterParams);
      setRoutes(data);
    } catch (err: any) {
      console.error('Failed to load routes:', err);
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ error: err.message || "Failed to load routes", code: "UNKNOWN_ERROR" });
      }
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetBaseline(routeCode: string) {
    if (settingBaseline) return; // Prevent duplicate submissions
    
    setSettingBaseline(routeCode);
    setError(null);
    try {
      await RoutesApiAdapter.setBaseline(routeCode);
      await loadRoutes(filters);
    } catch (err: any) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError({ error: err.message || "Failed to set baseline", code: "UNKNOWN_ERROR" });
      }
    } finally {
      setSettingBaseline(null);
    }
  }

  function handleFilterChange(key: 'vesselType' | 'fuelType' | 'year', value: string | number | '') {
    const newFilters = { ...filters };
    
    if (value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      if (key === 'year') {
        newFilters[key] = value ? Number(value) : undefined;
      } else {
        newFilters[key] = value as string;
      }
    }
    
    setFilters(newFilters);
    loadRoutes(newFilters);
  }

  function handleClearFilters() {
    setFilters({});
    loadRoutes();
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className={pageContainer}>
      <div className={sectionSpacing}>
        <h1 className={pageTitle}>Routes</h1>
        
        {/* Error Banner */}
        {error && (
          <ErrorBanner error={error.error} code={error.code} onDismiss={() => setError(null)} />
        )}
        
        {/* Filters Section */}
        <div className={filterContainer}>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vessel Type
              </label>
              <select
                value={filters.vesselType || ''}
                onChange={(e) => handleFilterChange('vesselType', e.target.value)}
                className={inputBase}
              >
                <option value="">All Vessel Types</option>
                {vesselTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fuel Type
              </label>
              <select
                value={filters.fuelType || ''}
                onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                className={inputBase}
              >
                <option value="">All Fuel Types</option>
                {fuelTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Year
              </label>
              {yearOptions.length > 0 ? (
                <select
                  value={filters.year || ''}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className={inputBase}
                >
                  <option value="">All Years</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  placeholder="Year (e.g., 2024)"
                  value={filters.year || ''}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className={inputBase}
                />
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className={btnSecondary}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Routes Table */}
        <div className={tableContainer}>
          <div className="p-4 sm:p-6">
            {loading ? (
              <Loading message="Loading routes..." />
            ) : routes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  {hasActiveFilters 
                    ? 'No routes found matching the selected filters.' 
                    : 'No routes available.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear filters to see all routes
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={table}>
                  <thead>
                    <tr className={tableHeader}>
                      <th className={`${tableHeaderCell} text-left`}>Route Code</th>
                      <th className={`${tableHeaderCell} text-left`}>Vessel Type</th>
                      <th className={`${tableHeaderCell} text-left`}>Origin → Destination</th>
                      <th className={`${tableHeaderCell} text-right`}>Distance (km)</th>
                      <th className={`${tableHeaderCell} text-left`}>Fuel Type</th>
                      <th className={`${tableHeaderCell} text-right`}>Fuel Consumption (t)</th>
                      <th className={`${tableHeaderCell} text-right`}>Year</th>
                      <th className={`${tableHeaderCell} text-right`}>GHG Intensity</th>
                      <th className={`${tableHeaderCell} text-right`}>Total Emissions (t)</th>
                      <th className={`${tableHeaderCell} text-center`}>Baseline</th>
                      <th className={`${tableHeaderCell} text-center`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r) => (
                      <tr key={r.routeCode} className={tableRow}>
                        <td className={`${tableCell} font-medium`}>{r.routeCode}</td>
                        <td className={tableCell}>{r.vesselType || '-'}</td>
                        <td className={tableCell}>{r.origin} → {r.destination}</td>
                        <td className={`${tableCell} text-right`}>
                          {r.distance != null ? r.distance.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'}
                        </td>
                        <td className={tableCell}>{r.fuelType || '-'}</td>
                        <td className={`${tableCell} text-right`}>
                          {r.fuelConsumptionTonnes != null ? r.fuelConsumptionTonnes.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '-'}
                        </td>
                        <td className={`${tableCell} text-right`}>{r.year || '-'}</td>
                        <td className={`${tableCell} text-right`}>
                          {r.ghgIntensity != null ? r.ghgIntensity.toFixed(1) : '-'}
                        </td>
                        <td className={`${tableCell} text-right`}>
                          {r.totalEmissions != null ? r.totalEmissions.toLocaleString('en-US', { maximumFractionDigits: 1 }) : '-'}
                        </td>
                        <td className={`${tableCell} text-center`}>
                          {r.is_baseline ? "✅" : "❌"}
                        </td>
                        <td className={`${tableCell} text-center`}>
                          {!r.is_baseline && (
                            <button
                              onClick={() => handleSetBaseline(r.routeCode)}
                              disabled={settingBaseline === r.routeCode || settingBaseline !== null}
                              className={btnPrimary}
                            >
                              {settingBaseline === r.routeCode ? "Setting..." : "Set Baseline"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

