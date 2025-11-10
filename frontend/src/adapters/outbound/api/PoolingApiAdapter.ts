import { BackendApi } from "./BackendApi";
import type { PoolingPort, AdjustedCBData, CreatePoolResult, PoolMemberInput } from "../../../core/ports/PoolingPort";

export const PoolingApiAdapter: PoolingPort = {
  async getAdjustedCB(year) {
    const res = await BackendApi.getAdjustedCB(year);
    return res.data;
  },

  async createPool(year, members) {
    const res = await BackendApi.createPool(year, members);
    return res.data;
  }
};

