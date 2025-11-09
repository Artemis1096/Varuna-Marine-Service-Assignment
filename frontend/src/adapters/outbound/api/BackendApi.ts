import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" }
});

export const BackendApi = {
  getRoutes: (params?: any) => api.get("/routes", { params }),

  setBaseline: (routeCode: string) => api.post(`/routes/${routeCode}/baseline`),

  getComparison: () => api.get("/routes/comparison"),

  getCB: (routeCode: string, year: number) =>
    api.get("/compliance/cb", { params: { routeCode, year }}),

  bankSurplus: (routeCode: string, year: number) =>
    api.post("/banking/bank", { routeCode, year }),

  applyBanked: (routeCode: string, year: number) =>
    api.post("/banking/apply", { routeCode, year }),

  createPool: (name: string, year: number, members: string[]) =>
    api.post("/pools", { name, year, members })
};

