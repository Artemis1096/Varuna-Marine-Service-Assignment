export interface PoolingPort {
  createPool(name: string, year: number, members: string[]): Promise<any>;
}

