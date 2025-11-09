import { GetCBPort } from '../ports/compliance/GetCBPort';
import { BankingRepositoryPort } from '../ports/banking/BankingRepositoryPort';

export class ApplyBankedService {
  constructor(
    private readonly getCB: GetCBPort,
    private readonly bankingRepo: BankingRepositoryPort
  ) {}

  async execute(routeCode: string, year: number) {
    const cb = await this.getCB.execute(routeCode, year);

    if (cb.cb_tonnesCO2e >= 0) {
      throw new Error('This route does not have a deficit; no need to apply surplus.');
    }

    const deficit = Math.abs(cb.cb_tonnesCO2e);
    const available = await this.bankingRepo.getAvailableBanked(routeCode, year);

    if (available <= 0) {
      throw new Error('No banked surplus available.');
    }

    const applyAmount = Math.min(deficit, available);

    await this.bankingRepo.markApplied(routeCode, year, applyAmount);

    return {
      routeCode,
      year,
      applied: applyAmount,
      deficit_before: deficit,
      deficit_after: deficit - applyAmount,
    };
  }
}

