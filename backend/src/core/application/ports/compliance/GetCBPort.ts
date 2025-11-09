export interface GetCBPort {
  execute(routeCode: string, year: number): Promise<{
    routeCode: string;
    year: number;
    actualIntensity: number;
    cb_gCO2e: number;
    cb_tonnesCO2e: number;
  }>;
}

