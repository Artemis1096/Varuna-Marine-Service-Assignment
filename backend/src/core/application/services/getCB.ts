import { RoutesRepositoryPort } from '../ports/routes/RoutesRepositoryPort';
import { GetCBPort } from '../ports/compliance/GetCBPort';
import { computeCB } from './computeCB';

export class GetCBService implements GetCBPort {
  constructor(private readonly routesRepo: RoutesRepositoryPort) {}

  async execute(routeCode: string, year: number) {
    const route = await this.routesRepo.findByRouteCode(routeCode);
    if (!route) throw new Error('Route not found');

    // Compute CB using computeCB function
    // computeCB takes fuelType and fuelConsumptionTonnes
    const result = computeCB(route.fuelType, route.fuelConsumptionTonnes);

    return {
      routeCode,
      year,
      actualIntensity: result.actual_intensity,
      cb_gCO2e: result.cb_gCO2e,
      cb_tonnesCO2e: result.cb_tonnesCO2e,
    };
  }
}

