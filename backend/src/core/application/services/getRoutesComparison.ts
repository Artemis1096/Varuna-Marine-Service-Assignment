import { RoutesRepositoryPort } from '../ports/routes/RoutesRepositoryPort';
import { GetComparisonPort } from '../ports/routes/GetComparisonPort';
import { computeGHGIntensity } from './computeGHGIntensity';

// FuelEU Maritime target intensity (gCO2e/MJ)
const TARGET_INTENSITY = 91.16; // gCO2e/MJ

export interface RouteComparisonResult {
  routeCode: string;
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

export class GetRoutesComparisonService implements GetComparisonPort {
  constructor(private readonly routesRepo: RoutesRepositoryPort) {}

  async execute(): Promise<RouteComparisonResult[]> {
    // Load all routes from RoutesRepository
    const allRoutes = await this.routesRepo.findAll();

    // Identify the baseline route
    const baselineRoute = await this.routesRepo.findBaseline();

    if (!baselineRoute) {
      throw new Error('No baseline route found');
    }

    // Validate baseline route has fuel data
    if (!baselineRoute.fuelType || baselineRoute.fuelConsumptionTonnes == null) {
      throw new Error(
        `Baseline route ${baselineRoute.routeCode} is missing fuelType or fuelConsumptionTonnes`
      );
    }

    // Compute intensity for baseline route
    const baselineIntensityResult = computeGHGIntensity(
      baselineRoute.fuelType,
      baselineRoute.fuelConsumptionTonnes
    );
    const baselineIntensity = baselineIntensityResult.intensity_gCO2e_per_MJ;

    // For each non-baseline route, compute comparison
    const results: RouteComparisonResult[] = [];

    for (const route of allRoutes) {
      // Skip baseline route
      if (route.is_baseline === true) {
        continue;
      }

      // Skip routes without fuel data
      if (!route.fuelType || route.fuelConsumptionTonnes == null) {
        continue;
      }

      // Compute intensity for comparison route
      const compIntensityResult = computeGHGIntensity(
        route.fuelType,
        route.fuelConsumptionTonnes
      );
      const compIntensity = compIntensityResult.intensity_gCO2e_per_MJ;

      // Calculate percent difference
      // percentDiff = ((compIntensity / baselineIntensity) - 1) * 100
      const percentDiff = ((compIntensity / baselineIntensity) - 1) * 100;

      // Check compliance
      // compliant = compIntensity <= TARGET_INTENSITY
      const compliant = compIntensity <= TARGET_INTENSITY;

      results.push({
        routeCode: route.routeCode,
        baselineIntensity,
        comparisonIntensity: compIntensity,
        percentDiff,
        compliant,
      });
    }

    return results;
  }
}
