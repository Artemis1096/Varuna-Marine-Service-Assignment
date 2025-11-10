import { BackendApi } from "./BackendApi";
import type { BankingPort } from "../../../core/ports/BankingPort";

export const BankingApiAdapter: BankingPort = {
  async getCB(shipId, year) {
    const res = await BackendApi.getCB(shipId, year);
    return res.data;
  },

  async bankSurplus(shipId, year, amount_gco2eq) {
    const res = await BackendApi.bankSurplus(shipId, year, amount_gco2eq);
    return res.data;
  },

  async applyBanked(shipId, year, amount_gco2eq) {
    const res = await BackendApi.applyBanked(shipId, year, amount_gco2eq);
    return res.data;
  }
};

