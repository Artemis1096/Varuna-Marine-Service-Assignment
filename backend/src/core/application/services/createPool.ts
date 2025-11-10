import { CreatePoolPort, PoolMemberInput, PoolMemberOutput, CreatePoolResult } from "../ports/pooling/CreatePoolPort";

export class CreatePoolService implements CreatePoolPort {
  execute(year: number, members: PoolMemberInput[]): CreatePoolResult {
    // Validate input
    if (!members || members.length === 0) {
      const error: any = new Error('Pool must have at least one member');
      error.code = 'INVALID_POOL';
      throw error;
    }

    // Calculate pool sum (sum of cb_before)
    const poolSum = members.reduce((sum, m) => sum + m.cb_before, 0);

    // Validation: Sum(cb_before) ≥ 0
    if (poolSum < 0) {
      const error: any = new Error('Pool sum must be non-negative');
      error.code = 'POOL_SUM_NEGATIVE';
      throw error;
    }

    // Create working copies with cb_after initialized to cb_before
    const workingMembers: Array<PoolMemberInput & { cb_after: number }> = members.map(m => ({
      ...m,
      cb_after: m.cb_before,
    }));

    // Separate surplus (cb > 0) and deficit (cb < 0)
    const surplus = workingMembers.filter(m => m.cb_after > 0).sort((a, b) => b.cb_after - a.cb_after);
    const deficit = workingMembers.filter(m => m.cb_after < 0).sort((a, b) => a.cb_after - b.cb_after);

    // Greedy allocation algorithm
    // For each deficit, draw from surplus in order until deficit reaches 0 or surplus exhausted
    for (const def of deficit) {
      // Draw from surplus ships in descending order
      for (const sur of surplus) {
        if (def.cb_after >= 0) break; // Deficit is fully covered
        
        if (sur.cb_after <= 0) continue; // Surplus is exhausted
        
        // Calculate transfer amount: min of remaining surplus and remaining deficit
        const remainingDeficit = Math.abs(def.cb_after);
        const transfer = Math.min(sur.cb_after, remainingDeficit);
        
        // Apply transfer
        def.cb_after += transfer;
        sur.cb_after -= transfer;
      }
    }

    // Validate rules after allocation
    for (const member of workingMembers) {
      // Rule 1: No deficit ship ends up worse (cb_after ≥ cb_before for deficits)
      if (member.cb_before < 0 && member.cb_after < member.cb_before) {
        const error: any = new Error(`Deficit ship ${member.shipId} cannot end up worse (cb_after: ${member.cb_after} < cb_before: ${member.cb_before})`);
        error.code = 'DEFICIT_SHIP_WORSE';
        throw error;
      }

      // Rule 2: No surplus ship ends up negative (cb_after ≥ 0 for surpluses)
      if (member.cb_before > 0 && member.cb_after < 0) {
        const error: any = new Error(`Surplus ship ${member.shipId} cannot end up negative (cb_after: ${member.cb_after} < 0)`);
        error.code = 'SURPLUS_SHIP_NEGATIVE';
        throw error;
      }
    }

    // Calculate final pool sum (sum of cb_after)
    const finalPoolSum = workingMembers.reduce((sum, m) => sum + m.cb_after, 0);

    // Build result
    const result: PoolMemberOutput[] = workingMembers.map(m => ({
      shipId: m.shipId,
      cb_before: m.cb_before,
      cb_after: m.cb_after,
    }));

    return {
      year,
      members: result,
      poolSum: finalPoolSum,
    };
  }
}
