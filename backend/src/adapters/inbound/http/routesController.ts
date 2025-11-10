import { Request, Response } from "express";
import { GetRoutesService } from "../../../core/application/services/getRoutes";
import { SetBaselineService } from "../../../core/application/services/setBaseline";
import { RoutesRepository } from "../../outbound/postgres/RoutesRepository";

const routesRepo = new RoutesRepository();
const getRoutes = new GetRoutesService(routesRepo);
const setBaseline = new SetBaselineService(routesRepo);

export async function getRoutesHandler(req: Request, res: Response) {
  try {
    const { vesselType, fuelType, year } = req.query;

    // Validate year parameter if provided
    if (year !== undefined && year !== null && year !== '') {
      const yearNum = Number(year);
      if (isNaN(yearNum) || !Number.isInteger(yearNum)) {
        return res.status(400).json({ error: 'year must be a valid integer' });
      }
    }

    const filters: { vesselType?: string; fuelType?: string; year?: number } = {};
    
    if (vesselType && typeof vesselType === 'string') {
      filters.vesselType = vesselType;
    }
    
    if (fuelType && typeof fuelType === 'string') {
      filters.fuelType = fuelType;
    }
    
    if (year !== undefined && year !== null && year !== '') {
      filters.year = Number(year);
    }

    const routes = await getRoutes.execute(filters);
    res.json(routes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function setBaselineHandler(req: Request, res: Response) {
  try {
    const { code } = req.params;
    await setBaseline.execute(code);
    res.json({ message: "Baseline updated" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
