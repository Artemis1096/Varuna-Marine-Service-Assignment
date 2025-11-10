export interface PoolMemberInput {
  shipId: string;
  cb_before: number; // in gCO2e
}

export interface PoolMemberOutput {
  shipId: string;
  cb_before: number; // in gCO2e
  cb_after: number; // in gCO2e
}

export interface CreatePoolResult {
  year: number;
  members: PoolMemberOutput[];
  poolSum: number; // Sum of cb_after in gCO2e
}

export interface CreatePoolPort {
  execute(year: number, members: PoolMemberInput[]): CreatePoolResult;
}

