import { PrismaClient } from "@prisma/client";
import { RoutesRepositoryPort } from "../../../core/application/ports/routes/RoutesRepositoryPort";

export class RoutesRepository implements RoutesRepositoryPort {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(_filters?: { vesselType?: string; fuelType?: string; year?: number }) {
    return this.prisma.route.findMany({
      where: {
        // These fields depend on your earlier route schema, adjust accordingly:
        // name, origin, destination, etc. are untouched.
      },
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
