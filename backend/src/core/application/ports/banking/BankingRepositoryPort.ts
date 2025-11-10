export interface BankingRepositoryPort {
  addBankEntry(routeCode: string, year: number, amount: number): Promise<void>;
  getAvailableBanked(routeCode: string, year: number): Promise<number>;
  markApplied(routeCode: string, year: number, amount: number): Promise<void>;
  getAppliedBanked(routeCode: string, year: number): Promise<number>;
}

