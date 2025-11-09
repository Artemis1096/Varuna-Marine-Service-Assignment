import { PrismaClient } from '@prisma/client';
import { BankingRepositoryPort } from '../../../core/application/ports/banking/BankingRepositoryPort';
import { RoutesRepositoryPort } from '../../../core/application/ports/routes/RoutesRepositoryPort';

export class BankingRepository implements BankingRepositoryPort {
  private prisma: PrismaClient;

  constructor(private routesRepo: RoutesRepositoryPort) {
    this.prisma = new PrismaClient();
  }

  async addBankEntry(routeCode: string, year: number, amount: number): Promise<void> {
    // Find route to get routeId
    const route = await this.routesRepo.findByRouteCode(routeCode);
    if (!route) {
      throw new Error(`Route with code ${routeCode} not found`);
    }

    await this.prisma.bankEntry.create({
      data: {
        routeCode,
        routeId: route.id,
        year,
        amount,
        type: 'BANKED',
        applied: false,
      },
    });
  }
}

