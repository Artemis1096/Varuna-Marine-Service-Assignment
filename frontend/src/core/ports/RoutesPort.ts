export interface RoutesPort {
  getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<any[]>;

  setBaseline(routeCode: string): Promise<void>;
}

