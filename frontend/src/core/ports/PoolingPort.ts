export interface AdjustedCBData {
  shipId: string;
  shipName?: string;
  year: number;
  cb_before: number;
  cb_adjusted: number;
}

export interface PoolMemberInput {
  shipId: string;
  cb_before: number;
}

export interface PoolMemberOutput {
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export interface CreatePoolResult {
  year: number;
  members: PoolMemberOutput[];
  poolSum: number;
}

export interface PoolingPort {
  getAdjustedCB(year: number): Promise<AdjustedCBData[]>;
  createPool(year: number, members: PoolMemberInput[]): Promise<CreatePoolResult>;
}

