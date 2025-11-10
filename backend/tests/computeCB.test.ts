import { computeCB } from '../src/core/application/services/computeCB';
import { FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ } from '../src/shared/constants/fuelEU';

describe('computeCB', () => {
  describe('Target Intensity', () => {
    it('should use FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ = 89.3368', () => {
      expect(FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ).toBe(89.3368);
    });

    it('should use the correct target intensity in CB calculation', () => {
      // Test with HFO, 1 tonne
      // HFO intensity: ~90.67 gCO2e/MJ
      // Energy: 1 * 41000 = 41000 MJ
      // CB = (89.3368 - 90.67) * 41000 = -54692 gCO2e = -0.054692 tCO2e
      const result = computeCB('HFO', 1);
      
      // Verify the target intensity is used (result should reflect 89.3368, not 91.16)
      // If using 91.16: CB = (91.16 - 90.67) * 41000 = 20090 gCO2e = 0.02009 tCO2e
      // If using 89.3368: CB = (89.3368 - 90.67) * 41000 = -54692 gCO2e = -0.054692 tCO2e
      expect(result.cb_tonnesCO2e).toBeCloseTo(-0.054692, 4);
    });
  });

  describe('CB Calculation', () => {
    it('should calculate CB correctly for HFO', () => {
      const result = computeCB('HFO', 1);
      expect(result.actual_intensity).toBeCloseTo(90.67, 2);
      expect(result.energy_MJ).toBe(41000);
      // CB = (89.3368 - 90.67) * 41000 / 1_000_000
      expect(result.cb_tonnesCO2e).toBeCloseTo(-0.054692, 4);
    });

    it('should calculate CB correctly for MGO', () => {
      const result = computeCB('MGO', 1);
      expect(result.actual_intensity).toBeCloseTo(85.37, 2);
      expect(result.energy_MJ).toBe(41000);
      // CB = (89.3368 - 85.37) * 41000 / 1_000_000
      expect(result.cb_tonnesCO2e).toBeCloseTo(0.1626, 4);
    });

    it('should calculate CB correctly for LNG', () => {
      const result = computeCB('LNG', 1);
      expect(result.actual_intensity).toBeCloseTo(75.365, 2);
      expect(result.energy_MJ).toBe(41000);
      // CB = (89.3368 - 75.365) * 41000 / 1_000_000
      expect(result.cb_tonnesCO2e).toBeCloseTo(0.5728, 4);
    });
  });
});

