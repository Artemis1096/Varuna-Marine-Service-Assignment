export interface BankSurplusPort {
  execute(routeCode: string, year: number): Promise<{
    routeCode: string;
    year: number;
    bankedAmount: number;
  }>;
}

