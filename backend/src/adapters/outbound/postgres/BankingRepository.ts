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

  async getAvailableBanked(routeCode: string, year: number): Promise<number> {
    const result = await this.prisma.bankEntry.aggregate({
      where: { routeCode, year, type: 'BANKED', applied: false },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  async markApplied(routeCode: string, year: number, amount: number): Promise<void> {
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
        type: 'APPLIED',
        applied: true,
      },
    });
  }

  async getAppliedBanked(routeCode: string, year: number): Promise<number> {
    // Get sum of applied bank entries for this route/year (in tonnes)
    const result = await this.prisma.bankEntry.aggregate({
      where: {
        routeCode,
        year,
        type: 'APPLIED',
        applied: true,
      },
      _sum: { amount: true },
    });
    return result._sum.amount || 0; // Returns tonnes
  }
}

