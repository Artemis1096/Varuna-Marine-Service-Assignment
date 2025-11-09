import { RoutesRepositoryPort } from '../ports/routes/RoutesRepositoryPort';
import { GetRoutesPort } from '../ports/routes/GetRoutesPort';

export class GetRoutesService implements GetRoutesPort {
  constructor(private readonly routesRepo: RoutesRepositoryPort) {}

  async execute(filters?: { vesselType?: string; fuelType?: string; year?: number }) {
    return this.routesRepo.findAll(filters);
  }
}

