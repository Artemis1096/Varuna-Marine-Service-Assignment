import { computeGHGIntensity } from '../src/core/application/services/computeGHGIntensity';

describe('computeGHGIntensity', () => {
  describe('Energy calculation', () => {
    it('should calculate energy correctly: fuelConsumptionTonnes * 41000 MJ/tonne', () => {
      const result = computeGHGIntensity('HFO', 1);
      expect(result.energy_MJ).toBe(41000);
    });

    it('should calculate energy for 2.5 tonnes', () => {
      const result = computeGHGIntensity('MGO', 2.5);
      expect(result.energy_MJ).toBe(102500); // 2.5 * 41000
    });
  });

  describe('WtT emission factors (Annex II default pathway)', () => {
    it('should use correct WtT factor for HFO: 13.27 gCO2e/MJ', () => {
      const result = computeGHGIntensity('HFO', 1);
      // WtT = 13.27, TtW CO2 = 77.4, Total = 90.67
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(90.67, 2);
    });

    it('should use correct WtT factor for MGO: 11.27 gCO2e/MJ', () => {
      const result = computeGHGIntensity('MGO', 1);
      // WtT = 11.27, TtW CO2 = 74.1, Total = 85.37
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(85.37, 2);
    });

    it('should use correct WtT factor for LNG: 18.59 gCO2e/MJ', () => {
      const result = computeGHGIntensity('LNG', 1);
      // WtT = 18.59, TtW CO2 = 56.0, TtW CH4 = 3.1% * 25 = 0.775, Total = 75.365
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(75.365, 2);
    });
  });

  describe('TtW CO2 emission factors', () => {
    it('should use correct TtW CO2 factor for HFO: 77.4 gCO2/MJ', () => {
      const result = computeGHGIntensity('HFO', 1);
      // WtT = 13.27, TtW CO2 = 77.4, Total = 90.67
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(90.67, 2);
    });

    it('should use correct TtW CO2 factor for MGO: 74.1 gCO2/MJ', () => {
      const result = computeGHGIntensity('MGO', 1);
      // WtT = 11.27, TtW CO2 = 74.1, Total = 85.37
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(85.37, 2);
    });

    it('should use correct TtW CO2 factor for LNG: 56.0 gCO2/MJ', () => {
      const result = computeGHGIntensity('LNG', 1);
      // WtT = 18.59, TtW CO2 = 56.0, TtW CH4 = 0.775, Total = 75.365
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(75.365, 2);
    });
  });

  describe('LNG methane slip calculation', () => {
    it('should apply 3.1% methane slip for LNG with GWP100=25', () => {
      const result = computeGHGIntensity('LNG', 1);
      // CH4 slip: 3.1% * 25 = 0.775 gCO2e/MJ
      // WtT = 18.59, TtW CO2 = 56.0, TtW CH4 = 0.775, Total = 75.365
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(75.365, 2);
    });

    it('should not apply methane slip for non-LNG fuels', () => {
      const hfoResult = computeGHGIntensity('HFO', 1);
      const mgoResult = computeGHGIntensity('MGO', 1);
      
      // HFO: WtT = 13.27, TtW CO2 = 77.4, Total = 90.67
      expect(hfoResult.intensity_gCO2e_per_MJ).toBeCloseTo(90.67, 2);
      
      // MGO: WtT = 11.27, TtW CO2 = 74.1, Total = 85.37
      expect(mgoResult.intensity_gCO2e_per_MJ).toBeCloseTo(85.37, 2);
    });
  });

  describe('Relative ranking verification (R001, R002, R003 sample values)', () => {
    // Using sample values for R001, R002, R003
    // Assuming same fuel consumption for comparison
    const fuelConsumption = 100; // tonnes

    it('should calculate correct WtW intensity for all three fuels', () => {
      const lngResult = computeGHGIntensity('LNG', fuelConsumption);
      const hfoResult = computeGHGIntensity('HFO', fuelConsumption);
      const mgoResult = computeGHGIntensity('MGO', fuelConsumption);

      // LNG: 75.365 gCO2e/MJ (lowest intensity - best)
      // MGO: 85.37 gCO2e/MJ (middle)
      // HFO: 90.67 gCO2e/MJ (highest intensity - worst)
      
      expect(lngResult.intensity_gCO2e_per_MJ).toBeCloseTo(75.365, 2);
      expect(mgoResult.intensity_gCO2e_per_MJ).toBeCloseTo(85.37, 2);
      expect(hfoResult.intensity_gCO2e_per_MJ).toBeCloseTo(90.67, 2);
    });

    it('should verify actual ranking: HFO > MGO > LNG (highest to lowest intensity)', () => {
      const lngResult = computeGHGIntensity('LNG', fuelConsumption);
      const hfoResult = computeGHGIntensity('HFO', fuelConsumption);
      const mgoResult = computeGHGIntensity('MGO', fuelConsumption);

      // Verify ranking: HFO (90.67) > MGO (85.37) > LNG (75.365)
      // Note: Lower intensity is better (less emissions)
      expect(hfoResult.intensity_gCO2e_per_MJ).toBeGreaterThan(
        mgoResult.intensity_gCO2e_per_MJ
      );
      expect(mgoResult.intensity_gCO2e_per_MJ).toBeGreaterThan(
        lngResult.intensity_gCO2e_per_MJ
      );
      
      // Verify LNG has the lowest intensity (best for environment)
      expect(lngResult.intensity_gCO2e_per_MJ).toBeLessThan(
        hfoResult.intensity_gCO2e_per_MJ
      );
      expect(lngResult.intensity_gCO2e_per_MJ).toBeLessThan(
        mgoResult.intensity_gCO2e_per_MJ
      );
    });
  });

  describe('Fuel type normalization', () => {
    it('should handle MGO/MDO as MGO', () => {
      const mgoResult = computeGHGIntensity('MGO', 1);
      const mdoResult = computeGHGIntensity('MDO', 1);
      const mgoMdoResult = computeGHGIntensity('MGO/MDO', 1);

      expect(mgoResult.intensity_gCO2e_per_MJ).toBe(mdoResult.intensity_gCO2e_per_MJ);
      expect(mgoResult.intensity_gCO2e_per_MJ).toBe(mgoMdoResult.intensity_gCO2e_per_MJ);
    });

    it('should handle case-insensitive fuel types', () => {
      const hfoUpper = computeGHGIntensity('HFO', 1);
      const hfoLower = computeGHGIntensity('hfo', 1);
      const hfoMixed = computeGHGIntensity('Hfo', 1);

      expect(hfoUpper.intensity_gCO2e_per_MJ).toBe(hfoLower.intensity_gCO2e_per_MJ);
      expect(hfoUpper.intensity_gCO2e_per_MJ).toBe(hfoMixed.intensity_gCO2e_per_MJ);
    });
  });

  describe('Error handling', () => {
    it('should throw error for unsupported fuel type', () => {
      expect(() => {
        computeGHGIntensity('BIOFUEL', 1);
      }).toThrow('Unsupported fuel type: BIOFUEL. Supported fuels: HFO, MGO/MDO, LNG');
    });
  });

  describe('Complete calculation examples', () => {
    it('should calculate correctly for R001 sample (HFO, 100 tonnes)', () => {
      const result = computeGHGIntensity('HFO', 100);
      
      // Energy: 100 * 41000 = 4,100,000 MJ
      expect(result.energy_MJ).toBe(4100000);
      
      // Intensity: WtT (13.27) + TtW CO2 (77.4) = 90.67 gCO2e/MJ
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(90.67, 2);
    });

    it('should calculate correctly for R002 sample (MGO, 100 tonnes)', () => {
      const result = computeGHGIntensity('MGO', 100);
      
      // Energy: 100 * 41000 = 4,100,000 MJ
      expect(result.energy_MJ).toBe(4100000);
      
      // Intensity: WtT (11.27) + TtW CO2 (74.1) = 85.37 gCO2e/MJ
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(85.37, 2);
    });

    it('should calculate correctly for R003 sample (LNG, 100 tonnes)', () => {
      const result = computeGHGIntensity('LNG', 100);
      
      // Energy: 100 * 41000 = 4,100,000 MJ
      expect(result.energy_MJ).toBe(4100000);
      
      // Intensity: WtT (18.59) + TtW CO2 (56.0) + TtW CH4 (3.1% * 25 = 0.775) = 75.365 gCO2e/MJ
      expect(result.intensity_gCO2e_per_MJ).toBeCloseTo(75.365, 2);
    });
  });
});

