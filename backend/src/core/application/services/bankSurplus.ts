import { GetCBPort } from '../ports/compliance/GetCBPort';
import { BankingRepositoryPort } from '../ports/banking/BankingRepositoryPort';
import { BankSurplusPort } from '../ports/banking/BankSurplusPort';

export class BankSurplusService implements BankSurplusPort {
  constructor(
    private readonly getCB: GetCBPort,
    private readonly bankingRepo: BankingRepositoryPort
  ) {}

  async execute(routeCode: string, year: number, amount_gco2eq: number) {
    const cb = await this.getCB.execute(routeCode, year);

    // cb_before is the raw computed CB BEFORE any banking application (in gCO2e)
    const cb_before = cb.cb_gCO2e;

    // Validate: CB must be positive
    if (cb_before <= 0) {
      const error: any = new Error('Cannot bank deficit or zero balance');
      error.code = 'CB_NOT_POSITIVE';
      throw error;
    }

    // Validate: amount_gco2eq > 0
    if (amount_gco2eq <= 0) {
      const error: any = new Error('Amount must be greater than zero');
      error.code = 'INVALID_AMOUNT';
      throw error;
    }

    // Validate: amount_gco2eq ≤ available positive CB
    if (amount_gco2eq > cb_before) {
      const error: any = new Error('Amount exceeds available positive CB');
      error.code = 'AMOUNT_EXCEEDS_AVAILABLE';
      throw error;
    }

    // Convert amount from gCO2e to tonnes for storage
    const amount_tonnes = amount_gco2eq / 1_000_000;
    await this.bankingRepo.addBankEntry(routeCode, year, amount_tonnes);

    // Calculate cb_after = cb_before - applied
    const cb_after = cb_before - amount_gco2eq;

    return {
      cb_before,
      applied: amount_gco2eq,
      cb_after,
    };
  }
}

