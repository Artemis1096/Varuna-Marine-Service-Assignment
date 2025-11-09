import { BackendApi } from "./BackendApi";
import type { ComparisonPort } from "../../../core/ports/ComparisonPort";

export const ComparisonApiAdapter: ComparisonPort = {
  async getComparison() {
    const res = await BackendApi.getComparison();
    return res.data;
  }
};

