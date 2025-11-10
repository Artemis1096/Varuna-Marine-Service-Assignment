import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" }
});

export const BackendApi = {
  getRoutes: (params?: any) => api.get("/routes", { params }),

  setBaseline: (routeCode: string) => api.post(`/routes/${routeCode}/baseline`),

  getComparison: () => api.get("/routes/comparison"),

  getCB: (shipId: string, year: number) =>
    api.get("/compliance/cb", { params: { shipId, year }}),

  bankSurplus: (shipId: string, year: number, amount_gco2eq: number) =>
    api.post("/banking/bank", { shipId, year, amount_gco2eq }),

  applyBanked: (shipId: string, year: number, amount_gco2eq: number) =>
    api.post("/banking/apply", { shipId, year, amount_gco2eq }),

  createPool: (year: number, members: Array<{ shipId: string; cb_before: number }>) =>
    api.post("/pools", { year, members }),

  getAdjustedCB: (year: number) =>
    api.get("/compliance/adjusted-cb", { params: { year } })
};

