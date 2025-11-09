import { BackendApi } from "./BackendApi";
import type { RoutesPort } from "../../../core/ports/RoutesPort";

export const RoutesApiAdapter: RoutesPort = {
  async getRoutes(filters) {
    const res = await BackendApi.getRoutes(filters);
    return res.data;
  },

  async setBaseline(routeCode) {
    await BackendApi.setBaseline(routeCode);
  }
};

