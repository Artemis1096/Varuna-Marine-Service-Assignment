import { GetCBPort } from "../ports/compliance/GetCBPort";
import { CreatePoolPort } from "../ports/pooling/CreatePoolPort";
import { PoolingRepositoryPort } from "../ports/pooling/PoolingRepositoryPort";

export class CreatePoolService implements CreatePoolPort {
  constructor(
    private readonly getCB: GetCBPort,
    private readonly poolingRepo: PoolingRepositoryPort
  ) {}

  async execute(name: string, year: number, routeCodes: string[]) {
    // Fetch original CB values
    const members = await Promise.all(routeCodes.map(async (r) => {
      const result = await this.getCB.execute(r, year);
      return { routeCode: r, cbBefore: result.cb_tonnesCO2e, cbAfter: result.cb_tonnesCO2e };
    }));

    // Separate surplus and deficit for greedy balancing
    const surplus = members.filter(m => m.cbAfter > 0).sort((a,b)=>b.cbAfter-a.cbAfter);
    const deficit = members.filter(m => m.cbAfter < 0).sort((a,b)=>a.cbAfter-b.cbAfter);

    // Ensure pool can be valid
    const total = members.reduce((sum, m) => sum + m.cbAfter, 0);
    if (total < 0) throw new Error("Pool cannot have net deficit");

    // Greedy redistribution
    for (let s of surplus) {
      for (let d of deficit) {
        if (s.cbAfter <= 0 || d.cbAfter >= 0) continue;
        const transfer = Math.min(s.cbAfter, -d.cbAfter);
        s.cbAfter -= transfer;
        d.cbAfter += transfer;
      }
    }

    // Create pool record
    const poolId = await this.poolingRepo.createPool(name, year);

    // Store results
    for (let m of members) {
      await this.poolingRepo.addMember(poolId, m.routeCode, year, m.cbBefore, m.cbAfter);
    }

    return { poolId, members };
  }
}
