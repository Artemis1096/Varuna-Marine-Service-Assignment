/**
 * Compute Compliance Balance (CB) based on FuelEU Maritime methodology
 * 
 * CB = (TARGET_INTENSITY - actual_intensity) * energy_MJ
 * 
 * Positive CB = surplus (better than target)
 * Negative CB = deficit (worse than target)
 */

import { computeGHGIntensity } from './computeGHGIntensity';
import { FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ } from '../../../shared/constants/fuelEU';

// Conversion factor: grams to tonnes
const GRAMS_PER_TONNE = 1_000_000;

export interface CBResult {
  energy_MJ: number;
  actual_intensity: number; // gCO2e/MJ
  cb_gCO2e: number; // Compliance balance in grams CO2e
  cb_tonnesCO2e: number; // Compliance balance in tonnes CO2e
}

/**
 * Compute Compliance Balance (CB) for a given fuel type and consumption
 * 
 * @param fuelType - Fuel type (HFO, MGO/MDO, LNG)
 * @param fuelConsumptionTonnes - Fuel consumption in tonnes
 * @returns Object containing energy, actual intensity, and CB values
 */
export function computeCB(
  fuelType: string,
  fuelConsumptionTonnes: number
): CBResult {
  // Call computeGHGIntensity to get intensity and energy
  const { intensity_gCO2e_per_MJ, energy_MJ } = computeGHGIntensity(
    fuelType,
    fuelConsumptionTonnes
  );

  // Calculate Compliance Balance
  // CB = (TARGET_INTENSITY - actual_intensity) * energy_MJ
  // Positive value = surplus (better than target)
  // Negative value = deficit (worse than target)
  const cb_gCO2e = (FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ - intensity_gCO2e_per_MJ) * energy_MJ;

  // Convert to tonnes CO2e
  const cb_tonnesCO2e = cb_gCO2e / GRAMS_PER_TONNE;

  return {
    energy_MJ,
    actual_intensity: intensity_gCO2e_per_MJ,
    cb_gCO2e,
    cb_tonnesCO2e,
  };
}

