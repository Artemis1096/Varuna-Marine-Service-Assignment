import { BackendApi } from "./BackendApi";
import type { BankingPort } from "../../../core/ports/BankingPort";

export const BankingApiAdapter: BankingPort = {
  async getCB(routeCode, year) {
    const res = await BackendApi.getCB(routeCode, year);
    return res.data;
  },

  async bankSurplus(routeCode, year) {
    const res = await BackendApi.bankSurplus(routeCode, year);
    return res.data;
  },

  async applyBanked(routeCode, year) {
    const res = await BackendApi.applyBanked(routeCode, year);
    return res.data;
  }
};

