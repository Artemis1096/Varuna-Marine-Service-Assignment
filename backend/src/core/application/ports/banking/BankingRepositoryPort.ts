export interface BankingRepositoryPort {
  addBankEntry(routeCode: string, year: number, amount: number): Promise<void>;
}

