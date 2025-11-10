import { PrismaClient } from "@prisma/client";
import { RoutesRepositoryPort } from "../../../core/application/ports/routes/RoutesRepositoryPort";

export class RoutesRepository implements RoutesRepositoryPort {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(filters?: { vesselType?: string; fuelType?: string; year?: number }) {
    const where: any = {};

    // vesselType: equals (case-insensitive)
    if (filters?.vesselType) {
      where.vesselType = {
        equals: filters.vesselType,
        mode: 'insensitive',
      };
    }

    // fuelType: equals (case-insensitive)
    if (filters?.fuelType) {
      where.fuelType = {
        equals: filters.fuelType,
        mode: 'insensitive',
      };
    }

    // year: exact integer match
    if (filters?.year !== undefined && filters?.year !== null) {
      where.year = filters.year;
    }

    return this.prisma.route.findMany({
      where,
    });
  }

  async setBaseline(routeCode: string): Promise<void> {
    // First updateMany to clear all baselines
    await this.prisma.route.updateMany({ data: { is_baseline: false } });

    // Then update the specified route by routeCode
    await this.prisma.route.update({
      where: { routeCode },
      data: { is_baseline: true },
    });
  }

  async findBaseline(): Promise<any | null> {
    return this.prisma.route.findFirst({ where: { is_baseline: true } });
  }

  async findByRouteCode(routeCode: string): Promise<any | null> {
    return this.prisma.route.findUnique({ where: { routeCode } });
  }
}
