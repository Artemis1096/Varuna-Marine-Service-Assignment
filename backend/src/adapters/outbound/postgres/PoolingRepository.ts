import { PrismaClient } from '@prisma/client';
import { PoolingRepositoryPort } from '../../../core/application/ports/pooling/PoolingRepositoryPort';
import { RoutesRepositoryPort } from '../../../core/application/ports/routes/RoutesRepositoryPort';

export class PoolingRepository implements PoolingRepositoryPort {
  private prisma: PrismaClient;

  constructor(private routesRepo: RoutesRepositoryPort) {
    this.prisma = new PrismaClient();
  }

  async createPool(name: string, year: number): Promise<string> {
    const pool = await this.prisma.pool.create({ data: { name, year } });
    return pool.id;
  }

  async addMember(poolId: string, routeCode: string, year: number, cbBefore: number, cbAfter: number): Promise<void> {
    // Find route to get routeId
    const route = await this.routesRepo.findByRouteCode(routeCode);
    if (!route) {
      throw new Error(`Route with code ${routeCode} not found`);
    }

    // Note: PoolMember requires shipComplianceId which references ShipCompliance
    // For now, we'll need to create or find a ShipCompliance record
    // Using routeCode as shipId for simplicity
    // TODO: Properly handle ShipCompliance creation or make it optional
    let shipCompliance = await this.prisma.shipCompliance.findFirst({
      where: {
        shipId: routeCode,
        routeId: route.id,
        year,
      },
    });

    if (!shipCompliance) {
      // Create a minimal ShipCompliance record
      shipCompliance = await this.prisma.shipCompliance.create({
        data: {
          shipId: routeCode,
          shipName: `Ship-${routeCode}`,
          routeId: route.id,
          year,
          cb: cbBefore, // Use cbBefore as initial CB value
        },
      });
    }

    await this.prisma.poolMember.create({
      data: {
        poolId,
        shipId: routeCode,
        routeId: route.id,
        year,
        shipComplianceId: shipCompliance.id,
        cbBefore,
        cbAfter,
      },
    });
  }
}

