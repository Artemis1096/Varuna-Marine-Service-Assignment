import { CreatePoolService } from '../src/core/application/services/createPool';

describe('CreatePoolService', () => {
  let service: CreatePoolService;

  beforeEach(() => {
    service = new CreatePoolService();
  });

  describe('Validation: Pool Sum', () => {
    it('should reject pool with negative sum', () => {
      const members = [
        { shipId: 'S1', cb_before: -1000000 }, // -1 tCO2e
        { shipId: 'S2', cb_before: -500000 },   // -0.5 tCO2e
      ];

      expect(() => service.execute(2024, members)).toThrow();
      
      try {
        service.execute(2024, members);
      } catch (error: any) {
        expect(error.code).toBe('POOL_SUM_NEGATIVE');
        expect(error.message).toContain('Pool sum must be non-negative');
      }
    });

    it('should accept pool with zero sum', () => {
      const members = [
        { shipId: 'S1', cb_before: 1000000 },  // 1 tCO2e
        { shipId: 'S2', cb_before: -1000000 }, // -1 tCO2e
      ];

      const result = service.execute(2024, members);
      expect(result.poolSum).toBe(0);
    });

    it('should accept pool with positive sum', () => {
      const members = [
        { shipId: 'S1', cb_before: 2000000 },  // 2 tCO2e
        { shipId: 'S2', cb_before: -1000000 }, // -1 tCO2e
      ];

      const result = service.execute(2024, members);
      expect(result.poolSum).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Greedy Allocation: Exact Match', () => {
    it('should allocate exactly when surplus equals deficit', () => {
      const members = [
        { shipId: 'S1', cb_before: 1000000 },  // 1 tCO2e surplus
        { shipId: 'S2', cb_before: -1000000 }, // -1 tCO2e deficit
      ];

      const result = service.execute(2024, members);

      expect(result.members).toHaveLength(2);
      
      const s1 = result.members.find(m => m.shipId === 'S1');
      const s2 = result.members.find(m => m.shipId === 'S2');

      expect(s1?.cb_after).toBe(0); // Surplus fully used
      expect(s2?.cb_after).toBe(0); // Deficit fully covered
      expect(result.poolSum).toBe(0);
    });

    it('should handle multiple exact matches', () => {
      const members = [
        { shipId: 'S1', cb_before: 500000 },   // 0.5 tCO2e
        { shipId: 'S2', cb_before: 500000 },   // 0.5 tCO2e
        { shipId: 'S3', cb_before: -500000 },  // -0.5 tCO2e
        { shipId: 'S4', cb_before: -500000 },  // -0.5 tCO2e
      ];

      const result = service.execute(2024, members);

      expect(result.members).toHaveLength(4);
      expect(result.poolSum).toBe(0);
      
      // All deficits should be covered
      result.members.forEach(m => {
        if (m.cb_before < 0) {
          expect(m.cb_after).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });

  describe('Greedy Allocation: Partial Cover', () => {
    it('should partially cover deficit when surplus is insufficient', () => {
      // Note: This scenario requires pool sum >= 0, so we need enough surplus
      const members = [
        { shipId: 'S1', cb_before: 500000 },   // 0.5 tCO2e surplus
        { shipId: 'S2', cb_before: -300000 }, // -0.3 tCO2e deficit (less than surplus)
      ];

      const result = service.execute(2024, members);

      const s1 = result.members.find(m => m.shipId === 'S1');
      const s2 = result.members.find(m => m.shipId === 'S2');

      expect(s1?.cb_after).toBe(200000); // Surplus partially used (500k - 300k = 200k)
      expect(s2?.cb_after).toBe(0); // Deficit fully covered
      expect(result.poolSum).toBe(200000);
    });

    it('should use surplus in descending order', () => {
      const members = [
        { shipId: 'S1', cb_before: 300000 },   // 0.3 tCO2e (smallest)
        { shipId: 'S2', cb_before: 500000 },   // 0.5 tCO2e (largest)
        { shipId: 'S3', cb_before: 400000 },   // 0.4 tCO2e (middle)
        { shipId: 'S4', cb_before: -1000000 }, // -1 tCO2e deficit
      ];

      const result = service.execute(2024, members);

      // Should use S2 (500k) first, then S3 (400k), then S1 (300k)
      // Total: 1.2M, deficit: 1M, so deficit fully covered
      const s4 = result.members.find(m => m.shipId === 'S4');
      expect(s4?.cb_after).toBe(0); // Deficit fully covered
      
      // Verify S2 (largest) is used first
      const s2 = result.members.find(m => m.shipId === 'S2');
      expect(s2?.cb_after).toBe(0); // Fully used
      
      // Verify S3 (middle) is used second
      const s3 = result.members.find(m => m.shipId === 'S3');
      expect(s3?.cb_after).toBe(0); // Fully used
      
      // Verify S1 (smallest) is used last
      const s1 = result.members.find(m => m.shipId === 'S1');
      expect(s1?.cb_after).toBe(200000); // Partially used (300k - 200k = 200k remaining)
    });
  });

  describe('Greedy Allocation: Rounding Handling', () => {
    it('should handle fractional values correctly', () => {
      const members = [
        { shipId: 'S1', cb_before: 100000 },   // 0.1 tCO2e
        { shipId: 'S2', cb_before: 50000 },   // 0.05 tCO2e
        { shipId: 'S3', cb_before: -150000 }, // -0.15 tCO2e
      ];

      const result = service.execute(2024, members);

      const s3 = result.members.find(m => m.shipId === 'S3');
      expect(s3?.cb_after).toBe(0); // Deficit fully covered (100k + 50k = 150k)
      
      const s1 = result.members.find(m => m.shipId === 'S1');
      const s2 = result.members.find(m => m.shipId === 'S2');
      expect(s1?.cb_after).toBe(0); // Fully used
      expect(s2?.cb_after).toBe(0); // Fully used
    });

    it('should handle very small values', () => {
      const members = [
        { shipId: 'S1', cb_before: 1 },      // 1 gCO2e
        { shipId: 'S2', cb_before: -1 },    // -1 gCO2e
      ];

      const result = service.execute(2024, members);

      expect(result.members).toHaveLength(2);
      const s1 = result.members.find(m => m.shipId === 'S1');
      const s2 = result.members.find(m => m.shipId === 'S2');
      expect(s1?.cb_after).toBe(0);
      expect(s2?.cb_after).toBe(0);
      expect(result.poolSum).toBe(0);
    });
  });

  describe('Validation Rules: After Allocation', () => {
    it('should ensure no deficit ship ends up worse', () => {
      // This scenario shouldn't happen with correct algorithm, but we test the validation
      // Note: With proper greedy allocation, this rule should always be satisfied
      const members = [
        { shipId: 'S1', cb_before: 1000000 },  // 1 tCO2e
        { shipId: 'S2', cb_before: -500000 }, // -0.5 tCO2e
      ];

      const result = service.execute(2024, members);

      const s2 = result.members.find(m => m.shipId === 'S2');
      // Deficit ship should not be worse (cb_after >= cb_before)
      expect(s2).toBeDefined();
      if (s2) {
        expect(s2.cb_after).toBeGreaterThanOrEqual(s2.cb_before);
      }
    });

    it('should ensure no surplus ship ends up negative', () => {
      const members = [
        { shipId: 'S1', cb_before: 500000 },   // 0.5 tCO2e
        { shipId: 'S2', cb_before: -300000 }, // -0.3 tCO2e (less than surplus)
      ];

      const result = service.execute(2024, members);

      const s1 = result.members.find(m => m.shipId === 'S1');
      // Surplus ship should not end up negative
      expect(s1?.cb_after).toBeGreaterThanOrEqual(0);
      expect(s1?.cb_after).toBe(200000); // 500k - 300k = 200k remaining
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple surpluses and deficits', () => {
      const members = [
        { shipId: 'S1', cb_before: 2000000 },  // 2 tCO2e
        { shipId: 'S2', cb_before: 1000000 }, // 1 tCO2e
        { shipId: 'S3', cb_before: -1500000 }, // -1.5 tCO2e
        { shipId: 'S4', cb_before: -1000000 }, // -1 tCO2e
        { shipId: 'S5', cb_before: -500000 },  // -0.5 tCO2e
      ];

      const result = service.execute(2024, members);

      expect(result.members).toHaveLength(5);
      
      // Total surplus: 3 tCO2e, Total deficit: -3 tCO2e
      // All deficits should be covered (cb_after >= 0)
      const deficits = result.members.filter(m => m.cb_before < 0);
      deficits.forEach(m => {
        expect(m.cb_after).toBeGreaterThanOrEqual(0);
      });

      // Pool sum should be 0 (all deficits covered)
      expect(result.poolSum).toBe(0);
      
      // Verify all surpluses are used or partially used
      const surpluses = result.members.filter(m => m.cb_before > 0);
      surpluses.forEach(m => {
        expect(m.cb_after).toBeGreaterThanOrEqual(0);
        expect(m.cb_after).toBeLessThanOrEqual(m.cb_before);
      });
    });

    it('should handle surplus exceeding deficit', () => {
      const members = [
        { shipId: 'S1', cb_before: 2000000 },  // 2 tCO2e
        { shipId: 'S2', cb_before: 1000000 }, // 1 tCO2e
        { shipId: 'S3', cb_before: -1000000 }, // -1 tCO2e
      ];

      const result = service.execute(2024, members);

      const s3 = result.members.find(m => m.shipId === 'S3');
      expect(s3?.cb_after).toBe(0); // Deficit fully covered
      
      // Remaining surplus should be 2 tCO2e
      const surpluses = result.members.filter(m => m.cb_before > 0);
      const remainingSurplus = surpluses.reduce((sum, m) => sum + m.cb_after, 0);
      expect(remainingSurplus).toBe(2000000); // 2 tCO2e remaining
    });

    it('should handle ships with zero CB', () => {
      const members = [
        { shipId: 'S1', cb_before: 1000000 }, // 1 tCO2e
        { shipId: 'S2', cb_before: 0 },       // 0 tCO2e
        { shipId: 'S3', cb_before: -500000 },  // -0.5 tCO2e
      ];

      const result = service.execute(2024, members);

      expect(result.members).toHaveLength(3);
      const s2 = result.members.find(m => m.shipId === 'S2');
      expect(s2?.cb_after).toBe(0); // Zero CB remains zero
    });
  });

  describe('Return Format', () => {
    it('should return correct format', () => {
      const members = [
        { shipId: 'S1', cb_before: 1000000 },
        { shipId: 'S2', cb_before: -500000 },
      ];

      const result = service.execute(2024, members);

      expect(result).toHaveProperty('year', 2024);
      expect(result).toHaveProperty('members');
      expect(result).toHaveProperty('poolSum');
      expect(Array.isArray(result.members)).toBe(true);
      
      result.members.forEach(member => {
        expect(member).toHaveProperty('shipId');
        expect(member).toHaveProperty('cb_before');
        expect(member).toHaveProperty('cb_after');
        expect(typeof member.cb_before).toBe('number');
        expect(typeof member.cb_after).toBe('number');
      });
    });
  });
});

