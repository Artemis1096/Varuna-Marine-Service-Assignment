import { BackendApi } from "./BackendApi";
import type { PoolingPort } from "../../../core/ports/PoolingPort";

export const PoolingApiAdapter: PoolingPort = {
  async createPool(name, year, members) {
    const res = await BackendApi.createPool(name, year, members);
    return res.data;
  }
};

