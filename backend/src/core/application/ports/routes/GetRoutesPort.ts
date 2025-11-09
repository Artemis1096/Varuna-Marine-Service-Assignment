export interface GetRoutesPort {
  execute(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<any[]>;
}

