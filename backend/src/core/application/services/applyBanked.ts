import { GetCBPort } from '../ports/compliance/GetCBPort';
import { BankingRepositoryPort } from '../ports/banking/BankingRepositoryPort';

export class ApplyBankedService {
  constructor(
    private readonly getCB: GetCBPort,
    private readonly bankingRepo: BankingRepositoryPort
  ) {}

  async execute(routeCode: string, year: number, amount_gco2eq: number) {
    const cb = await this.getCB.execute(routeCode, year);

    // cb_before is the raw computed CB BEFORE any banking application (in gCO2e)
    const cb_before = cb.cb_gCO2e;

    // Validate: amount_gco2eq > 0
    if (amount_gco2eq <= 0) {
      const error: any = new Error('Amount must be greater than zero');
      error.code = 'INVALID_AMOUNT';
      throw error;
    }

    // Get available banked amount (in tonnes) and convert to gCO2e
    const available_tonnes = await this.bankingRepo.getAvailableBanked(routeCode, year);
    const available_gco2eq = available_tonnes * 1_000_000;

    // Validate: check if any banked amount is available first
    if (available_gco2eq <= 0) {
      const error: any = new Error('No banked surplus available');
      error.code = 'NO_BANKED_SURPLUS';
      throw error;
    }

    // Validate: amount ≤ banked available
    if (amount_gco2eq > available_gco2eq) {
      const error: any = new Error('Amount exceeds available banked surplus');
      error.code = 'AMOUNT_EXCEEDS_AVAILABLE';
      throw error;
    }

    // Convert amount from gCO2e to tonnes for storage
    const amount_tonnes = amount_gco2eq / 1_000_000;
    await this.bankingRepo.markApplied(routeCode, year, amount_tonnes);

    // Calculate cb_after = cb_before + applied (toward zero)
    // If cb_before is negative (deficit), adding positive amount reduces the deficit
    const cb_after = cb_before + amount_gco2eq;

    return {
      cb_before,
      applied: amount_gco2eq,
      cb_after,
    };
  }
}

