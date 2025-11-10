export interface BankingPort {
  getCB(shipId: string, year: number): Promise<any>;

  bankSurplus(shipId: string, year: number, amount_gco2eq: number): Promise<any>;

  applyBanked(shipId: string, year: number, amount_gco2eq: number): Promise<any>;
}

