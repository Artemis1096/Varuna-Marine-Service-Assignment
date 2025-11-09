export interface PoolingRepositoryPort {
  createPool(name: string, year: number): Promise<string>;
  addMember(poolId: string, routeCode: string, year: number, cbBefore: number, cbAfter: number): Promise<void>;
}

