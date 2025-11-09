import { GetCBPort } from '../ports/compliance/GetCBPort';
import { BankingRepositoryPort } from '../ports/banking/BankingRepositoryPort';
import { BankSurplusPort } from '../ports/banking/BankSurplusPort';

export class BankSurplusService implements BankSurplusPort {
  constructor(
    private readonly getCB: GetCBPort,
    private readonly bankingRepo: BankingRepositoryPort
  ) {}

  async execute(routeCode: string, year: number) {
    const cb = await this.getCB.execute(routeCode, year);

    if (cb.cb_tonnesCO2e <= 0) {
      throw new Error('Cannot bank deficit or zero balance');
    }

    await this.bankingRepo.addBankEntry(routeCode, year, cb.cb_tonnesCO2e);

    return {
      routeCode,
      year,
      bankedAmount: cb.cb_tonnesCO2e,
    };
  }
}

