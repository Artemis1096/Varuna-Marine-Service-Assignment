import { RoutesRepositoryPort } from '../ports/routes/RoutesRepositoryPort';
import { BankingRepositoryPort } from '../ports/banking/BankingRepositoryPort';
import { GetAdjustedCBPort, AdjustedCBResult } from '../ports/compliance/GetAdjustedCBPort';
import { computeCB } from './computeCB';

export class GetAdjustedCBService implements GetAdjustedCBPort {
  constructor(
    private readonly routesRepo: RoutesRepositoryPort,
    private readonly bankingRepo: BankingRepositoryPort
  ) {}

  async execute(year: number): Promise<AdjustedCBResult[]> {
    // Get all routes for the given year
    const routes = await this.routesRepo.findAll({ year });

    if (routes.length === 0) {
      return [];
    }

    const results: AdjustedCBResult[] = [];

    // For each route, compute raw CB and get applied bank entries
    for (const route of routes) {
      // Skip routes without fuel data
      if (!route.fuelType || route.fuelConsumptionTonnes == null) {
        continue;
      }

      // Compute raw CB (cb_before)
      const cbResult = computeCB(route.fuelType, route.fuelConsumptionTonnes);
      const cb_before = cbResult.cb_gCO2e; // Raw CB in gCO2e

      // Get sum of applied bank entries for this route/year
      // Applied bank entries are stored in tonnes, so we need to convert to gCO2e
      const applied_tonnes = await this.bankingRepo.getAppliedBanked(route.routeCode, year);
      const applied_gco2eq = applied_tonnes * 1_000_000; // Convert tonnes to gCO2e

      // Calculate adjusted CB = raw CB + sum(applied bank entries)
      const cb_adjusted = cb_before + applied_gco2eq;

      results.push({
        shipId: route.routeCode, // Using routeCode as shipId for now
        shipName: route.vesselType, // Using vesselType as shipName
        year,
        cb_before,
        cb_adjusted,
      });
    }

    return results;
  }
}

