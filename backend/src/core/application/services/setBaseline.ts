import { RoutesRepositoryPort } from "../ports/routes/RoutesRepositoryPort";
import { SetBaselinePort } from "../ports/routes/SetBaselinePort";

export class SetBaselineService implements SetBaselinePort {
  constructor(private readonly routesRepo: RoutesRepositoryPort) {}

  async execute(routeId: string): Promise<void> {
    await this.routesRepo.setBaseline(routeId);
  }
}
