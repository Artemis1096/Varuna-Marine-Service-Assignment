export interface BankSurplusPort {
  execute(routeCode: string, year: number, amount_gco2eq: number): Promise<{
    cb_before: number;
    applied: number;
    cb_after: number;
  }>;
}

