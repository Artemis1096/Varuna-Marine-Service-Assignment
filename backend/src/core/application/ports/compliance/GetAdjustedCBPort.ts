export interface AdjustedCBResult {
  shipId: string;
  shipName?: string;
  year: number;
  cb_before: number; // Raw CB in gCO2e
  cb_adjusted: number; // Adjusted CB in gCO2e
}

export interface GetAdjustedCBPort {
  execute(year: number): Promise<AdjustedCBResult[]>;
}

