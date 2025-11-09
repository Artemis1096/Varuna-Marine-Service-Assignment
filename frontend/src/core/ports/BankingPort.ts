export interface BankingPort {
  getCB(routeCode: string, year: number): Promise<any>;

  bankSurplus(routeCode: string, year: number): Promise<any>;

  applyBanked(routeCode: string, year: number): Promise<any>;
}

