import { GetCBPort } from '../ports/compliance/GetCBPort';
import { CreatePoolPort } from '../ports/pooling/CreatePoolPort';
import { PoolingRepositoryPort } from '../ports/pooling/PoolingRepositoryPort';

export class CreatePoolService implements CreatePoolPort {
  constructor(
    private readonly getCB: GetCBPort,
    private readonly poolingRepo: PoolingRepositoryPort
  ) {}

  async execute(name: string, year: number, routeCodes: string[]) {
    const cbList = await Promise.all(
      routeCodes.map(async (r) => {
        const cb = await this.getCB.execute(r, year);
        return { routeCode: r, cb: cb.cb_tonnesCO2e };
      })
    );

    const surplus = cbList.filter((x) => x.cb > 0).sort((a, b) => b.cb - a.cb);
    const deficit = cbList.filter((x) => x.cb < 0).sort((a, b) => a.cb - b.cb);

    let total = cbList.reduce((sum, x) => sum + x.cb, 0);
    if (total < 0) throw new Error('Pool cannot have net deficit');

    // Create a copy of cbList to track original values
    const cbListCopy = cbList.map((x) => ({ ...x }));

    // Transfer surplus to cover deficits
    for (let s of surplus) {
      for (let d of deficit) {
        if (s.cb <= 0 || d.cb >= 0) continue;

        const transfer = Math.min(s.cb, -d.cb);
        s.cb -= transfer;
        d.cb += transfer;
      }
    }

    const poolId = await this.poolingRepo.createPool(name, year);

    // Add members with before (original) and after (adjusted) CB values
    for (let i = 0; i < cbList.length; i++) {
      const before = cbListCopy[i].cb; // Original CB before pooling
      const after = cbList[i].cb; // Adjusted CB after pooling
      await this.poolingRepo.addMember(poolId, cbList[i].routeCode, year, before, after);
    }

    return { poolId, members: cbList };
  }
}

