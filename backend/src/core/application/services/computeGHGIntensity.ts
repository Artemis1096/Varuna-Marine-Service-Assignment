/**
 * Compute GHG Intensity based on FuelEU Maritime methodology
 * Uses Annex II default pathway emission factors
 * 
 * For LNG with unknown engine type, assumes LNG Otto medium-speed
 * with methane slip = 3.1%
 */

// Annex II default pathway WtT emission intensities (gCO2e/MJ)
const WTT_EMISSION_FACTORS: Record<string, number> = {
  HFO: 13.27,
  MGO: 11.27,
  'MGO/MDO': 11.27,
  MDO: 11.27,
  LNG: 18.59,
};

// TtW CO2 emission factors (gCO2/MJ)
const TTW_CO2_FACTORS: Record<string, number> = {
  HFO: 77.4,
  MGO: 74.1,
  'MGO/MDO': 74.1,
  MDO: 74.1,
  LNG: 56.0,
};

// GWP100 factors
const GWP100_CH4 = 25; // Methane

// Energy conversion factor
const MJ_PER_TONNE = 41000;

// LNG Otto medium-speed methane slip percentage
const LNG_METHANE_SLIP_PERCENT = 3.1;

export interface GHGIntensityResult {
  intensity_gCO2e_per_MJ: number;
  energy_MJ: number;
}

/**
 * Compute GHG intensity (WtW) for a given fuel type and consumption
 * 
 * @param fuelType - Fuel type (HFO, MGO/MDO, LNG)
 * @param fuelConsumptionTonnes - Fuel consumption in tonnes
 * @returns Object containing intensity (gCO2e/MJ) and total energy (MJ)
 */
export function computeGHGIntensity(
  fuelType: string,
  fuelConsumptionTonnes: number
): GHGIntensityResult {
  // Normalize fuel type
  const normalizedFuelType = fuelType.toUpperCase().trim();

  // Validate fuel type
  if (!WTT_EMISSION_FACTORS[normalizedFuelType]) {
    throw new Error(
      `Unsupported fuel type: ${fuelType}. Supported fuels: HFO, MGO/MDO, LNG`
    );
  }

  // Calculate total energy (MJ)
  const energy_MJ = fuelConsumptionTonnes * MJ_PER_TONNE;

  // Get WtT emission intensity (gCO2e/MJ)
  const wttIntensity = WTT_EMISSION_FACTORS[normalizedFuelType];

  // Get TtW CO2 emission factor (gCO2/MJ)
  const ttwCO2Factor = TTW_CO2_FACTORS[normalizedFuelType];

  // Calculate TtW CO2 emissions (gCO2e/MJ)
  // CO2 emissions are already in CO2e terms
  let ttwCO2e = ttwCO2Factor;

  // Calculate CH4 emissions for LNG (methane slip)
  let ttwCH4e = 0;
  if (normalizedFuelType === 'LNG') {
    // Methane slip: 3.1% of fuel energy
    // CH4 energy = 3.1% of total energy
    // CH4 emissions in gCO2e/MJ = (CH4 energy / total energy) * GWP100_CH4
    const ch4EnergyFraction = LNG_METHANE_SLIP_PERCENT / 100;
    ttwCH4e = ch4EnergyFraction * GWP100_CH4;
  }

  // N2O emissions (not applicable for these fuels in default pathway)
  // If needed in future, would be calculated similarly
  const ttwN2Oe = 0;

  // Calculate total TtW intensity (gCO2e/MJ)
  const ttwIntensity = ttwCO2e + ttwCH4e + ttwN2Oe;

  // Calculate WtW intensity = WtT + TtW (gCO2e/MJ)
  const intensity_gCO2e_per_MJ = wttIntensity + ttwIntensity;

  return {
    intensity_gCO2e_per_MJ,
    energy_MJ,
  };
}

