export interface CreatePoolPort {
  execute(name: string, year: number, routeCodes: string[]): Promise<any>;
}

