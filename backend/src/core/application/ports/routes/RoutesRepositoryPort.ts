export interface RoutesRepositoryPort {
  findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<any[]>;
  setBaseline(routeId: string): Promise<void>;
  findBaseline(): Promise<any | null>;
  findByRouteCode(routeCode: string): Promise<any | null>;
}

